import { prisma } from "@/lib/prisma";
import { SCHOOL_NAME } from "@/config/cameroon-education";
import { ImageIcon, Search } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

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
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 py-20">
        <div className="absolute inset-0 pattern-dots opacity-30" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold animate-fade-in-up">
            Galerie <span className="gradient-text">Photos</span>
          </h1>
          <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-gradient-to-r from-primary to-accent animate-fade-in-up" style={{ animationDelay: "0.15s" }} />
          <p className="text-lg text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.3s" }}>Decouvrez la vie au college en images</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {albums.length > 0 ? (
            <div className="space-y-16">
              {albums.map((album) => (
                <div key={album.id}>
                  <ScrollReveal>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold">
                        <span className="gradient-text">{album.title}</span>
                      </h2>
                      {album.description && (
                        <p className="mt-2 text-muted-foreground">{album.description}</p>
                      )}
                      <div className="mt-3 h-0.5 w-12 rounded-full bg-gradient-to-r from-primary to-accent" />
                    </div>
                  </ScrollReveal>
                  <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {album.photos.map((photo, i) => (
                      <ScrollReveal key={photo.id} delay={i * 60}>
                        <div className="group relative overflow-hidden rounded-xl shadow-sm transition-shadow duration-300 hover:shadow-xl">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo.url}
                            alt={photo.caption || album.title}
                            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <Search className="mb-2 h-8 w-8 text-white" />
                            {photo.caption && (
                              <p className="px-3 text-center text-sm text-white">{photo.caption}</p>
                            )}
                          </div>
                        </div>
                      </ScrollReveal>
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
