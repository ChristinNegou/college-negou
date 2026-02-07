"use client";

import { useState } from "react";
import { createNewsArticle, deleteNewsArticle, toggleNewsPublished } from "@/actions/news.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

type Article = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  isPublished: boolean;
  publishedAt: string;
};

export function NewsClient({ articles }: { articles: Article[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const result = await createNewsArticle({
      title: form.get("title") as string,
      content: form.get("content") as string,
      excerpt: (form.get("excerpt") as string) || undefined,
    });

    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success("Article publie");
      setOpen(false);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button><Plus className="mr-2 h-4 w-4" />Nouvel article</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Nouvel article</DialogTitle></DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label>Titre</Label>
              <Input name="title" required />
            </div>
            <div className="space-y-2">
              <Label>Resume (optionnel)</Label>
              <Input name="excerpt" placeholder="Court resume de l'article" />
            </div>
            <div className="space-y-2">
              <Label>Contenu</Label>
              <Textarea name="content" rows={6} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Publication..." : "Publier l'article"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {articles.map((a) => (
          <Card key={a.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-lg">{a.title}</CardTitle>
                <div className="mt-1 flex gap-2">
                  <span className="text-xs text-muted-foreground">
                    {new Date(a.publishedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                  <Badge variant={a.isPublished ? "default" : "secondary"}>
                    {a.isPublished ? "Publie" : "Brouillon"}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-1">
                <form action={async () => { await toggleNewsPublished(a.id); }}>
                  <Button type="submit" variant="ghost" size="sm" title={a.isPublished ? "Depublier" : "Publier"}>
                    {a.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </form>
                <form action={async () => { await deleteNewsArticle(a.id); }}>
                  <Button type="submit" variant="ghost" size="sm"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </form>
              </div>
            </CardHeader>
            {a.excerpt && (
              <CardContent>
                <p className="text-sm text-muted-foreground">{a.excerpt}</p>
              </CardContent>
            )}
          </Card>
        ))}
        {articles.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            Aucun article. Cliquez sur &quot;Nouvel article&quot; pour commencer.
          </div>
        )}
      </div>
    </div>
  );
}
