"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { authorize, AuthError } from "@/lib/auth";
import { classSchema, validate, ValidationError } from "@/lib/validations";
import type { ActionResult } from "@/types";

export async function getClasses() {
  return prisma.class.findMany({
    include: {
      classSubjects: { include: { subject: true } },
      teacherAssignments: { include: { teacher: true, classSubject: { include: { subject: true } } } },
      _count: { select: { enrollments: true } },
    },
    orderBy: { name: "asc" },
  });
}

export async function createClass(formData: FormData): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    const validated = validate(classSchema, {
      name: formData.get("name"),
      level: formData.get("level"),
      section: formData.get("section") || null,
      capacity: parseInt(formData.get("capacity") as string) || 60,
    });

    await prisma.class.create({ data: { name: validated.name, level: validated.level, section: validated.section || null, capacity: validated.capacity } });
    revalidatePath("/dashboard/classes");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError || e instanceof ValidationError) return { error: e.message };
    throw e;
  }
}

export async function deleteClass(id: string): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    await prisma.class.delete({ where: { id } });
    revalidatePath("/dashboard/classes");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: e.message };
    throw e;
  }
}

export async function addClassSubject(classId: string, subjectId: string, coefficient: number): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    await prisma.classSubject.create({ data: { classId, subjectId, coefficient } });
    revalidatePath("/dashboard/classes");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: e.message };
    throw e;
  }
}

export async function removeClassSubject(id: string): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    await prisma.classSubject.delete({ where: { id } });
    revalidatePath("/dashboard/classes");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: e.message };
    throw e;
  }
}

export async function assignTeacher(teacherId: string, classId: string, classSubjectId: string): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    await prisma.teacherAssignment.create({ data: { teacherId, classId, classSubjectId } });
    revalidatePath("/dashboard/classes");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: e.message };
    throw e;
  }
}

export async function removeTeacherAssignment(id: string): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    await prisma.teacherAssignment.delete({ where: { id } });
    revalidatePath("/dashboard/classes");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: e.message };
    throw e;
  }
}
