"use server";

import { prisma } from "@/lib/prisma";
import { preRegistrationSchema, validate, ValidationError } from "@/lib/validations";
import type { ActionResult } from "@/types";

export async function createPreRegistration(data: {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE";
  placeOfBirth: string;
  previousSchool?: string;
  desiredLevel: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
}): Promise<ActionResult> {
  try {
    const validated = validate(preRegistrationSchema, data);

    await prisma.preRegistration.create({
      data: {
        firstName: validated.firstName,
        lastName: validated.lastName,
        dateOfBirth: new Date(validated.dateOfBirth),
        gender: validated.gender,
        placeOfBirth: validated.placeOfBirth,
        previousSchool: validated.previousSchool,
        desiredLevel: validated.desiredLevel,
        parentName: validated.parentName,
        parentPhone: validated.parentPhone,
        parentEmail: validated.parentEmail,
      },
    });

    return { success: true };
  } catch (e) {
    if (e instanceof ValidationError) return { error: e.message };
    throw e;
  }
}
