"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getAppreciation } from "@/config/cameroon-education";
import { authorize, AuthError } from "@/lib/auth";
import type { ActionResult } from "@/types";

function computeSubjectAverage(grades: { type: string; value: number }[]): number {
  const devoirs = grades.filter((g) => g.type === "DEVOIR" || g.type === "INTERROGATION");
  const compositions = grades.filter((g) => g.type === "COMPOSITION");

  if (compositions.length > 0 && devoirs.length > 0) {
    const moyDevoirs = devoirs.reduce((sum, g) => sum + g.value, 0) / devoirs.length;
    const moyComposition = compositions.reduce((sum, g) => sum + g.value, 0) / compositions.length;
    return Math.round(((moyDevoirs + 2 * moyComposition) / 3) * 100) / 100;
  }

  if (grades.length === 0) return 0;
  return Math.round((grades.reduce((sum, g) => sum + g.value, 0) / grades.length) * 100) / 100;
}

export async function generateBulletins(classId: string, termId: string): Promise<ActionResult<{ count: number }>> {
  try {
    await authorize(["ADMIN", "TEACHER"]);

    const enrollments = await prisma.enrollment.findMany({
      where: { classId, status: "ACTIVE" },
      include: { student: true },
    });

    const classSubjects = await prisma.classSubject.findMany({
      where: { classId },
      include: { subject: true },
    });

    if (enrollments.length === 0 || classSubjects.length === 0) {
      return { error: "Aucun eleve inscrit ou aucune matiere configuree." };
    }

    const studentResults: {
      studentId: string;
      generalAverage: number;
      subjectResults: {
        classSubjectId: string;
        average: number;
        coefficient: number;
        total: number;
        teacherName: string | null;
      }[];
    }[] = [];

    for (const enrollment of enrollments) {
      const subjectResults: (typeof studentResults)[0]["subjectResults"] = [];
      let totalWeighted = 0;
      let totalCoeff = 0;

      for (const cs of classSubjects) {
        const grades = await prisma.grade.findMany({
          where: { studentId: enrollment.studentId, classSubjectId: cs.id, termId },
          include: { teacher: true },
        });

        const average = computeSubjectAverage(grades.map((g) => ({ type: g.type, value: g.value })));
        const total = Math.round(average * cs.coefficient * 100) / 100;
        totalWeighted += total;
        totalCoeff += cs.coefficient;

        const teacherName = grades[0]?.teacher
          ? `${grades[0].teacher.firstName} ${grades[0].teacher.lastName}`
          : null;

        subjectResults.push({ classSubjectId: cs.id, average, coefficient: cs.coefficient, total, teacherName });
      }

      const generalAverage = totalCoeff > 0 ? Math.round((totalWeighted / totalCoeff) * 100) / 100 : 0;
      studentResults.push({ studentId: enrollment.studentId, generalAverage, subjectResults });
    }

    studentResults.sort((a, b) => b.generalAverage - a.generalAverage);

    const classAvg =
      studentResults.length > 0
        ? Math.round((studentResults.reduce((sum, s) => sum + s.generalAverage, 0) / studentResults.length) * 100) / 100
        : 0;

    const subjectStats: Record<string, { avg: number; min: number; max: number }> = {};
    for (const cs of classSubjects) {
      const allAvgs = studentResults.map((s) => s.subjectResults.find((r) => r.classSubjectId === cs.id)?.average ?? 0);
      subjectStats[cs.id] = {
        avg: allAvgs.length > 0 ? Math.round((allAvgs.reduce((a, b) => a + b, 0) / allAvgs.length) * 100) / 100 : 0,
        min: allAvgs.length > 0 ? Math.min(...allAvgs) : 0,
        max: allAvgs.length > 0 ? Math.max(...allAvgs) : 0,
      };
    }

    for (let i = 0; i < studentResults.length; i++) {
      const sr = studentResults[i];
      const rank = i + 1;

      const bulletin = await prisma.bulletin.upsert({
        where: { studentId_termId: { studentId: sr.studentId, termId } },
        update: { generalAverage: sr.generalAverage, rank, totalStudents: studentResults.length, classAverage: classAvg },
        create: { studentId: sr.studentId, termId, generalAverage: sr.generalAverage, rank, totalStudents: studentResults.length, classAverage: classAvg },
      });

      await prisma.bulletinSubjectResult.deleteMany({ where: { bulletinId: bulletin.id } });

      for (const subResult of sr.subjectResults) {
        const stats = subjectStats[subResult.classSubjectId];
        await prisma.bulletinSubjectResult.create({
          data: {
            bulletinId: bulletin.id,
            classSubjectId: subResult.classSubjectId,
            average: subResult.average,
            coefficient: subResult.coefficient,
            total: subResult.total,
            classAverage: stats?.avg,
            classMin: stats?.min,
            classMax: stats?.max,
            appreciation: getAppreciation(subResult.average),
            teacherName: subResult.teacherName,
          },
        });
      }
    }

    revalidatePath("/dashboard/bulletins");
    return { success: true, data: { count: studentResults.length } };
  } catch (e) {
    if (e instanceof AuthError) return { error: e.message };
    throw e;
  }
}

export async function getBulletins(classId?: string, termId?: string) {
  return prisma.bulletin.findMany({
    where: {
      ...(termId ? { termId } : {}),
      ...(classId ? { student: { enrollments: { some: { classId } } } } : {}),
    },
    include: {
      student: true,
      term: { include: { academicYear: true } },
      subjectResults: { include: { classSubject: { include: { subject: true } } } },
    },
    orderBy: { rank: "asc" },
  });
}

export async function getBulletinById(id: string) {
  return prisma.bulletin.findUnique({
    where: { id },
    include: {
      student: true,
      term: { include: { academicYear: true } },
      subjectResults: { include: { classSubject: { include: { subject: true } } }, orderBy: { classSubject: { subject: { category: "asc" } } } },
    },
  });
}

export async function updateBulletinComments(id: string, teacherComment: string, principalComment: string, decision?: string): Promise<ActionResult> {
  try {
    await authorize(["ADMIN", "TEACHER"]);
    await prisma.bulletin.update({ where: { id }, data: { teacherComment, principalComment, decision } });
    revalidatePath("/dashboard/bulletins");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: e.message };
    throw e;
  }
}

export async function getStudentBulletins(studentId: string) {
  return prisma.bulletin.findMany({
    where: { studentId },
    include: {
      term: { include: { academicYear: true } },
      subjectResults: { include: { classSubject: { include: { subject: true } } } },
    },
    orderBy: { term: { sequenceNumber: "asc" } },
  });
}
