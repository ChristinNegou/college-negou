"use server";
import { prisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { generateMatricule } from "@/config/cameroon-education";
import { authorize, AuthError } from "@/lib/auth";
import { studentSchema, validate, ValidationError } from "@/lib/validations";
import type { ActionResult } from "@/types";

export async function getStudents() {
  return prisma.student.findMany({
    include: {
      user: true,
      enrollments: { include: { class: true, academicYear: true }, orderBy: { createdAt: "desc" }, take: 1 },
      parents: { include: { parent: true } },
    },
    orderBy: { lastName: "asc" },
  });
}

export async function createStudent(data: {
  firstName: string; lastName: string; email: string; password: string;
  dateOfBirth: string; gender: "MALE" | "FEMALE"; placeOfBirth: string;
  nationality?: string; address?: string; phone?: string;
  classId?: string; academicYearId?: string;
  parentName?: string; parentPhone?: string; parentEmail?: string;
}): Promise<ActionResult<{ matricule: string }>> {
  try {
    await authorize(["ADMIN"]);
    const validated = validate(studentSchema, data);

    const supabase = createAdminClient();

    // Create Supabase auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: validated.email,
      password: validated.password,
      email_confirm: true,
    });

    if (authError) return { error: authError.message };

    // Generate matricule
    const year = new Date().getFullYear();
    const count = await prisma.student.count();
    const matricule = generateMatricule(year, count + 1);

    // Create user + student
    const user = await prisma.user.create({
      data: {
        email: validated.email,
        role: "STUDENT",
        supabaseId: authData.user.id,
        student: {
          create: {
            matricule,
            firstName: validated.firstName,
            lastName: validated.lastName,
            dateOfBirth: new Date(validated.dateOfBirth),
            gender: validated.gender,
            placeOfBirth: validated.placeOfBirth,
            nationality: validated.nationality || "Camerounaise",
            address: validated.address,
            phone: validated.phone,
          },
        },
      },
      include: { student: true },
    });

    // Enroll if class and year provided
    if (validated.classId && validated.academicYearId && user.student) {
      await prisma.enrollment.create({
        data: {
          studentId: user.student.id,
          classId: validated.classId,
          academicYearId: validated.academicYearId,
        },
      });
    }

    // Create parent if info provided
    if (validated.parentName && validated.parentPhone && user.student) {
      const [parentFirstName, ...rest] = validated.parentName.split(" ");
      const parentLastName = rest.join(" ") || parentFirstName;

      if (validated.parentEmail) {
        const { data: parentAuth } = await supabase.auth.admin.createUser({
          email: validated.parentEmail,
          password: "Parent123!",
          email_confirm: true,
        });

        if (parentAuth?.user) {
          const parentUser = await prisma.user.create({
            data: {
              email: validated.parentEmail,
              role: "PARENT",
              supabaseId: parentAuth.user.id,
              parent: {
                create: {
                  firstName: parentFirstName,
                  lastName: parentLastName,
                  phone: validated.parentPhone,
                },
              },
            },
            include: { parent: true },
          });

          if (parentUser.parent) {
            await prisma.parentStudent.create({
              data: { parentId: parentUser.parent.id, studentId: user.student.id },
            });
          }
        }
      }
    }

    revalidatePath("/dashboard/eleves");
    return { success: true, data: { matricule } };
  } catch (e) {
    if (e instanceof AuthError || e instanceof ValidationError) return { error: e.message };
    throw e;
  }
}

export async function deleteStudent(id: string): Promise<ActionResult> {
  try {
    await authorize(["ADMIN"]);
    const student = await prisma.student.findUnique({ where: { id }, include: { user: true } });
    if (!student) return { error: "Eleve non trouve." };

    const supabase = createAdminClient();
    await supabase.auth.admin.deleteUser(student.user.supabaseId);
    await prisma.user.delete({ where: { id: student.userId } });
    revalidatePath("/dashboard/eleves");
    return { success: true };
  } catch (e) {
    if (e instanceof AuthError) return { error: e.message };
    throw e;
  }
}
