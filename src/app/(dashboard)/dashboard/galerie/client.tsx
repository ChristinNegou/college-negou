"use client";

import { useState, useRef } from "react";
import { createAlbum, addPhotoToAlbum, deleteAlbum, deletePhoto } from "@/actions/gallery.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, ImageIcon, FolderPlus, Upload, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

type Photo = { id: string; url: string; caption: string | null };
type Album = {
  id: string;
  title: string;
  description: string | null;
  photos: Photo[];
  _count: { photos: number };
};

export function GalleryClient({ albums }: { albums: Album[] }) {
  const [albumOpen, setAlbumOpen] = useState(false);
  const [photoOpen, setPhotoOpen] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [photoMode, setPhotoMode] = useState<"file" | "url">("file");
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleCreateAlbum(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const result = await createAlbum({
      title: form.get("title") as string,
      description: (form.get("description") as string) || undefined,
    });

    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success("Album cree");
      setAlbumOpen(false);
    }
    setLoading(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }

  async function handleAddPhoto(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedAlbumId) return;
    setLoading(true);
    const form = new FormData(e.currentTarget);

    let photoUrl: string;

    if (photoMode === "file") {
      const file = fileRef.current?.files?.[0];
      if (!file) {
        toast.error("Veuillez selectionner un fichier");
        setLoading(false);
        return;
      }

      const uploadData = new FormData();
      uploadData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: uploadData });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error || "Erreur lors de l'upload");
        setLoading(false);
        return;
      }

      photoUrl = json.url;
    } else {
      photoUrl = form.get("url") as string;
      if (!photoUrl) {
        toast.error("Veuillez entrer une URL");
        setLoading(false);
        return;
      }
    }

    const result = await addPhotoToAlbum({
      albumId: selectedAlbumId,
      url: photoUrl,
      caption: (form.get("caption") as string) || undefined,
    });

    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success("Photo ajoutee");
      setPhotoOpen(false);
      setPreview(null);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <Dialog open={albumOpen} onOpenChange={setAlbumOpen}>
        <DialogTrigger asChild>
          <Button><FolderPlus className="mr-2 h-4 w-4" />Nouvel album</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Nouvel album</DialogTitle></DialogHeader>
          <form onSubmit={handleCreateAlbum} className="space-y-4">
            <div className="space-y-2">
              <Label>Titre</Label>
              <Input name="title" required />
            </div>
            <div className="space-y-2">
              <Label>Description (optionnel)</Label>
              <Input name="description" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creation..." : "Creer l'album"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={photoOpen} onOpenChange={(v) => { setPhotoOpen(v); if (!v) setPreview(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Ajouter une photo</DialogTitle></DialogHeader>
          <form onSubmit={handleAddPhoto} className="space-y-4">
            {/* Mode toggle */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant={photoMode === "file" ? "default" : "outline"}
                size="sm"
                onClick={() => { setPhotoMode("file"); setPreview(null); }}
              >
                <Upload className="mr-2 h-4 w-4" />
                Fichier local
              </Button>
              <Button
                type="button"
                variant={photoMode === "url" ? "default" : "outline"}
                size="sm"
                onClick={() => { setPhotoMode("url"); setPreview(null); }}
              >
                <LinkIcon className="mr-2 h-4 w-4" />
                Lien URL
              </Button>
            </div>

            {photoMode === "file" ? (
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
                <Label>URL de la photo</Label>
                <Input name="url" type="url" placeholder="https://..." />
              </div>
            )}

            <div className="space-y-2">
              <Label>Legende (optionnel)</Label>
              <Input name="caption" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Ajout..." : "Ajouter la photo"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {albums.length > 0 ? (
        <div className="space-y-6">
          {albums.map((album) => (
            <Card key={album.id}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>{album.title}</CardTitle>
                  {album.description && (
                    <p className="text-sm text-muted-foreground mt-1">{album.description}</p>
                  )}
                  <Badge variant="secondary" className="mt-2">{album._count.photos} photo(s)</Badge>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setSelectedAlbumId(album.id); setPhotoOpen(true); }}
                  >
                    <Plus className="mr-1 h-3 w-3" />Photo
                  </Button>
                  <form action={async () => { await deleteAlbum(album.id); }}>
                    <Button type="submit" variant="ghost" size="sm"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </form>
                </div>
              </CardHeader>
              {album.photos.length > 0 && (
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {album.photos.map((photo) => (
                      <div key={photo.id} className="group relative rounded-lg overflow-hidden border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photo.url} alt={photo.caption || ""} className="w-full h-32 object-cover" />
                        {photo.caption && (
                          <p className="text-xs p-2 text-muted-foreground truncate">{photo.caption}</p>
                        )}
                        <form action={async () => { await deletePhoto(photo.id); }} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button type="submit" variant="destructive" size="icon" className="h-6 w-6">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </form>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-muted-foreground">
          <ImageIcon className="mx-auto mb-2 h-8 w-8 opacity-50" />
          Aucun album. Cliquez sur &quot;Nouvel album&quot; pour commencer.
        </div>
      )}
    </div>
  );
}
