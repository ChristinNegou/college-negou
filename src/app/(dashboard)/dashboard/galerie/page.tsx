import { getSessionUser } from "@/actions/auth.actions";
import { redirect } from "next/navigation";
import { getAlbums } from "@/actions/gallery.actions";
import { GalleryClient } from "./client";

export const metadata = { title: "Galerie - College Polyvalent Negou" };

export default async function GalerieAdminPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") redirect("/connexion");

  const albums = await getAlbums();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Galerie</h2>
        <p className="text-muted-foreground">Gerer les albums photos</p>
      </div>
      <GalleryClient albums={JSON.parse(JSON.stringify(albums))} />
    </div>
  );
}
