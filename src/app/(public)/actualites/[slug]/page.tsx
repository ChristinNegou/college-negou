import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import { SCHOOL_NAME } from "@/config/cameroon-education";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = await prisma.newsArticle
    .findUnique({ where: { slug } })
    .catch(() => null);

  if (!article) return { title: `Article introuvable - ${SCHOOL_NAME}` };

  return {
    title: `${article.title} - ${SCHOOL_NAME}`,
    description: article.excerpt || article.content.slice(0, 160),
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await prisma.newsArticle
    .findUnique({ where: { slug } })
    .catch(() => null);

  if (!article || !article.isPublished) notFound();

  return (
    <div>
      {/* Header with image */}
      {article.imageUrl && (
        <div className="relative h-72 w-full overflow-hidden bg-muted md:h-[28rem]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.imageUrl}
            alt={article.title}
            className="h-full w-full object-cover"
            style={{ objectPosition: "center" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
            <div className="container mx-auto">
              <h1 className="max-w-3xl text-3xl font-bold text-white animate-fade-in-up md:text-4xl lg:text-5xl">
                {article.title}
              </h1>
            </div>
          </div>
        </div>
      )}

      {!article.imageUrl && (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 py-20">
          <div className="absolute inset-0 pattern-dots opacity-30" />
          <div className="container relative mx-auto px-4 text-center">
            <h1 className="mb-4 text-4xl font-bold animate-fade-in-up">{article.title}</h1>
          </div>
        </section>
      )}

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-prose">
            <Button variant="ghost" size="sm" asChild className="mb-6 transition-all hover:translate-x-[-4px]">
              <Link href="/actualites">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux actualites
              </Link>
            </Button>

            {article.imageUrl && (
              <h1 className="mb-4 text-3xl font-bold md:text-4xl">
                {article.title}
              </h1>
            )}

            <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1">
                <Calendar className="h-4 w-4 text-primary" />
                {new Date(article.publishedAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>

            {article.excerpt && (
              <p className="mb-6 border-l-4 border-primary pl-4 text-lg font-medium text-muted-foreground italic">
                {article.excerpt}
              </p>
            )}

            <div className="prose prose-gray max-w-none whitespace-pre-wrap leading-relaxed">
              {article.content}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
