import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, Award, BookOpen, ArrowRight, MapPin } from "lucide-react";
import { SCHOOL_NAME, SCHOOL_MOTTO, SCHOOL_CITY } from "@/config/cameroon-education";
import { prisma } from "@/lib/prisma";

async function getPublicStats() {
  const [students, teachers, news] = await Promise.all([
    prisma.student.count().catch(() => 0),
    prisma.teacher.count().catch(() => 0),
    prisma.newsArticle.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }).catch(() => []),
  ]);
  return { students, teachers, news };
}

export default async function HomePage() {
  const stats = await getPublicStats();

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-accent py-24 text-primary-foreground md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-3xl font-bold">
            CPN
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            {SCHOOL_NAME}
          </h1>
          <p className="mb-2 text-lg opacity-90 md:text-xl">{SCHOOL_MOTTO}</p>
          <p className="mb-8 flex items-center justify-center gap-1 opacity-75">
            <MapPin className="h-4 w-4" /> {SCHOOL_CITY}, Cameroun
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/admissions">
                Preinscription <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link href="/connexion">Portail Eleve / Parent</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-muted/30 py-12">
        <div className="container mx-auto grid grid-cols-2 gap-8 px-4 md:grid-cols-4">
          {[
            { icon: Users, value: `${stats.students}+`, label: "Eleves" },
            { icon: GraduationCap, value: `${stats.teachers}+`, label: "Enseignants" },
            { icon: Award, value: "95%", label: "Taux de reussite" },
            { icon: BookOpen, value: "6e-Tle", label: "Niveaux" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <stat.icon className="mx-auto mb-2 h-8 w-8 text-primary" />
              <div className="text-2xl font-bold md:text-3xl">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Un enseignement d&apos;excellence</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Le College Polyvalent Negou offre un cadre d&apos;apprentissage moderne et adapte
              au systeme educatif camerounais. De la 6eme a la Terminale, nous preparons
              nos eleves aux examens officiels (BEPC, Probatoire, Baccalaureat) avec un
              taux de reussite exceptionnel.
            </p>
            <Button variant="outline" asChild>
              <Link href="/a-propos">En savoir plus</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="border-t bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">Nos programmes</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" /> Cycle College (6e - 3e)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Formation generale solide preparant au BEPC. Matieres fondamentales :
                  Francais, Mathematiques, Sciences, Langues vivantes, Histoire-Geographie.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" /> Cycle Lycee (2nde - Tle)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Series A (Lettres), C (Mathematiques) et D (Sciences). Preparation au
                  Probatoire et au Baccalaureat avec un suivi personnalise.
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link href="/programmes">Voir tous les programmes</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* News */}
      {stats.news.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center text-3xl font-bold">Actualites</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {stats.news.map((article) => (
                <Card key={article.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{article.excerpt || article.content.slice(0, 120)}...</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(article.publishedAt).toLocaleDateString("fr-FR")}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Rejoignez le College Polyvalent Negou</h2>
          <p className="mb-8 text-lg opacity-90">
            Les inscriptions pour l&apos;annee scolaire sont ouvertes.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/admissions">
              Preinscription en ligne <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
