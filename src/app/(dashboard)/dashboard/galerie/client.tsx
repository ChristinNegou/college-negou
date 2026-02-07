"use client";

import { useState } from "react";
import { createAlbum, addPhotoToAlbum, deleteAlbum, deletePhoto } from "@/actions/gallery.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, ImageIcon, FolderPlus } from "lucide-react";
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

  async function handleAddPhoto(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedAlbumId) return;
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const result = await addPhotoToAlbum({
      albumId: selectedAlbumId,
      url: form.get("url") as string,
      caption: (form.get("caption") as string) || undefined,
    });

    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success("Photo ajoutee");
      setPhotoOpen(false);
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

      <Dialog open={photoOpen} onOpenChange={setPhotoOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Ajouter une photo</DialogTitle></DialogHeader>
          <form onSubmit={handleAddPhoto} className="space-y-4">
            <div className="space-y-2">
              <Label>URL de la photo</Label>
              <Input name="url" type="url" placeholder="https://..." required />
            </div>
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
