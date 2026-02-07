import { getSessionUser } from "@/actions/auth.actions";
import { redirect } from "next/navigation";
import { getAllSiteImages } from "@/actions/site-image.actions";
import { SiteImagesClient } from "./client";

export const metadata = { title: "Images du site - College Polyvalent Negou" };

export default async function SiteImagesAdminPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") redirect("/connexion");

  const images = await getAllSiteImages();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Images du site</h2>
        <p className="text-muted-foreground">
          Gerez les images illustratives affichees sur le site public
        </p>
      </div>
      <SiteImagesClient images={JSON.parse(JSON.stringify(images))} />
    </div>
  );
}
