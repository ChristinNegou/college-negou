import { getSessionUser } from "@/actions/auth.actions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Mes classes - College Polyvalent Negou" };

export default async function MesClassesPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "TEACHER") redirect("/dashboard");

  const teacher = await prisma.teacher.findUnique({ where: { userId: user.id } });
  if (!teacher) redirect("/dashboard");

  const assignments = await prisma.teacherAssignment.findMany({
    where: { teacherId: teacher.id },
    include: { class: { include: { _count: { select: { enrollments: true } } } }, classSubject: { include: { subject: true } } },
  });

  const classMap = new Map<string, { class: typeof assignments[0]["class"]; subjects: string[] }>();
  for (const a of assignments) {
    const existing = classMap.get(a.classId);
    if (existing) {
      existing.subjects.push(a.classSubject.subject.name);
    } else {
      classMap.set(a.classId, { class: a.class, subjects: [a.classSubject.subject.name] });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Mes classes</h2>
        <p className="text-muted-foreground">Classes et matieres assignees</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from(classMap.values()).map(({ class: cls, subjects }) => (
          <Card key={cls.id}>
            <CardHeader>
              <CardTitle>{cls.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{cls._count.enrollments} eleves</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {subjects.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
              </div>
            </CardContent>
          </Card>
        ))}
        {classMap.size === 0 && (
          <p className="col-span-full text-center text-muted-foreground py-8">Aucune classe assignee</p>
        )}
      </div>
    </div>
  );
}
