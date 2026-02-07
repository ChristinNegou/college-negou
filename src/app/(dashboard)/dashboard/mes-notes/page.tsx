import { getSessionUser } from "@/actions/auth.actions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Mes notes - College Polyvalent Negou" };

export default async function MesNotesPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "STUDENT") redirect("/dashboard");

  const student = await prisma.student.findUnique({ where: { userId: user.id } });
  if (!student) redirect("/dashboard");

  const grades = await prisma.grade.findMany({
    where: { studentId: student.id },
    include: { classSubject: { include: { subject: true } }, term: true },
    orderBy: [{ term: { sequenceNumber: "asc" } }, { classSubject: { subject: { name: "asc" } } }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Mes notes</h2>
        <p className="text-muted-foreground">Consultez vos notes</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Toutes mes notes</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matiere</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Trimestre</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map((g) => (
                <TableRow key={g.id}>
                  <TableCell className="font-medium">{g.classSubject.subject.name}</TableCell>
                  <TableCell><Badge variant="secondary">{g.type}</Badge></TableCell>
                  <TableCell className={`font-bold ${g.value >= 10 ? "text-green-600" : "text-red-600"}`}>{g.value}/20</TableCell>
                  <TableCell className="text-muted-foreground">{g.description || "-"}</TableCell>
                  <TableCell>{g.term.name}</TableCell>
                </TableRow>
              ))}
              {grades.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Aucune note disponible</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
