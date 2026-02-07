"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { authorize, AuthError } from "@/lib/auth";
import { newsArticleSchema, validate, ValidationError } from "@/lib/validations";
import type { ActionResult } from "@/types";

export async function getNewsArticles() {
  return prisma.newsArticle.findMany({
    orderBy: { publishedAt: "desc" },
  });
}

export async function createNewsArticle(data: {
  title: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
}): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    const validated = validate(newsArticleSchema, data);

    const slug = validated.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Ensure unique slug
    const existing = await prisma.newsArticle.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    await prisma.newsArticle.create({
      data: {
        title: validated.title,
        slug: finalSlug,
        content: validated.content,
        excerpt: validated.excerpt || null,
        imageUrl: validated.imageUrl || null,
      },
    });
    revalidatePath("/dashboard/actualites");
    revalidatePath("/actualites");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError || e instanceof ValidationError) return { error: e.message };
    throw e;
  }
}

export async function toggleNewsPublished(id: string): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    const article = await prisma.newsArticle.findUnique({ where: { id } });
    if (!article) return { error: "Article introuvable" };

    await prisma.newsArticle.update({
      where: { id },
      data: { isPublished: !article.isPublished },
    });
    revalidatePath("/dashboard/actualites");
    revalidatePath("/actualites");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: e.message };
    throw e;
  }
}

export async function deleteNewsArticle(id: string): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    await prisma.newsArticle.delete({ where: { id } });
    revalidatePath("/dashboard/actualites");
    revalidatePath("/actualites");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: e.message };
    throw e;
  }
}
