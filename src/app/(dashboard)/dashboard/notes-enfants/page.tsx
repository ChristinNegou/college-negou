import { getSessionUser } from "@/actions/auth.actions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Notes des enfants - College Polyvalent Negou" };

export default async function NotesEnfantsPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "PARENT") redirect("/dashboard");

  const parent = await prisma.parent.findUnique({
    where: { userId: user.id },
    include: { children: { include: { student: true } } },
  });
  if (!parent) redirect("/dashboard");

  const childrenGrades = await Promise.all(
    parent.children.map(async (ps) => {
      const grades = await prisma.grade.findMany({
        where: { studentId: ps.studentId },
        include: { classSubject: { include: { subject: true } }, term: true },
        orderBy: { createdAt: "desc" },
        take: 20,
      });
      return { student: ps.student, grades };
    })
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Notes des enfants</h2>
        <p className="text-muted-foreground">Suivez les notes de vos enfants</p>
      </div>
      {childrenGrades.map(({ student, grades }) => (
        <Card key={student.id}>
          <CardHeader><CardTitle>{student.lastName} {student.firstName} ({student.matricule})</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matiere</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Trimestre</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell>{g.classSubject.subject.name}</TableCell>
                    <TableCell><Badge variant="secondary">{g.type}</Badge></TableCell>
                    <TableCell className={`font-bold ${g.value >= 10 ? "text-green-600" : "text-red-600"}`}>{g.value}/20</TableCell>
                    <TableCell>{g.term.name}</TableCell>
                  </TableRow>
                ))}
                {grades.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Aucune note</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
