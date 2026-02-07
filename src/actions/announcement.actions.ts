"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { UserRole } from "@prisma/client";
import { authorize, AuthError } from "@/lib/auth";
import { announcementSchema, validate, ValidationError } from "@/lib/validations";
import type { ActionResult } from "@/types";

export async function getAnnouncements(filters?: { targetRole?: UserRole; classId?: string }) {
  return prisma.announcement.findMany({
    where: {
      isPublished: true,
      ...(filters?.targetRole ? { OR: [{ targetRole: filters.targetRole }, { targetRole: null }] } : {}),
      ...(filters?.classId ? { OR: [{ targetClassId: filters.classId }, { targetClassId: null }] } : {}),
    },
    include: { targetClass: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function createAnnouncement(data: {
  title: string;
  content: string;
  targetRole?: UserRole;
  targetClassId?: string;
}): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    const validated = validate(announcementSchema, data);

    await prisma.announcement.create({
      data: {
        title: validated.title,
        content: validated.content,
        targetRole: (validated.targetRole as UserRole) || null,
        targetClassId: validated.targetClassId || null,
      },
    });
    revalidatePath("/dashboard/annonces");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError || e instanceof ValidationError) return { error: e.message };
    throw e;
  }
}

export async function deleteAnnouncement(id: string): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    await prisma.announcement.delete({ where: { id } });
    revalidatePath("/dashboard/annonces");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: e.message };
    throw e;
  }
}
