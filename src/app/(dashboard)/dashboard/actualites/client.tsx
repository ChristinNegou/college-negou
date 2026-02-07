"use client";

import { useState, useRef } from "react";
import { createNewsArticle, deleteNewsArticle, toggleNewsPublished } from "@/actions/news.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Eye, EyeOff, Upload, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

type Article = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  imageUrl: string | null;
  isPublished: boolean;
  publishedAt: string;
};

export function NewsClient({ articles }: { articles: Article[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgMode, setImgMode] = useState<"file" | "url" | "none">("none");
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    let imageUrl: string | undefined;

    if (imgMode === "file") {
      const file = fileRef.current?.files?.[0];
      if (file) {
        const uploadData = new FormData();
        uploadData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: uploadData });
        const json = await res.json();
        if (!res.ok) {
          toast.error(json.error || "Erreur lors de l'upload");
          setLoading(false);
          return;
        }
        imageUrl = json.url;
      }
    } else if (imgMode === "url") {
      imageUrl = (form.get("imageUrl") as string) || undefined;
    }

    const result = await createNewsArticle({
      title: form.get("title") as string,
      content: form.get("content") as string,
      excerpt: (form.get("excerpt") as string) || undefined,
      imageUrl,
    });

    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success("Article publie");
      setOpen(false);
      setPreview(null);
      setImgMode("none");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setPreview(null); setImgMode("none"); } }}>
        <DialogTrigger asChild>
          <Button><Plus className="mr-2 h-4 w-4" />Nouvel article</Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
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

            {/* Image section */}
            <div className="space-y-2">
              <Label>Image (optionnel)</Label>
              <div className="flex gap-2">
                <Button type="button" variant={imgMode === "file" ? "default" : "outline"} size="sm"
                  onClick={() => { setImgMode("file"); setPreview(null); }}>
                  <Upload className="mr-2 h-4 w-4" />Fichier
                </Button>
                <Button type="button" variant={imgMode === "url" ? "default" : "outline"} size="sm"
                  onClick={() => { setImgMode("url"); setPreview(null); }}>
                  <LinkIcon className="mr-2 h-4 w-4" />URL
                </Button>
                {imgMode !== "none" && (
                  <Button type="button" variant="ghost" size="sm"
                    onClick={() => { setImgMode("none"); setPreview(null); }}>
                    Aucune
                  </Button>
                )}
              </div>
              {imgMode === "file" && (
                <div>
                  <Input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleFileChange} className="cursor-pointer" />
                  <p className="mt-1 text-xs text-muted-foreground">JPG, PNG, WebP ou GIF. Max 5 Mo.</p>
                  {preview && (
                    <div className="mt-2 overflow-hidden rounded-lg border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={preview} alt="Apercu" className="max-h-40 w-full object-contain" />
                    </div>
                  )}
                </div>
              )}
              {imgMode === "url" && (
                <Input name="imageUrl" type="url" placeholder="https://..." />
              )}
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
          <Card key={a.id} className="overflow-hidden">
            {a.imageUrl && (
              <div className="h-32 w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.imageUrl} alt={a.title} className="h-full w-full object-cover" />
              </div>
            )}
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
