"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { GradeType } from "@prisma/client";
import { authorize, AuthError } from "@/lib/auth";
import { gradeSchema, validate, ValidationError } from "@/lib/validations";
import type { ActionResult } from "@/types";

export async function getGradesByClassSubjectTerm(classSubjectId: string, termId: string) {
  return prisma.grade.findMany({
    where: { classSubjectId, termId },
    include: { student: true },
    orderBy: { student: { lastName: "asc" } },
  });
}

export async function getStudentsByClass(classId: string, academicYearId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { classId, academicYearId, status: "ACTIVE" },
    include: { student: true },
    orderBy: { student: { lastName: "asc" } },
  });
  return enrollments.map((e) => e.student);
}

export async function saveGrades(data: {
  classSubjectId: string;
  termId: string;
  teacherId: string;
  type: GradeType;
  description: string;
  grades: { studentId: string; value: number }[];
}): Promise<ActionResult> {
  try {
    await authorize(["ADMIN", "TEACHER"]);
    const validated = validate(gradeSchema, data);

    for (const grade of validated.grades) {
      await prisma.grade.create({
        data: {
          studentId: grade.studentId,
          classSubjectId: validated.classSubjectId,
          termId: validated.termId,
          teacherId: validated.teacherId,
          type: validated.type as GradeType,
          value: grade.value,
          description: validated.description,
        },
      });
    }
    revalidatePath("/dashboard/saisie-notes");
    revalidatePath("/dashboard/notes");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError || e instanceof ValidationError) return { error: e.message };
    throw e;
  }
}

export async function deleteGrade(id: string): Promise<ActionResult> {
  try {
    await authorize(["ADMIN", "TEACHER"]);
    await prisma.grade.delete({ where: { id } });
    revalidatePath("/dashboard/notes");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: e.message };
    throw e;
  }
}

export async function getGradesByStudent(studentId: string, termId?: string) {
  return prisma.grade.findMany({
    where: { studentId, ...(termId ? { termId } : {}) },
    include: { classSubject: { include: { subject: true } }, term: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getTeacherAssignments(teacherId: string) {
  return prisma.teacherAssignment.findMany({
    where: { teacherId },
    include: { class: true, classSubject: { include: { subject: true } } },
  });
}
