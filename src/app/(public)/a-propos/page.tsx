import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SCHOOL_NAME, SCHOOL_CITY, SCHOOL_MOTTO } from "@/config/cameroon-education";
import { Target, Eye, BookOpen, Trophy, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const metadata = {
  title: `A Propos - ${SCHOOL_NAME}`,
  description: `Decouvrez l'histoire, la mission et les valeurs du ${SCHOOL_NAME} a ${SCHOOL_CITY}.`,
};

export default async function AProposPage() {
  let aboutImages: { id: string; url: string; alt: string | null }[] = [];
  try {
    aboutImages = await prisma.siteImage.findMany({
      where: { page: "ABOUT", isPublished: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    // SiteImage model may not be available yet
  }
  const mainImage = aboutImages[0];
  const secondImage = aboutImages[1];

  return (
    <div>
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 py-20">
        <div className="absolute inset-0 pattern-dots opacity-30" />
        {/* Wave bottom */}
        <div className="absolute -bottom-1 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="relative block h-8 w-full">
            <path d="M0,30 C300,60 600,0 900,30 C1050,50 1150,20 1200,30 L1200,60 L0,60 Z" className="fill-background" />
          </svg>
        </div>
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold animate-fade-in-up">
            A Propos de notre <span className="gradient-text">College</span>
          </h1>
          <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-gradient-to-r from-primary to-accent animate-fade-in-up" style={{ animationDelay: "0.15s" }} />
          <p className="text-lg text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.3s" }}>{SCHOOL_MOTTO}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl space-y-16">
            {/* History + image */}
            <div className={`${mainImage ? "grid items-center gap-8 md:grid-cols-2" : ""}`}>
              <ScrollReveal direction="left">
                <div>
                  <h2 className="mb-4 text-2xl font-bold">Notre <span className="gradient-text">histoire</span></h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Le {SCHOOL_NAME} est un etablissement d&apos;enseignement secondaire situe a {SCHOOL_CITY},
                    dans la Region de l&apos;Ouest du Cameroun. Fonde avec la vision de fournir une education
                    de qualite accessible a tous, notre college s&apos;est impose comme une reference dans
                    la region grace a l&apos;excellence de son enseignement et a ses resultats aux examens officiels.
                  </p>
                </div>
              </ScrollReveal>
              {mainImage && (
                <ScrollReveal direction="right">
                  <div className="group overflow-hidden rounded-xl shadow-lg transition-shadow duration-300 hover:shadow-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mainImage.url}
                      alt={mainImage.alt || "College Polyvalent Negou"}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </ScrollReveal>
              )}
            </div>

            {/* Mission & Vision */}
            <div className="grid gap-6 md:grid-cols-2">
              {[
                { icon: Target, title: "Mission", desc: "Former des citoyens responsables, competents et ouverts sur le monde, en offrant un enseignement de qualite conforme aux programmes officiels du Cameroun.", color: "from-primary to-primary/70" },
                { icon: Eye, title: "Vision", desc: "Devenir l'etablissement de reference de la Region de l'Ouest pour l'excellence academique et la formation integrale de la jeunesse.", color: "from-accent to-accent/70" },
              ].map((item, i) => (
                <ScrollReveal key={i} delay={i * 150}>
                  <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.color}`} />
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${item.color} text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                          <item.icon className="h-5 w-5" />
                        </div>
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                      {item.desc}
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>

            {/* Values */}
            <div className={`${secondImage ? "grid items-start gap-8 md:grid-cols-[1fr_auto]" : ""}`}>
              <div>
                <ScrollReveal>
                  <h2 className="mb-6 text-2xl font-bold">Nos <span className="gradient-text">valeurs</span></h2>
                </ScrollReveal>
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    { icon: BookOpen, title: "Excellence", desc: "Nous visons les plus hauts standards academiques" },
                    { icon: Trophy, title: "Discipline", desc: "Le respect des regles forge le caractere" },
                    { icon: Target, title: "Reussite", desc: "Chaque eleve a le potentiel de reussir" },
                  ].map((v, i) => (
                    <ScrollReveal key={i} delay={i * 120}>
                      <div className="group rounded-xl border p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30">
                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-accent/10 transition-all duration-300 group-hover:from-primary group-hover:to-accent group-hover:text-white">
                          <v.icon className="h-7 w-7 text-primary transition-colors group-hover:text-white" />
                        </div>
                        <h3 className="mb-2 font-semibold">{v.title}</h3>
                        <p className="text-sm text-muted-foreground">{v.desc}</p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
              {secondImage && (
                <ScrollReveal direction="right">
                  <div className="hidden overflow-hidden rounded-xl shadow-lg transition-shadow duration-300 hover:shadow-2xl md:block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={secondImage.url}
                      alt={secondImage.alt || "Vie au college"}
                      className="h-64 w-48 object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                </ScrollReveal>
              )}
            </div>

            {/* Administration */}
            <div>
              <ScrollReveal>
                <h2 className="mb-6 text-2xl font-bold"><span className="gradient-text">Administration</span></h2>
              </ScrollReveal>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { role: "Proviseur", name: "M. / Mme le Proviseur" },
                  { role: "Censeur", name: "M. / Mme le Censeur" },
                  { role: "Surveillant General", name: "M. / Mme le SG" },
                  { role: "Intendant", name: "M. / Mme l'Intendant" },
                ].map((p, i) => (
                  <ScrollReveal key={i} delay={i * 80}>
                    <div className="group flex items-center gap-4 rounded-xl border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-accent/30">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent transition-transform duration-300 group-hover:scale-105">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary">{p.role}</p>
                        <p className="text-muted-foreground">{p.name}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
