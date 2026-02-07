import { z } from "zod";

// Validation error class
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// Helper for safe validation - returns validated data or throws ValidationError
export function validate<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (result.success) {
    return result.data;
  }
  const messages = result.error.issues.map((i) => i.message).join(". ");
  throw new ValidationError(messages);
}

// --- Academic Year ---
export const academicYearSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caracteres"),
  startDate: z.string().min(1, "La date de debut est requise"),
  endDate: z.string().min(1, "La date de fin est requise"),
});

// --- Subject ---
export const subjectSchema = z.object({
  name: z.string().min(2, "Le nom de la matiere doit contenir au moins 2 caracteres"),
  code: z.string().min(2, "Le code doit contenir au moins 2 caracteres"),
  category: z.string().min(1, "La categorie est requise"),
});

// --- Class ---
export const classSchema = z.object({
  name: z.string().min(2, "Le nom de la classe doit contenir au moins 2 caracteres"),
  level: z.string().min(1, "Le niveau est requis"),
  section: z.string().nullable().optional(),
  capacity: z.number().int().min(1, "La capacite doit etre au moins 1").max(200, "La capacite maximale est 200"),
});

// --- Student ---
export const studentSchema = z.object({
  firstName: z.string().min(2, "Le prenom doit contenir au moins 2 caracteres"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caracteres"),
  email: z.string().email("L'adresse email est invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caracteres"),
  dateOfBirth: z.string().min(1, "La date de naissance est requise"),
  gender: z.enum(["MALE", "FEMALE"], { message: "Le genre doit etre MALE ou FEMALE" }),
  placeOfBirth: z.string().min(2, "Le lieu de naissance doit contenir au moins 2 caracteres"),
  nationality: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  classId: z.string().optional(),
  academicYearId: z.string().optional(),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  parentEmail: z.string().email("L'email du parent est invalide").optional().or(z.literal("")),
});

// --- Teacher ---
export const teacherSchema = z.object({
  firstName: z.string().min(2, "Le prenom doit contenir au moins 2 caracteres"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caracteres"),
  email: z.string().email("L'adresse email est invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caracteres"),
  phone: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE"], { message: "Le genre doit etre MALE ou FEMALE" }),
  specialty: z.string().optional(),
});

// --- Enrollment ---
export const enrollmentSchema = z.object({
  studentId: z.string().min(1, "L'identifiant de l'eleve est requis"),
  classId: z.string().min(1, "L'identifiant de la classe est requis"),
  academicYearId: z.string().min(1, "L'identifiant de l'annee scolaire est requis"),
});

// --- Grade ---
export const gradeSchema = z.object({
  classSubjectId: z.string().min(1, "La matiere de classe est requise"),
  termId: z.string().min(1, "Le trimestre est requis"),
  teacherId: z.string().min(1, "L'identifiant de l'enseignant est requis"),
  type: z.enum(["DEVOIR", "INTERROGATION", "COMPOSITION"], { message: "Le type de note est invalide" }),
  description: z.string().min(1, "La description est requise"),
  grades: z.array(
    z.object({
      studentId: z.string().min(1, "L'identifiant de l'eleve est requis"),
      value: z.number().min(0, "La note doit etre au minimum 0").max(20, "La note doit etre au maximum 20"),
    })
  ).min(1, "Au moins une note est requise"),
});

// --- Fee Structure ---
export const feeStructureSchema = z.object({
  academicYearId: z.string().min(1, "L'annee scolaire est requise"),
  level: z.string().min(1, "Le niveau est requis"),
  feeType: z.string().min(1, "Le type de frais est requis"),
  amount: z.number().positive("Le montant doit etre positif"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
});

// --- Payment ---
export const paymentSchema = z.object({
  studentId: z.string().min(1, "L'identifiant de l'eleve est requis"),
  academicYearId: z.string().min(1, "L'annee scolaire est requise"),
  feeType: z.string().min(1, "Le type de frais est requis"),
  amount: z.number().positive("Le montant doit etre positif"),
  method: z.string().optional(),
  cinetpayTransId: z.string().optional(),
  cinetpayPaymentUrl: z.string().optional(),
});

// --- Announcement ---
export const announcementSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caracteres"),
  content: z.string().min(10, "Le contenu doit contenir au moins 10 caracteres"),
  targetRole: z.enum(["ADMIN", "TEACHER", "STUDENT", "PARENT"]).optional(),
  targetClassId: z.string().optional(),
});

// --- Timetable Slot ---
export const timetableSlotSchema = z.object({
  classId: z.string().min(1, "La classe est requise"),
  subjectName: z.string().min(1, "Le nom de la matiere est requis"),
  teacherName: z.string().min(1, "Le nom de l'enseignant est requis"),
  dayOfWeek: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"], {
    message: "Le jour de la semaine est invalide",
  }),
  startTime: z.string().min(1, "L'heure de debut est requise"),
  endTime: z.string().min(1, "L'heure de fin est requise"),
  room: z.string().optional(),
});

// Helper: accepts both URLs (https://...) and local paths (/uploads/...)
const imageUrlField = z.string().min(1, "L'URL ou le chemin de l'image est requis")
  .refine((v) => v.startsWith("/") || v.startsWith("http://") || v.startsWith("https://"), {
    message: "L'image doit etre une URL ou un chemin local (/uploads/...)",
  });

const optionalImageUrlField = z.string()
  .refine((v) => v === "" || v.startsWith("/") || v.startsWith("http://") || v.startsWith("https://"), {
    message: "L'image doit etre une URL ou un chemin local (/uploads/...)",
  })
  .optional()
  .or(z.literal(""));

// --- News Article ---
export const newsArticleSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caracteres"),
  content: z.string().min(10, "Le contenu doit contenir au moins 10 caracteres"),
  excerpt: z.string().optional(),
  imageUrl: optionalImageUrlField,
});

// --- Event ---
export const eventSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caracteres"),
  description: z.string().min(10, "La description doit contenir au moins 10 caracteres"),
  date: z.string().min(1, "La date est requise"),
  endDate: z.string().optional(),
  location: z.string().optional(),
  imageUrl: optionalImageUrlField,
});

// --- Gallery Album ---
export const galleryAlbumSchema = z.object({
  title: z.string().min(2, "Le titre doit contenir au moins 2 caracteres"),
  description: z.string().optional(),
  coverUrl: optionalImageUrlField,
});

// --- Gallery Photo ---
export const galleryPhotoSchema = z.object({
  albumId: z.string().min(1, "L'album est requis"),
  url: imageUrlField,
  caption: z.string().optional(),
});

// --- Parent ---
export const parentSchema = z.object({
  firstName: z.string().min(2, "Le prenom doit contenir au moins 2 caracteres"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caracteres"),
  email: z.string().email("L'adresse email est invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caracteres"),
  phone: z.string().min(8, "Le telephone doit contenir au moins 8 caracteres"),
  profession: z.string().optional(),
  address: z.string().optional(),
  studentIds: z.array(z.string()).optional(),
});

// --- Site Image ---
export const siteImageSchema = z.object({
  section: z.string().min(1, "La section est requise"),
  page: z.string().min(1, "La page est requise"),
  url: z.string().min(1, "L'URL de l'image est requise"),
  alt: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  size: z.enum(["SMALL", "MEDIUM", "LARGE", "FULL"], { message: "La taille est invalide" }),
  sortOrder: z.number().int().min(0).optional(),
});

// --- Pre-Registration ---
export const preRegistrationSchema = z.object({
  firstName: z.string().min(2, "Le prenom doit contenir au moins 2 caracteres"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caracteres"),
  dateOfBirth: z.string().min(1, "La date de naissance est requise"),
  gender: z.enum(["MALE", "FEMALE"], { message: "Le genre est requis" }),
  placeOfBirth: z.string().min(2, "Le lieu de naissance doit contenir au moins 2 caracteres"),
  previousSchool: z.string().optional(),
  desiredLevel: z.string().min(1, "Le niveau souhaite est requis"),
  parentName: z.string().min(2, "Le nom du parent doit contenir au moins 2 caracteres"),
  parentPhone: z.string().min(8, "Le telephone du parent doit contenir au moins 8 caracteres"),
  parentEmail: z.string().email("L'email du parent est invalide").optional().or(z.literal("")),
});
