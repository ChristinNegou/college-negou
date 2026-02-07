"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { DayOfWeek } from "@prisma/client";
import { authorize, AuthError } from "@/lib/auth";
import { timetableSlotSchema, validate, ValidationError } from "@/lib/validations";
import type { ActionResult } from "@/types";

export async function getTimetableSlots(classId: string) {
  return prisma.timetableSlot.findMany({
    where: { classId },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });
}

export async function createTimetableSlot(data: {
  classId: string;
  subjectName: string;
  teacherName: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  room?: string;
}): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    const validated = validate(timetableSlotSchema, data);

    await prisma.timetableSlot.create({ data: { ...validated, dayOfWeek: validated.dayOfWeek as DayOfWeek } });
    revalidatePath("/dashboard/emploi-du-temps");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError || e instanceof ValidationError) return { error: e.message };
    throw e;
  }
}

export async function deleteTimetableSlot(id: string): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    await prisma.timetableSlot.delete({ where: { id } });
    revalidatePath("/dashboard/emploi-du-temps");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: e.message };
    throw e;
  }
}
