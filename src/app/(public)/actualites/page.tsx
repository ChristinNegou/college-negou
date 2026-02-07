import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SCHOOL_NAME } from "@/config/cameroon-education";

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
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold">Actualites</h1>
          <p className="text-lg text-muted-foreground">Les dernieres nouvelles du college</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {articles.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Card key={article.id}>
                  <CardHeader>
                    <p className="text-xs text-muted-foreground">
                      {new Date(article.publishedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {article.excerpt || article.content.slice(0, 200)}...
                    </p>
                  </CardContent>
                </Card>
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
