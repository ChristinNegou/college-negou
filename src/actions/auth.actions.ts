"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = formData.get("redirect") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect(redirectTo || "/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/connexion");
}

export async function resetPassword(formData: FormData) {
  const email = formData.get("email") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reinitialiser`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Un email de reinitialisation a ete envoye." };
}

export async function updatePassword(formData: FormData) {
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser();

  if (!supabaseUser) return null;

  const user = await prisma.user.findUnique({
    where: { supabaseId: supabaseUser.id },
    include: {
      student: true,
      teacher: true,
      parent: true,
    },
  });

  if (!user) return null;

  const profile = user.student
    ? { firstName: user.student.firstName, lastName: user.student.lastName, photoUrl: user.student.photoUrl }
    : user.teacher
    ? { firstName: user.teacher.firstName, lastName: user.teacher.lastName, photoUrl: user.teacher.photoUrl }
    : user.parent
    ? { firstName: user.parent.firstName, lastName: user.parent.lastName, photoUrl: null }
    : { firstName: "Admin", lastName: "", photoUrl: null };

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    supabaseId: user.supabaseId,
    profile,
  };
}
