"use client";

import { useState, useRef } from "react";
import { createSiteImage, deleteSiteImage } from "@/actions/site-image.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, ImageIcon, Upload, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

type SiteImage = {
  id: string;
  section: string;
  page: string;
  url: string;
  alt: string | null;
  title: string | null;
  description: string | null;
  size: string;
  sortOrder: number;
  isPublished: boolean;
};

const SECTIONS = [
  { value: "HERO", label: "Hero (banniere)" },
  { value: "ABOUT", label: "A propos" },
  { value: "PROGRAMS", label: "Programmes" },
  { value: "CTA", label: "Appel a l'action" },
  { value: "GALLERY_PREVIEW", label: "Apercu galerie" },
];

const PAGES = [
  { value: "HOME", label: "Accueil" },
  { value: "ABOUT", label: "A propos" },
];

const SIZES = [
  { value: "SMALL", label: "Petite" },
  { value: "MEDIUM", label: "Moyenne" },
  { value: "LARGE", label: "Grande" },
  { value: "FULL", label: "Pleine largeur" },
];

function sectionLabel(section: string) {
  return SECTIONS.find((s) => s.value === section)?.label ?? section;
}

function sizeLabel(size: string) {
  return SIZES.find((s) => s.value === size)?.label ?? size;
}

export function SiteImagesClient({ images }: { images: SiteImage[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState("HERO");
  const [page, setPage] = useState("HOME");
  const [size, setSize] = useState("MEDIUM");
  const [mode, setMode] = useState<"file" | "url">("file");
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    let imageUrl: string;

    if (mode === "file") {
      const file = fileRef.current?.files?.[0];
      if (!file) {
        toast.error("Veuillez selectionner un fichier");
        setLoading(false);
        return;
      }

      // Upload file
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
    } else {
      imageUrl = form.get("url") as string;
      if (!imageUrl) {
        toast.error("Veuillez entrer une URL");
        setLoading(false);
        return;
      }
    }

    const result = await createSiteImage({
      section,
      page,
      url: imageUrl,
      alt: (form.get("alt") as string) || undefined,
      title: (form.get("title") as string) || undefined,
      description: (form.get("description") as string) || undefined,
      size,
      sortOrder: Number(form.get("sortOrder")) || 0,
    });

    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success("Image ajoutee");
      setOpen(false);
      setPreview(null);
    }
    setLoading(false);
  }

  // Group images by section
  const grouped = images.reduce<Record<string, SiteImage[]>>((acc, img) => {
    const key = `${img.page} - ${img.section}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(img);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setPreview(null); }}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une image
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvelle image du site</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            {/* Mode toggle */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant={mode === "file" ? "default" : "outline"}
                size="sm"
                onClick={() => { setMode("file"); setPreview(null); }}
              >
                <Upload className="mr-2 h-4 w-4" />
                Fichier local
              </Button>
              <Button
                type="button"
                variant={mode === "url" ? "default" : "outline"}
                size="sm"
                onClick={() => { setMode("url"); setPreview(null); }}
              >
                <LinkIcon className="mr-2 h-4 w-4" />
                Lien URL
              </Button>
            </div>

            {mode === "file" ? (
              <div className="space-y-2">
                <Label>Choisir une image</Label>
                <Input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, WebP, GIF ou SVG. Max 5 Mo.
                </p>
                {preview && (
                  <div className="mt-2 overflow-hidden rounded-lg border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Apercu" className="max-h-48 w-full object-contain" />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label>URL de l&apos;image</Label>
                <Input name="url" type="url" placeholder="https://..." />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Page</Label>
                <Select value={page} onValueChange={setPage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGES.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Section</Label>
                <Select value={section} onValueChange={setSection}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTIONS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Taille</Label>
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SIZES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ordre d&apos;affichage</Label>
                <Input name="sortOrder" type="number" defaultValue={0} min={0} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Texte alternatif (optionnel)</Label>
              <Input name="alt" placeholder="Description de l'image" />
            </div>
            <div className="space-y-2">
              <Label>Titre (optionnel)</Label>
              <Input name="title" />
            </div>
            <div className="space-y-2">
              <Label>Description (optionnel)</Label>
              <Input name="description" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Ajout en cours..." : "Ajouter l'image"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {Object.keys(grouped).length > 0 ? (
        Object.entries(grouped).map(([key, imgs]) => (
          <div key={key}>
            <h3 className="mb-3 text-lg font-semibold">{key}</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {imgs.map((img) => (
                <Card key={img.id} className="overflow-hidden">
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.alt || "Image du site"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardHeader className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        {img.title && (
                          <CardTitle className="text-sm">{img.title}</CardTitle>
                        )}
                        <div className="flex gap-1">
                          <Badge variant="outline" className="text-xs">
                            {sectionLabel(img.section)}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {sizeLabel(img.size)}
                          </Badge>
                        </div>
                      </div>
                      <form
                        action={async () => {
                          await deleteSiteImage(img.id);
                        }}
                      >
                        <Button type="submit" variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </form>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="py-12 text-center text-muted-foreground">
          <ImageIcon className="mx-auto mb-4 h-12 w-12 opacity-50" />
          <p>Aucune image configuree. Ajoutez des images pour illustrer le site public.</p>
        </div>
      )}
    </div>
  );
}
