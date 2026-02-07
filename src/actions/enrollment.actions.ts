"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { EnrollmentStatus } from "@prisma/client";
import { authorize, AuthError } from "@/lib/auth";
import { enrollmentSchema, validate, ValidationError } from "@/lib/validations";
import type { ActionResult } from "@/types";

export async function getEnrollments(academicYearId?: string) {
  return prisma.enrollment.findMany({
    where: academicYearId ? { academicYearId } : undefined,
    include: { student: true, class: true, academicYear: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createEnrollment(studentId: string, classId: string, academicYearId: string): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    validate(enrollmentSchema, { studentId, classId, academicYearId });

    await prisma.enrollment.create({ data: { studentId, classId, academicYearId } });
    revalidatePath("/dashboard/inscriptions");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError || e instanceof ValidationError) return { error: e.message };
    throw e;
  }
}

export async function updateEnrollmentStatus(id: string, status: EnrollmentStatus): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    await prisma.enrollment.update({ where: { id }, data: { status } });
    revalidatePath("/dashboard/inscriptions");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: e.message };
    throw e;
  }
}

export async function deleteEnrollment(id: string): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    await prisma.enrollment.delete({ where: { id } });
    revalidatePath("/dashboard/inscriptions");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: e.message };
    throw e;
  }
}
