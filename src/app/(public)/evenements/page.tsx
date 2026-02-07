import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin } from "lucide-react";
import { SCHOOL_NAME } from "@/config/cameroon-education";

export const metadata = {
  title: `Evenements - ${SCHOOL_NAME}`,
  description: "Les evenements a venir au College Polyvalent Negou.",
};

export default async function EvenementsPage() {
  const events = await prisma.event.findMany({
    where: { isPublished: true },
    orderBy: { date: "desc" },
  }).catch(() => []);

  return (
    <div>
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold">Evenements</h1>
          <p className="text-lg text-muted-foreground">Calendrier des evenements du college</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event) => {
                const isPast = new Date(event.date) < new Date();
                return (
                  <Card key={event.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <Badge variant={isPast ? "secondary" : "default"}>
                          {isPast ? "Passe" : "A venir"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-4 w-4" />
                          {new Date(event.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" /> {event.location}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              Aucun evenement pour le moment.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
