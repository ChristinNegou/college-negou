"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { authorize, AuthError } from "@/lib/auth";
import { academicYearSchema, validate, ValidationError } from "@/lib/validations";
import type { ActionResult } from "@/types";

export async function getAcademicYears() {
  return prisma.academicYear.findMany({
    include: { terms: { orderBy: { sequenceNumber: "asc" } } },
    orderBy: { startDate: "desc" },
  });
}

export async function createAcademicYear(formData: FormData): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    const validated = validate(academicYearSchema, {
      name: formData.get("name"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
    });

    await prisma.academicYear.create({
      data: {
        name: validated.name,
        startDate: new Date(validated.startDate),
        endDate: new Date(validated.endDate),
        terms: {
          create: [
            { name: "1er Trimestre", sequenceNumber: 1, startDate: new Date(validated.startDate), endDate: new Date(validated.startDate) },
            { name: "2eme Trimestre", sequenceNumber: 2, startDate: new Date(validated.startDate), endDate: new Date(validated.startDate) },
            { name: "3eme Trimestre", sequenceNumber: 3, startDate: new Date(validated.startDate), endDate: new Date(validated.endDate) },
          ],
        },
      },
    });

    revalidatePath("/dashboard/annees");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError || e instanceof ValidationError) return { error: e.message };
    throw e;
  }
}

export async function setCurrentYear(id: string): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    await prisma.academicYear.updateMany({ data: { isCurrent: false } });
    await prisma.academicYear.update({ where: { id }, data: { isCurrent: true } });
    revalidatePath("/dashboard/annees");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: e.message };
    throw e;
  }
}

export async function deleteAcademicYear(id: string): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    await prisma.academicYear.delete({ where: { id } });
    revalidatePath("/dashboard/annees");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: e.message };
    throw e;
  }
}

export async function getCurrentYear() {
  return prisma.academicYear.findFirst({
    where: { isCurrent: true },
    include: { terms: { orderBy: { sequenceNumber: "asc" } } },
  });
}
