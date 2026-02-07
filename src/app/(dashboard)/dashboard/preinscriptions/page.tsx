import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Preinscriptions - College Polyvalent Negou" };

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default async function PreinscriptionsPage() {
  const preregistrations = await prisma.preRegistration.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Preinscriptions</h2>
        <p className="text-muted-foreground">Demandes de preinscription en ligne</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Demandes ({preregistrations.length})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Prenom</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Telephone</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {preregistrations.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.lastName}</TableCell>
                  <TableCell>{p.firstName}</TableCell>
                  <TableCell>{p.desiredLevel}</TableCell>
                  <TableCell>{p.parentName}</TableCell>
                  <TableCell>{p.parentPhone}</TableCell>
                  <TableCell><Badge className={statusColors[p.status]}>{p.status}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(p.createdAt).toLocaleDateString("fr-FR")}</TableCell>
                </TableRow>
              ))}
              {preregistrations.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">Aucune demande</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
