"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function ActualitesAdminPage() {
  const [open, setOpen] = useState(false);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const slug = (form.get("title") as string).toLowerCase().replace(/[^a-z0-9]+/g, "-");

    await fetch("/api/content/news", {
      method: "POST",
      body: JSON.stringify({
        title: form.get("title"),
        content: form.get("content"),
        excerpt: form.get("excerpt"),
        slug,
      }),
    });
    toast.success("Article publie");
    setOpen(false);
    window.location.reload();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Actualites</h2>
          <p className="text-muted-foreground">Gerer les articles d&apos;actualites</p>
        </div>
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
                <Label>Resume</Label>
                <Input name="excerpt" />
              </div>
              <div className="space-y-2">
                <Label>Contenu</Label>
                <Textarea name="content" rows={6} required />
              </div>
              <Button type="submit" className="w-full">Publier</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Utilisez le bouton ci-dessus pour creer des articles.
        </CardContent>
      </Card>
    </div>
  );
}
