"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { authorize, AuthError } from "@/lib/auth";
import { eventSchema, validate, ValidationError } from "@/lib/validations";
import type { ActionResult } from "@/types";

export async function getEvents() {
  return prisma.event.findMany({
    orderBy: { date: "desc" },
  });
}

export async function createEvent(data: {
  title: string;
  description: string;
  date: string;
  endDate?: string;
  location?: string;
  imageUrl?: string;
}): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    const validated = validate(eventSchema, data);

    await prisma.event.create({
      data: {
        title: validated.title,
        description: validated.description,
        date: new Date(validated.date),
        endDate: validated.endDate ? new Date(validated.endDate) : null,
        location: validated.location || null,
        imageUrl: validated.imageUrl || null,
      },
    });
    revalidatePath("/dashboard/evenements");
    revalidatePath("/evenements");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError || e instanceof ValidationError) return { error: e.message };
    throw e;
  }
}

export async function toggleEventPublished(id: string): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return { error: "Evenement introuvable" };

    await prisma.event.update({
      where: { id },
      data: { isPublished: !event.isPublished },
    });
    revalidatePath("/dashboard/evenements");
    revalidatePath("/evenements");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: e.message };
    throw e;
  }
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    await prisma.event.delete({ where: { id } });
    revalidatePath("/dashboard/evenements");
    revalidatePath("/evenements");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: e.message };
    throw e;
  }
}
