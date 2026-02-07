import { getSessionUser } from "@/actions/auth.actions";
import { redirect } from "next/navigation";
import { getStudentBulletins } from "@/actions/bulletin.actions";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BulletinDownloadButton } from "@/components/pdf/bulletin-download-button";
import type { BulletinPDFData } from "@/components/pdf/bulletin-pdf";

export const metadata = { title: "Mes bulletins - College Polyvalent Negou" };

export default async function MesBulletinsPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "STUDENT") redirect("/dashboard");

  const student = await prisma.student.findUnique({ where: { userId: user.id } });
  if (!student) redirect("/dashboard");

  const bulletins = await getStudentBulletins(student.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Mes bulletins</h2>
        <p className="text-muted-foreground">Consultez vos bulletins de notes</p>
      </div>
      {bulletins.map((b) => (
        <Card key={b.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{b.term.name} - {b.term.academicYear.name}</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Rang: {b.rank}/{b.totalStudents}</Badge>
                <Badge className={`${(b.generalAverage || 0) >= 10 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  Moyenne: {b.generalAverage?.toFixed(2)}/20
                </Badge>
                <BulletinDownloadButton
                  data={{ ...b, student: { firstName: student.firstName, lastName: student.lastName, matricule: student.matricule }, generalAverage: b.generalAverage as number | null, rank: b.rank as number | null, totalStudents: b.totalStudents as number | null, classAverage: b.classAverage as number | null, teacherComment: b.teacherComment ?? null, principalComment: b.principalComment ?? null, decision: b.decision ?? null } as unknown as BulletinPDFData}
                  variant="outline"
                  label="PDF"
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matiere</TableHead>
                  <TableHead>Moyenne</TableHead>
                  <TableHead>Coeff</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Appreciation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {b.subjectResults.map((sr) => (
                  <TableRow key={sr.id}>
                    <TableCell className="font-medium">{sr.classSubject.subject.name}</TableCell>
                    <TableCell className={sr.average >= 10 ? "text-green-600" : "text-red-600"}>{sr.average.toFixed(2)}/20</TableCell>
                    <TableCell>{sr.coefficient}</TableCell>
                    <TableCell>{sr.total.toFixed(2)}</TableCell>
                    <TableCell><Badge variant="secondary">{sr.appreciation}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {b.teacherComment && <p className="mt-4 text-sm"><strong>Prof titulaire:</strong> {b.teacherComment}</p>}
            {b.principalComment && <p className="text-sm"><strong>Proviseur:</strong> {b.principalComment}</p>}
          </CardContent>
        </Card>
      ))}
      {bulletins.length === 0 && (
        <Card><CardContent className="py-8 text-center text-muted-foreground">Aucun bulletin disponible</CardContent></Card>
      )}
    </div>
  );
}
