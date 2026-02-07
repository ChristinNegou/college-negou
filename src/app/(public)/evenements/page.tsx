import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin } from "lucide-react";
import { SCHOOL_NAME } from "@/config/cameroon-education";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

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
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 py-20">
        <div className="absolute inset-0 pattern-dots opacity-30" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold animate-fade-in-up">
            <span className="gradient-text">Evenements</span>
          </h1>
          <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-gradient-to-r from-primary to-accent animate-fade-in-up" style={{ animationDelay: "0.15s" }} />
          <p className="text-lg text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.3s" }}>Calendrier des evenements du college</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event, i) => {
                const isPast = new Date(event.date) < new Date();
                const eventDate = new Date(event.date);
                return (
                  <ScrollReveal key={event.id} delay={i * 80}>
                    <Link href={`/evenements/${event.id}`} className="group block">
                      <Card className={`overflow-hidden transition-all duration-300 hover:translate-x-1 hover:shadow-lg ${isPast ? "border-l-4 border-l-muted-foreground/30" : "border-l-4 border-l-primary"}`}>
                        <div className={`${event.imageUrl ? "md:flex" : "flex"}`}>
                          {/* Date circle */}
                          <div className="flex shrink-0 items-center justify-center p-4 md:p-6">
                            <div className={`flex h-16 w-16 flex-col items-center justify-center rounded-full ${isPast ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}`}>
                              <span className="text-xl font-bold leading-none">{eventDate.getDate()}</span>
                              <span className="text-[10px] font-medium uppercase">{eventDate.toLocaleDateString("fr-FR", { month: "short" })}</span>
                            </div>
                          </div>

                          {event.imageUrl && (
                            <div className="w-full overflow-hidden md:w-48 md:shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={event.imageUrl}
                                alt={event.title}
                                className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-full"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <CardTitle className="text-lg transition-colors group-hover:text-primary">{event.title}</CardTitle>
                                <Badge variant={isPast ? "secondary" : "default"} className="shrink-0">
                                  {isPast ? "Passe" : "A venir"}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                              <div className="flex gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <CalendarDays className="h-4 w-4" />
                                  {eventDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                                </span>
                                {event.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" /> {event.location}
                                  </span>
                                )}
                              </div>
                            </CardContent>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </ScrollReveal>
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
