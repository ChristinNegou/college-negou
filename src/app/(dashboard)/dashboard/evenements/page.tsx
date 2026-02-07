import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Evenements - College Polyvalent Negou" };

export default async function EvenementsAdminPage() {
  const events = await prisma.event.findMany({ orderBy: { date: "desc" } }).catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Evenements</h2>
        <p className="text-muted-foreground">Gerer les evenements du college</p>
      </div>
      {events.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((e) => (
            <Card key={e.id}>
              <CardHeader>
                <CardTitle className="text-lg">{e.title}</CardTitle>
                <Badge variant="secondary">{new Date(e.date).toLocaleDateString("fr-FR")}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{e.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card><CardContent className="py-8 text-center text-muted-foreground">Aucun evenement</CardContent></Card>
      )}
    </div>
  );
}
