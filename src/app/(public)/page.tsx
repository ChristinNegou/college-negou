import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, Award, BookOpen, ArrowRight, MapPin, Search } from "lucide-react";
import { SCHOOL_NAME, SCHOOL_MOTTO, SCHOOL_CITY } from "@/config/cameroon-education";
import { prisma } from "@/lib/prisma";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { AnimatedCounter } from "@/components/ui/animated-counter";

async function fetchSiteImages(page: string, section: string) {
  try {
    return await prisma.siteImage.findMany({
      where: { page, section, isPublished: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    return [];
  }
}

async function getPublicData() {
  const [students, teachers, news, events, galleryPhotos, heroImages, aboutImages, programsImages, ctaImages, galleryPreviewImages] = await Promise.all([
    prisma.student.count().catch(() => 0),
    prisma.teacher.count().catch(() => 0),
    prisma.newsArticle.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }).catch(() => []),
    prisma.event.findMany({
      where: { isPublished: true, date: { gte: new Date() } },
      orderBy: { date: "asc" },
      take: 3,
    }).catch(() => []),
    prisma.galleryPhoto.findMany({
      include: { album: { select: { isPublished: true, title: true } } },
      orderBy: { createdAt: "desc" },
      take: 6,
    }).catch(() => []),
    fetchSiteImages("HOME", "HERO"),
    fetchSiteImages("HOME", "ABOUT"),
    fetchSiteImages("HOME", "PROGRAMS"),
    fetchSiteImages("HOME", "CTA"),
    fetchSiteImages("HOME", "GALLERY_PREVIEW"),
  ]);

  const publishedPhotos = galleryPhotos.filter((p) => p.album.isPublished);

  return { students, teachers, news, events, galleryPhotos: publishedPhotos, heroImages, aboutImages, programsImages, ctaImages, galleryPreviewImages };
}

export default async function HomePage() {
  const data = await getPublicData();
  const heroImage = data.heroImages[0];
  const aboutImage = data.aboutImages[0];
  const programsImage = data.programsImages[0];
  const ctaImage = data.ctaImages[0];

  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden py-28 text-primary-foreground md:py-36"
        style={heroImage ? { backgroundImage: `url(${heroImage.url})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" } : undefined}
      >
        {/* Overlay */}
        <div className={`absolute inset-0 ${heroImage ? "bg-black/60" : "bg-gradient-to-br from-primary via-primary/90 to-accent"}`} />

        {/* Decorative shapes */}
        <div className="absolute top-10 left-10 h-20 w-20 rounded-full bg-white/5 animate-float" />
        <div className="absolute top-1/3 right-16 h-14 w-14 rotate-45 bg-white/5 animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-16 left-1/4 h-10 w-10 rounded-full bg-white/5 animate-float" style={{ animationDelay: "2s" }} />

        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-3xl font-bold backdrop-blur-sm animate-fade-in-up">
            CPN
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight animate-fade-in-up md:text-5xl lg:text-6xl" style={{ animationDelay: "0.15s" }}>
            {SCHOOL_NAME}
          </h1>
          <p className="mb-2 text-lg opacity-90 animate-fade-in-up md:text-xl" style={{ animationDelay: "0.3s" }}>{SCHOOL_MOTTO}</p>
          <p className="mb-8 flex items-center justify-center gap-1 opacity-75 animate-fade-in-up" style={{ animationDelay: "0.45s" }}>
            <MapPin className="h-4 w-4" /> {SCHOOL_CITY}, Cameroun
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <Button size="lg" variant="secondary" className="transition-all duration-300 hover:scale-105 hover:shadow-lg" asChild>
              <Link href="/admissions">
                Preinscription <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:shadow-lg" asChild>
              <Link href="/connexion">Portail Eleve / Parent</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative border-b bg-muted/30 py-14">
        <div className="container mx-auto grid grid-cols-2 gap-8 px-4 md:grid-cols-4">
          {[
            { icon: Users, value: data.students, suffix: "+", label: "Eleves" },
            { icon: GraduationCap, value: data.teachers, suffix: "+", label: "Enseignants" },
            { icon: Award, value: 95, suffix: "%", label: "Taux de reussite" },
            { icon: BookOpen, value: 0, staticText: "6e-Tle", label: "Niveaux" },
          ].map((stat, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 120}>
              <div className="group rounded-xl border-l-4 border-primary bg-background p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <stat.icon className="mx-auto mb-3 h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                <div className="text-2xl font-bold md:text-3xl">
                  {"staticText" in stat ? stat.staticText : <AnimatedCounter target={stat.value} suffix={stat.suffix} />}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className={`mx-auto ${aboutImage ? "grid max-w-5xl items-center gap-12 md:grid-cols-2" : "max-w-3xl text-center"}`}>
            <ScrollReveal direction="left">
              <div>
                <h2 className="mb-4 text-3xl font-bold">Un enseignement d&apos;<span className="gradient-text">excellence</span></h2>
                <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                  Le College Polyvalent Negou offre un cadre d&apos;apprentissage moderne et adapte
                  au systeme educatif camerounais. De la 6eme a la Terminale, nous preparons
                  nos eleves aux examens officiels (BEPC, Probatoire, Baccalaureat) avec un
                  taux de reussite exceptionnel.
                </p>
                <Button variant="outline" className="transition-all duration-300 hover:scale-105" asChild>
                  <Link href="/a-propos">En savoir plus</Link>
                </Button>
              </div>
            </ScrollReveal>
            {aboutImage && (
              <ScrollReveal direction="right">
                <div className="group relative overflow-hidden rounded-xl shadow-lg">
                  <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-br from-primary to-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ padding: "2px", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={aboutImage.url}
                    alt={aboutImage.alt || "College Polyvalent Negou"}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="border-t bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="mb-10 text-center text-3xl font-bold">Nos <span className="gradient-text">programmes</span></h2>
          </ScrollReveal>
          <div className={`${programsImage ? "grid max-w-5xl mx-auto items-center gap-8 md:grid-cols-[1fr_auto]" : ""}`}>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                { icon: BookOpen, title: "Cycle College (6e - 3e)", desc: "Formation generale solide preparant au BEPC. Matieres fondamentales : Francais, Mathematiques, Sciences, Langues vivantes, Histoire-Geographie." },
                { icon: GraduationCap, title: "Cycle Lycee (2nde - Tle)", desc: "Series A (Lettres), C (Mathematiques) et D (Sciences). Preparation au Probatoire et au Baccalaureat avec un suivi personnalise." },
              ].map((program, i) => (
                <ScrollReveal key={i} delay={i * 150}>
                  <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-accent" />
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white transition-transform duration-300 group-hover:scale-110">
                          <program.icon className="h-5 w-5" />
                        </div>
                        {program.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{program.desc}</p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
            {programsImage && (
              <ScrollReveal direction="right">
                <div className="hidden overflow-hidden rounded-xl shadow-lg md:block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={programsImage.url}
                    alt={programsImage.alt || "Nos programmes"}
                    className="h-64 w-48 object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </ScrollReveal>
            )}
          </div>
          <ScrollReveal>
            <div className="mt-10 text-center">
              <Button variant="outline" className="transition-all duration-300 hover:scale-105" asChild>
                <Link href="/programmes">Voir tous les programmes</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* News */}
      {data.news.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <h2 className="mb-10 text-center text-3xl font-bold">
                <span className="gradient-text">Actualites</span>
              </h2>
            </ScrollReveal>
            <div className="grid gap-6 md:grid-cols-3">
              {data.news.map((article, i) => (
                <ScrollReveal key={article.id} delay={i * 120}>
                  <Link href={`/actualites/${article.slug}`} className="group block h-full">
                    <Card className="h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                      {article.imageUrl && (
                        <div className="relative aspect-video w-full overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          <span className="absolute bottom-3 left-3 text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            Lire la suite &rarr;
                          </span>
                        </div>
                      )}
                      <CardHeader>
                        <div className="mb-1 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          {new Date(article.publishedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                        </div>
                        <CardTitle className="text-lg transition-colors group-hover:text-primary">{article.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{article.excerpt || article.content.slice(0, 120)}...</p>
                      </CardContent>
                    </Card>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
            <ScrollReveal>
              <div className="mt-10 text-center">
                <Button variant="outline" className="transition-all duration-300 hover:scale-105" asChild>
                  <Link href="/actualites">Toutes les actualites</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Gallery Preview */}
      {data.galleryPhotos.length > 0 && (
        <section className="border-t bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <h2 className="mb-10 text-center text-3xl font-bold">Galerie <span className="gradient-text">photos</span></h2>
            </ScrollReveal>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {data.galleryPhotos.map((photo, i) => (
                <ScrollReveal key={photo.id} delay={i * 80}>
                  <div className="group relative overflow-hidden rounded-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.url}
                      alt={photo.caption || "Photo du college"}
                      className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <Search className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
            <ScrollReveal>
              <div className="mt-10 text-center">
                <Button variant="outline" className="transition-all duration-300 hover:scale-105" asChild>
                  <Link href="/galerie">Voir toute la galerie</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* CTA */}
      <section
        className="relative overflow-hidden py-20 text-primary-foreground"
        style={ctaImage ? { backgroundImage: `url(${ctaImage.url})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" } : undefined}
      >
        <div className={`absolute inset-0 ${ctaImage ? "bg-primary/80" : "bg-primary"}`} />
        <div className="absolute inset-0 pattern-dots" />
        <div className="container relative mx-auto px-4 text-center">
          <ScrollReveal direction="fade">
            <h2 className="mb-4 text-3xl font-bold">Rejoignez le College Polyvalent Negou</h2>
            <p className="mb-8 text-lg opacity-90">
              Les inscriptions pour l&apos;annee scolaire sont ouvertes.
            </p>
            <Button size="lg" variant="secondary" className="animate-pulse-soft transition-all duration-300 hover:scale-105 hover:shadow-lg" asChild>
              <Link href="/admissions">
                Preinscription en ligne <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
