import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SCHOOL_NAME } from "@/config/cameroon-education";
import { ImageIcon } from "lucide-react";

export const metadata = {
  title: `Galerie - ${SCHOOL_NAME}`,
  description: "Galerie photos du College Polyvalent Negou.",
};

export default async function GaleriePage() {
  const albums = await prisma.galleryAlbum.findMany({
    where: { isPublished: true },
    include: { photos: { orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return (
    <div>
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold">Galerie Photos</h1>
          <p className="text-lg text-muted-foreground">Decouvrez la vie au college en images</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {albums.length > 0 ? (
            <div className="space-y-12">
              {albums.map((album) => (
                <div key={album.id}>
                  <h2 className="mb-4 text-2xl font-bold">{album.title}</h2>
                  {album.description && (
                    <p className="mb-6 text-muted-foreground">{album.description}</p>
                  )}
                  <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {album.photos.map((photo) => (
                      <Card key={photo.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo.url}
                            alt={photo.caption || album.title}
                            className="aspect-square w-full object-cover"
                          />
                          {photo.caption && (
                            <p className="p-2 text-xs text-muted-foreground">{photo.caption}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <ImageIcon className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>Aucune photo disponible pour le moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
