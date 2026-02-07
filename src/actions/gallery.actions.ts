"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { authorize, AuthError } from "@/lib/auth";
import { galleryAlbumSchema, galleryPhotoSchema, validate, ValidationError } from "@/lib/validations";
import type { ActionResult } from "@/types";

export async function getAlbums() {
  return prisma.galleryAlbum.findMany({
    include: { photos: { orderBy: { sortOrder: "asc" } }, _count: { select: { photos: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function createAlbum(data: {
  title: string;
  description?: string;
  coverUrl?: string;
}): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    const validated = validate(galleryAlbumSchema, data);

    await prisma.galleryAlbum.create({
      data: {
        title: validated.title,
        description: validated.description || null,
        coverUrl: validated.coverUrl || null,
      },
    });
    revalidatePath("/dashboard/galerie");
    revalidatePath("/galerie");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError || e instanceof ValidationError) return { error: e.message };
    throw e;
  }
}

export async function addPhotoToAlbum(data: {
  albumId: string;
  url: string;
  caption?: string;
}): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    const validated = validate(galleryPhotoSchema, data);

    const maxOrder = await prisma.galleryPhoto.findFirst({
      where: { albumId: validated.albumId },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    await prisma.galleryPhoto.create({
      data: {
        albumId: validated.albumId,
        url: validated.url,
        caption: validated.caption || null,
        sortOrder: (maxOrder?.sortOrder ?? -1) + 1,
      },
    });
    revalidatePath("/dashboard/galerie");
    revalidatePath("/galerie");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError || e instanceof ValidationError) return { error: e.message };
    throw e;
  }
}

export async function deletePhoto(id: string): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    await prisma.galleryPhoto.delete({ where: { id } });
    revalidatePath("/dashboard/galerie");
    revalidatePath("/galerie");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: e.message };
    throw e;
  }
}

export async function deleteAlbum(id: string): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    await prisma.galleryAlbum.delete({ where: { id } });
    revalidatePath("/dashboard/galerie");
    revalidatePath("/galerie");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: e.message };
    throw e;
  }
}
