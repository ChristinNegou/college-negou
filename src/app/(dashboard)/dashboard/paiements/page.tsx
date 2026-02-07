import { getPayments } from "@/actions/payment.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FEE_TYPE_LABELS } from "@/config/cameroon-education";

export const metadata = { title: "Paiements - College Polyvalent Negou" };

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-800",
};

export default async function PaiementsPage() {
  const payments = await getPayments();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Paiements</h2>
        <p className="text-muted-foreground">Historique de tous les paiements</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Paiements ({payments.length})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Eleve</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Methode</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.student.lastName} {p.student.firstName}</TableCell>
                  <TableCell>{FEE_TYPE_LABELS[p.feeType] || p.feeType}</TableCell>
                  <TableCell className="font-mono">{new Intl.NumberFormat("fr-FR").format(p.amount)} XAF</TableCell>
                  <TableCell>{p.method || "-"}</TableCell>
                  <TableCell><Badge className={statusColors[p.status]}>{p.status}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(p.createdAt).toLocaleDateString("fr-FR")}</TableCell>
                </TableRow>
              ))}
              {payments.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">Aucun paiement</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
