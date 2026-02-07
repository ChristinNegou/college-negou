"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { authorize, AuthError } from "@/lib/auth";
import { parentSchema, validate, ValidationError } from "@/lib/validations";
import type { ActionResult } from "@/types";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function getParents() {
  return prisma.parent.findMany({
    include: {
      user: true,
      children: { include: { student: true } },
    },
    orderBy: { lastName: "asc" },
  });
}

export async function getStudentsForParentAssignment() {
  return prisma.student.findMany({
    select: { id: true, firstName: true, lastName: true, matricule: true },
    orderBy: { lastName: "asc" },
  });
}

export async function createParent(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  profession?: string;
  address?: string;
  studentIds?: string[];
}): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    const validated = validate(parentSchema, data);

    // Create Supabase Auth user
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: validated.email,
      password: validated.password,
      email_confirm: true,
    });

    if (authError || !authUser.user) {
      return { error: authError?.message || "Erreur lors de la creation du compte" };
    }

    // Create User + Parent in database
    const user = await prisma.user.create({
      data: {
        supabaseId: authUser.user.id,
        email: validated.email,
        role: "PARENT",
      },
    });

    const parent = await prisma.parent.create({
      data: {
        userId: user.id,
        firstName: validated.firstName,
        lastName: validated.lastName,
        phone: validated.phone,
        profession: validated.profession || null,
        address: validated.address || null,
      },
    });

    // Link children if provided
    if (validated.studentIds && validated.studentIds.length > 0) {
      await prisma.parentStudent.createMany({
        data: validated.studentIds.map((studentId) => ({
          parentId: parent.id,
          studentId,
        })),
      });
    }

    revalidatePath("/dashboard/parents");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError || e instanceof ValidationError) return { error: e.message };
    throw e;
  }
}

export async function deleteParent(id: string): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);

    const parent = await prisma.parent.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!parent) return { error: "Parent introuvable" };

    // Delete from Supabase Auth
    await supabaseAdmin.auth.admin.deleteUser(parent.user.supabaseId);

    // Delete user (cascade deletes parent + parent_students)
    await prisma.user.delete({ where: { id: parent.userId } });

    revalidatePath("/dashboard/parents");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: e.message };
    throw e;
  }
}
