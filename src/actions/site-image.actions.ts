"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { authorize, AuthError } from "@/lib/auth";
import { siteImageSchema, validate, ValidationError } from "@/lib/validations";
import type { ActionResult } from "@/types";

export async function getSiteImages(page?: string, section?: string) {
  return prisma.siteImage.findMany({
    where: {
      ...(page ? { page } : {}),
      ...(section ? { section } : {}),
      isPublished: true,
    },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getAllSiteImages() {
  return prisma.siteImage.findMany({
    orderBy: [{ page: "asc" }, { section: "asc" }, { sortOrder: "asc" }],
  });
}

export async function createSiteImage(data: {
  section: string;
  page: string;
  url: string;
  alt?: string;
  title?: string;
  description?: string;
  size: string;
  sortOrder?: number;
}): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    const validated = validate(siteImageSchema, data);

    await prisma.siteImage.create({
      data: {
        section: validated.section,
        page: validated.page,
        url: validated.url,
        alt: validated.alt || null,
        title: validated.title || null,
        description: validated.description || null,
        size: validated.size,
        sortOrder: validated.sortOrder ?? 0,
      },
    });
    revalidatePath("/dashboard/images-site");
    revalidatePath("/");
    revalidatePath("/a-propos");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError || e instanceof ValidationError) return { error: e.message };
    throw e;
  }
}

export async function updateSiteImage(
  id: string,
  data: {
    section?: string;
    page?: string;
    url?: string;
    alt?: string;
    title?: string;
    description?: string;
    size?: string;
    sortOrder?: number;
    isPublished?: boolean;
  }
): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    const existing = await prisma.siteImage.findUnique({ where: { id } });
    if (!existing) return { error: "Image introuvable" };

    await prisma.siteImage.update({
      where: { id },
      data,
    });
    revalidatePath("/dashboard/images-site");
    revalidatePath("/");
    revalidatePath("/a-propos");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: e.message };
    throw e;
  }
}

export async function deleteSiteImage(id: string): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    await prisma.siteImage.delete({ where: { id } });
    revalidatePath("/dashboard/images-site");
    revalidatePath("/");
    revalidatePath("/a-propos");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: e.message };
    throw e;
  }
}
