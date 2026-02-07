"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { authorize, AuthError } from "@/lib/auth";
import { subjectSchema, validate, ValidationError } from "@/lib/validations";
import type { ActionResult } from "@/types";

export async function getSubjects() {
  return prisma.subject.findMany({ orderBy: { name: "asc" } });
}

export async function createSubject(formData: FormData): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    const validated = validate(subjectSchema, {
      name: formData.get("name"),
      code: formData.get("code"),
      category: formData.get("category"),
    });

    await prisma.subject.create({ data: { name: validated.name, code: validated.code, category: validated.category } });
    revalidatePath("/dashboard/matieres");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError || e instanceof ValidationError) return { error: e.message };
    throw e;
  }
}

export async function deleteSubject(id: string): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    await prisma.subject.delete({ where: { id } });
    revalidatePath("/dashboard/matieres");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: e.message };
    throw e;
  }
}

export async function seedDefaultSubjects(): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    const { SUBJECTS } = await import("@/config/cameroon-education");
    for (const s of SUBJECTS) {
      await prisma.subject.upsert({
        where: { code: s.code },
        update: {},
        create: { name: s.name, code: s.code, category: s.category },
      });
    }
    revalidatePath("/dashboard/matieres");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: e.message };
    throw e;
  }
}
