import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SCHOOL_NAME } from "@/config/cameroon-education";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const metadata = {
  title: `Actualites - ${SCHOOL_NAME}`,
  description: "Les dernieres actualites du College Polyvalent Negou.",
};

export default async function ActualitesPage() {
  const articles = await prisma.newsArticle.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  }).catch(() => []);

  return (
    <div>
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 py-20">
        <div className="absolute inset-0 pattern-dots opacity-30" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold animate-fade-in-up">
            <span className="gradient-text">Actualites</span>
          </h1>
          <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-gradient-to-r from-primary to-accent animate-fade-in-up" style={{ animationDelay: "0.15s" }} />
          <p className="text-lg text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.3s" }}>Les dernieres nouvelles du college</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {articles.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, i) => (
                <ScrollReveal key={article.id} delay={i * 100}>
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
                            Lire l&apos;article &rarr;
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
                        <p className="text-sm text-muted-foreground">
                          {article.excerpt || article.content.slice(0, 200)}...
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              Aucune actualite pour le moment. Revenez bientot !
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
