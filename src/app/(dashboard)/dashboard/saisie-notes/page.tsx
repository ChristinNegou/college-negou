import { getSessionUser } from "@/actions/auth.actions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { GradeEntryClient } from "./client";

export const metadata = { title: "Saisie des notes - College Polyvalent Negou" };

export default async function SaisieNotesPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "TEACHER") redirect("/dashboard");

  const teacher = await prisma.teacher.findUnique({ where: { userId: user.id } });
  if (!teacher) redirect("/dashboard");

  const assignments = await prisma.teacherAssignment.findMany({
    where: { teacherId: teacher.id },
    include: { class: true, classSubject: { include: { subject: true } } },
  });

  const currentYear = await prisma.academicYear.findFirst({
    where: { isCurrent: true },
    include: { terms: { orderBy: { sequenceNumber: "asc" } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Saisie des notes</h2>
        <p className="text-muted-foreground">Saisir les notes de vos eleves</p>
      </div>
      <GradeEntryClient
        teacherId={teacher.id}
        assignments={JSON.parse(JSON.stringify(assignments))}
        terms={currentYear ? JSON.parse(JSON.stringify(currentYear.terms)) : []}
        academicYearId={currentYear?.id || ""}
      />
    </div>
  );
}
