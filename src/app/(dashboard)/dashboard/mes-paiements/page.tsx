import { getSessionUser } from "@/actions/auth.actions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStudentFees } from "@/actions/payment.actions";
import { getCurrentYear } from "@/actions/academic-year.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FEE_TYPE_LABELS } from "@/config/cameroon-education";

export const metadata = { title: "Mes paiements - College Polyvalent Negou" };

export default async function MesPaiementsPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "STUDENT") redirect("/dashboard");

  const student = await prisma.student.findUnique({ where: { userId: user.id } });
  if (!student) redirect("/dashboard");

  const currentYear = await getCurrentYear();
  if (!currentYear) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Mes paiements</h2>
        <Card><CardContent className="py-8 text-center text-muted-foreground">Aucune annee scolaire active</CardContent></Card>
      </div>
    );
  }

  const { fees, payments } = await getStudentFees(student.id, currentYear.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Mes paiements</h2>
        <p className="text-muted-foreground">Consultez vos frais et effectuez des paiements</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Frais a payer - {currentYear.name}</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fees.map((fee) => {
                const paid = payments.find((p) => p.feeType === fee.feeType && p.status === "COMPLETED");
                const pending = payments.find((p) => p.feeType === fee.feeType && p.status === "PENDING");
                return (
                  <TableRow key={fee.id}>
                    <TableCell className="font-medium">{FEE_TYPE_LABELS[fee.feeType] || fee.feeType}</TableCell>
                    <TableCell className="font-mono">{new Intl.NumberFormat("fr-FR").format(fee.amount)} XAF</TableCell>
                    <TableCell>
                      {paid ? (
                        <Badge className="bg-green-100 text-green-800">Paye</Badge>
                      ) : pending ? (
                        <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">Non paye</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {!paid && !pending && (
                        <Button size="sm" asChild>
                          <a href={`/api/payments/initiate?studentId=${student.id}&feeType=${fee.feeType}&amount=${fee.amount}&yearId=${currentYear.id}`}>
                            Payer
                          </a>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {fees.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Aucun frais configure</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
