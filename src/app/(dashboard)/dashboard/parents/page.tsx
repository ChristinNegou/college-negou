import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata = { title: "Parents - College Polyvalent Negou" };

export default async function ParentsPage() {
  const parents = await prisma.parent.findMany({
    include: {
      user: true,
      children: { include: { student: true } },
    },
    orderBy: { lastName: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Parents</h2>
        <p className="text-muted-foreground">Liste des parents d&apos;eleves</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Parents ({parents.length})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Prenom</TableHead>
                <TableHead>Telephone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Enfants</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parents.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.lastName}</TableCell>
                  <TableCell>{p.firstName}</TableCell>
                  <TableCell>{p.phone}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.user.email}</TableCell>
                  <TableCell className="text-sm">
                    {p.children.map((c) => `${c.student.lastName} ${c.student.firstName}`).join(", ") || "-"}
                  </TableCell>
                </TableRow>
              ))}
              {parents.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Aucun parent</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
