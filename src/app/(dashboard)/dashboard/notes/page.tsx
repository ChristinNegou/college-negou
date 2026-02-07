import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Notes - College Polyvalent Negou" };

export default async function NotesPage() {
  const grades = await prisma.grade.findMany({
    include: {
      student: true,
      classSubject: { include: { subject: true, class: true } },
      term: true,
      teacher: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Notes</h2>
        <p className="text-muted-foreground">Apercu des notes saisies</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Dernieres notes ({grades.length})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Eleve</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Matiere</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Trimestre</TableHead>
                <TableHead>Enseignant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map((g) => (
                <TableRow key={g.id}>
                  <TableCell className="font-medium">{g.student.lastName} {g.student.firstName}</TableCell>
                  <TableCell>{g.classSubject.class.name}</TableCell>
                  <TableCell>{g.classSubject.subject.name}</TableCell>
                  <TableCell><Badge variant="secondary">{g.type}</Badge></TableCell>
                  <TableCell className={`font-bold ${g.value >= 10 ? "text-green-600" : "text-red-600"}`}>{g.value}/20</TableCell>
                  <TableCell>{g.term.name}</TableCell>
                  <TableCell>{g.teacher.lastName} {g.teacher.firstName}</TableCell>
                </TableRow>
              ))}
              {grades.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">Aucune note</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
