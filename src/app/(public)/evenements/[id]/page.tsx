import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CalendarDays, MapPin, Clock } from "lucide-react";
import { SCHOOL_NAME } from "@/config/cameroon-education";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const event = await prisma.event
    .findUnique({ where: { id } })
    .catch(() => null);

  if (!event) return { title: `Evenement introuvable - ${SCHOOL_NAME}` };

  return {
    title: `${event.title} - ${SCHOOL_NAME}`,
    description: event.description.slice(0, 160),
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const event = await prisma.event
    .findUnique({ where: { id } })
    .catch(() => null);

  if (!event || !event.isPublished) notFound();

  const isPast = new Date(event.date) < new Date();

  return (
    <div>
      {/* Header with image */}
      {event.imageUrl && (
        <div className="relative h-72 w-full overflow-hidden bg-muted md:h-[28rem]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.imageUrl}
            alt={event.title}
            className="h-full w-full object-cover"
            style={{ objectPosition: "center" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
            <div className="container mx-auto">
              <h1 className="max-w-3xl text-3xl font-bold text-white animate-fade-in-up md:text-4xl lg:text-5xl">
                {event.title}
              </h1>
            </div>
          </div>
        </div>
      )}

      {!event.imageUrl && (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 py-20">
          <div className="absolute inset-0 pattern-dots opacity-30" />
          <div className="container relative mx-auto px-4 text-center">
            <h1 className="mb-4 text-4xl font-bold animate-fade-in-up">{event.title}</h1>
          </div>
        </section>
      )}

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-prose">
            <Button variant="ghost" size="sm" asChild className="mb-6 transition-all hover:translate-x-[-4px]">
              <Link href="/evenements">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux evenements
              </Link>
            </Button>

            {event.imageUrl && (
              <h1 className="mb-4 text-3xl font-bold md:text-4xl">
                {event.title}
              </h1>
            )}

            <div className="mb-6 flex flex-wrap items-center gap-3">
              <Badge
                variant={isPast ? "secondary" : "default"}
                className="text-sm"
              >
                {isPast ? "Passe" : "A venir"}
              </Badge>
            </div>

            <div className="mb-8 space-y-3 rounded-xl border bg-gradient-to-br from-muted/30 to-muted/10 p-5">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <CalendarDays className="h-4 w-4 text-primary" />
                </div>
                <span>
                  {new Date(event.date).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <span>
                  {new Date(event.date).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {event.endDate &&
                    ` - ${new Date(event.endDate).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`}
                </span>
              </div>
              {event.location && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <span>{event.location}</span>
                </div>
              )}
            </div>

            <div className="prose prose-gray max-w-none whitespace-pre-wrap leading-relaxed">
              {event.description}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
