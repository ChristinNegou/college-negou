"use server";
import { prisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { authorize, AuthError } from "@/lib/auth";
import { teacherSchema, validate, ValidationError } from "@/lib/validations";
import type { ActionResult } from "@/types";

export async function getTeachers() {
  return prisma.teacher.findMany({
    include: {
      user: true,
      assignments: { include: { class: true, classSubject: { include: { subject: true } } } },
    },
    orderBy: { lastName: "asc" },
  });
}

export async function createTeacher(data: {
  firstName: string; lastName: string; email: string; password: string;
  phone?: string; gender: "MALE" | "FEMALE"; specialty?: string;
}): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    const validated = validate(teacherSchema, data);

    const supabase = createAdminClient();
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: validated.email, password: validated.password, email_confirm: true,
    });
    if (authError) return { error: authError.message };

    await prisma.user.create({
      data: {
        email: validated.email, role: "TEACHER", supabaseId: authData.user.id,
        teacher: {
          create: {
            firstName: validated.firstName, lastName: validated.lastName,
            phone: validated.phone, gender: validated.gender, specialty: validated.specialty,
          },
        },
      },
    });

    revalidatePath("/dashboard/enseignants");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError || e instanceof ValidationError) return { error: e.message };
    throw e;
  }
}

export async function deleteTeacher(id: string): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    const teacher = await prisma.teacher.findUnique({ where: { id }, include: { user: true } });
    if (!teacher) return { error: "Enseignant non trouve." };
    const supabase = createAdminClient();
    await supabase.auth.admin.deleteUser(teacher.user.supabaseId);
    await prisma.user.delete({ where: { id: teacher.userId } });
    revalidatePath("/dashboard/enseignants");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: e.message };
    throw e;
  }
}
