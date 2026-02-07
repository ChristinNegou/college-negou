"use client";

import { useState, useRef } from "react";
import { createEvent, deleteEvent, toggleEventPublished } from "@/actions/event.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Eye, EyeOff, MapPin, Calendar, Upload, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

type EventData = {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate: string | null;
  location: string | null;
  imageUrl: string | null;
  isPublished: boolean;
};

export function EventsClient({ events }: { events: EventData[] }) {
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

    const result = await createEvent({
      title: form.get("title") as string,
      description: form.get("description") as string,
      date: form.get("date") as string,
      endDate: (form.get("endDate") as string) || undefined,
      location: (form.get("location") as string) || undefined,
      imageUrl,
    });

    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success("Evenement cree");
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
          <Button><Plus className="mr-2 h-4 w-4" />Nouvel evenement</Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Nouvel evenement</DialogTitle></DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label>Titre</Label>
              <Input name="title" required />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea name="description" rows={4} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date de debut</Label>
                <Input name="date" type="datetime-local" required />
              </div>
              <div className="space-y-2">
                <Label>Date de fin (optionnel)</Label>
                <Input name="endDate" type="datetime-local" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Lieu (optionnel)</Label>
              <Input name="location" placeholder="Ex: Salle polyvalente" />
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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creation..." : "Creer l'evenement"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-2">
        {events.map((ev) => {
          const isPast = new Date(ev.date) < new Date();
          return (
            <Card key={ev.id} className="overflow-hidden">
              {ev.imageUrl && (
                <div className="h-32 w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ev.imageUrl} alt={ev.title} className="h-full w-full object-cover" />
                </div>
              )}
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{ev.title}</CardTitle>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Badge variant={isPast ? "secondary" : "default"}>
                      {isPast ? "Passe" : "A venir"}
                    </Badge>
                    <Badge variant={ev.isPublished ? "outline" : "secondary"}>
                      {ev.isPublished ? "Publie" : "Brouillon"}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <form action={async () => { await toggleEventPublished(ev.id); }}>
                    <Button type="submit" variant="ghost" size="sm">
                      {ev.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </form>
                  <form action={async () => { await deleteEvent(ev.id); }}>
                    <Button type="submit" variant="ghost" size="sm"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </form>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground line-clamp-2">{ev.description}</p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(ev.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                  {ev.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {ev.location}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {events.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          Aucun evenement. Cliquez sur &quot;Nouvel evenement&quot; pour commencer.
        </div>
      )}
    </div>
  );
}
