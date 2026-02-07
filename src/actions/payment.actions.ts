"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { authorize, AuthError } from "@/lib/auth";
import { feeStructureSchema, paymentSchema, validate, ValidationError } from "@/lib/validations";
import type { ActionResult } from "@/types";

export async function getFeeStructures(academicYearId: string) {
  return prisma.feeStructure.findMany({
    where: { academicYearId },
    orderBy: [{ level: "asc" }, { feeType: "asc" }],
  });
}

export async function createFeeStructure(data: {
  academicYearId: string;
  level: string;
  feeType: string;
  amount: number;
  description?: string;
  dueDate?: string;
}): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    const validated = validate(feeStructureSchema, data);

    await prisma.feeStructure.create({
      data: {
        academicYearId: validated.academicYearId,
        level: validated.level,
        feeType: validated.feeType as never,
        amount: validated.amount,
        description: validated.description,
        dueDate: validated.dueDate ? new Date(validated.dueDate) : undefined,
      },
    });
    revalidatePath("/dashboard/frais");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError || e instanceof ValidationError) return { error: e.message };
    throw e;
  }
}

export async function deleteFeeStructure(id: string): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    await prisma.feeStructure.delete({ where: { id } });
    revalidatePath("/dashboard/frais");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: e.message };
    throw e;
  }
}

export async function getPayments(filters?: { studentId?: string; academicYearId?: string; status?: string }) {
  return prisma.payment.findMany({
    where: {
      ...(filters?.studentId ? { studentId: filters.studentId } : {}),
      ...(filters?.academicYearId ? { academicYearId: filters.academicYearId } : {}),
      ...(filters?.status ? { status: filters.status as never } : {}),
    },
    include: { student: true, academicYear: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getStudentFees(studentId: string, academicYearId: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { enrollments: { where: { academicYearId }, include: { class: true } } },
  });

  if (!student || student.enrollments.length === 0) return { fees: [], payments: [] };

  const level = student.enrollments[0].class.level;

  const fees = await prisma.feeStructure.findMany({
    where: { academicYearId, level },
    orderBy: { feeType: "asc" },
  });

  const payments = await prisma.payment.findMany({
    where: { studentId, academicYearId },
    orderBy: { createdAt: "desc" },
  });

  return { fees, payments };
}

export async function createPaymentRecord(data: {
  studentId: string;
  academicYearId: string;
  feeType: string;
  amount: number;
  method?: string;
  cinetpayTransId?: string;
  cinetpayPaymentUrl?: string;
}): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    const validated = validate(paymentSchema, data);

    await prisma.payment.create({
      data: {
        studentId: validated.studentId,
        academicYearId: validated.academicYearId,
        feeType: validated.feeType as never,
        amount: validated.amount,
        method: validated.method as never,
        cinetpayTransId: validated.cinetpayTransId,
        cinetpayPaymentUrl: validated.cinetpayPaymentUrl,
      },
    });
    revalidatePath("/dashboard/paiements");
    revalidatePath("/dashboard/mes-paiements");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError || e instanceof ValidationError) return { error: e.message };
    throw e;
  }
}

export async function updatePaymentStatus(id: string, status: string, cinetpayData?: object): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    await prisma.payment.update({
      where: { id },
      data: {
        status: status as never,
        cinetpayData: cinetpayData ? (cinetpayData as never) : undefined,
        paidAt: status === "COMPLETED" ? new Date() : undefined,
      },
    });
    revalidatePath("/dashboard/paiements");
    revalidatePath("/dashboard/mes-paiements");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: e.message };
    throw e;
  }
}
