import { getSessionUser } from "@/actions/auth.actions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentYear } from "@/actions/academic-year.actions";
import { getStudentFees } from "@/actions/payment.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FEE_TYPE_LABELS } from "@/config/cameroon-education";

export const metadata = { title: "Paiements enfants - College Polyvalent Negou" };

export default async function PaiementsEnfantsPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "PARENT") redirect("/dashboard");

  const parent = await prisma.parent.findUnique({
    where: { userId: user.id },
    include: { children: { include: { student: true } } },
  });
  if (!parent) redirect("/dashboard");

  const currentYear = await getCurrentYear();
  if (!currentYear) return <div className="space-y-6"><h2 className="text-2xl font-bold">Paiements</h2><p>Aucune annee scolaire</p></div>;

  const childrenFees = await Promise.all(
    parent.children.map(async (ps) => ({
      student: ps.student,
      ...(await getStudentFees(ps.studentId, currentYear.id)),
    }))
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Paiements des enfants</h2>
        <p className="text-muted-foreground">Suivez les paiements de vos enfants</p>
      </div>
      {childrenFees.map(({ student, fees, payments }) => (
        <Card key={student.id}>
          <CardHeader><CardTitle>{student.lastName} {student.firstName}</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fees.map((fee) => {
                  const paid = payments.find((p) => p.feeType === fee.feeType && p.status === "COMPLETED");
                  return (
                    <TableRow key={fee.id}>
                      <TableCell>{FEE_TYPE_LABELS[fee.feeType] || fee.feeType}</TableCell>
                      <TableCell className="font-mono">{new Intl.NumberFormat("fr-FR").format(fee.amount)} XAF</TableCell>
                      <TableCell>
                        <Badge className={paid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {paid ? "Paye" : "Non paye"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
