import { getSessionUser } from "@/actions/auth.actions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStudentBulletins } from "@/actions/bulletin.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BulletinDownloadButton } from "@/components/pdf/bulletin-download-button";
import type { BulletinPDFData } from "@/components/pdf/bulletin-pdf";

export const metadata = { title: "Bulletins des enfants - College Polyvalent Negou" };

export default async function BulletinsEnfantsPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "PARENT") redirect("/dashboard");

  const parent = await prisma.parent.findUnique({
    where: { userId: user.id },
    include: { children: { include: { student: true } } },
  });
  if (!parent) redirect("/dashboard");

  const childrenBulletins = await Promise.all(
    parent.children.map(async (ps) => ({
      student: ps.student,
      bulletins: await getStudentBulletins(ps.studentId),
    }))
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Bulletins des enfants</h2>
        <p className="text-muted-foreground">Consultez les bulletins de vos enfants</p>
      </div>
      {childrenBulletins.map(({ student, bulletins }) => (
        <div key={student.id} className="space-y-4">
          <h3 className="text-lg font-semibold">{student.lastName} {student.firstName} ({student.matricule})</h3>
          {bulletins.map((b) => (
            <Card key={b.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span>{b.term.name} - {b.term.academicYear.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge className={`${(b.generalAverage || 0) >= 10 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {b.generalAverage?.toFixed(2)}/20 - Rang {b.rank}/{b.totalStudents}
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
                      <TableHead>Appreciation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {b.subjectResults.map((sr) => (
                      <TableRow key={sr.id}>
                        <TableCell>{sr.classSubject.subject.name}</TableCell>
                        <TableCell className={sr.average >= 10 ? "text-green-600" : "text-red-600"}>{sr.average.toFixed(2)}/20</TableCell>
                        <TableCell>{sr.coefficient}</TableCell>
                        <TableCell><Badge variant="secondary">{sr.appreciation}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
          {bulletins.length === 0 && (
            <Card><CardContent className="py-6 text-center text-muted-foreground">Aucun bulletin</CardContent></Card>
          )}
        </div>
      ))}
    </div>
  );
}
