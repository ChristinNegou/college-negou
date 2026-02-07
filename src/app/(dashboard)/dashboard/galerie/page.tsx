import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";

export const metadata = { title: "Galerie - College Polyvalent Negou" };

export default async function GalerieAdminPage() {
  const albums = await prisma.galleryAlbum.findMany({
    include: { _count: { select: { photos: true } } },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Galerie</h2>
        <p className="text-muted-foreground">Gerer les albums photos</p>
      </div>
      {albums.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-3">
          {albums.map((a) => (
            <Card key={a.id}>
              <CardHeader><CardTitle className="text-lg">{a.title}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{a._count.photos} photo(s)</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <ImageIcon className="mx-auto mb-2 h-8 w-8 opacity-50" />
            Aucun album
          </CardContent>
        </Card>
      )}
    </div>
  );
}
