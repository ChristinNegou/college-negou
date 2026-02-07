import { getSessionUser } from "@/actions/auth.actions";
import { redirect } from "next/navigation";
import { getNewsArticles } from "@/actions/news.actions";
import { NewsClient } from "./client";

export const metadata = { title: "Actualites - College Polyvalent Negou" };

export default async function ActualitesAdminPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") redirect("/connexion");

  const articles = await getNewsArticles();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Actualites</h2>
        <p className="text-muted-foreground">Gerer les articles d&apos;actualites</p>
      </div>
      <NewsClient articles={JSON.parse(JSON.stringify(articles))} />
    </div>
  );
}
