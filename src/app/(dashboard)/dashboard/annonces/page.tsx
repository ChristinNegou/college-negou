import { getSessionUser } from "@/actions/auth.actions";
import { redirect } from "next/navigation";
import { getAnnouncements } from "@/actions/announcement.actions";
import { getClasses } from "@/actions/class.actions";
import { AnnouncementsClient } from "./client";

export const metadata = { title: "Annonces - College Polyvalent Negou" };

export default async function AnnoncesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/connexion");

  const announcements = await getAnnouncements(
    user.role === "ADMIN" ? undefined : { targetRole: user.role }
  );
  const classes = user.role === "ADMIN" ? await getClasses() : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Annonces</h2>
        <p className="text-muted-foreground">
          {user.role === "ADMIN" ? "Gerer les annonces" : "Annonces de l'etablissement"}
        </p>
      </div>
      <AnnouncementsClient
        announcements={JSON.parse(JSON.stringify(announcements))}
        classes={JSON.parse(JSON.stringify(classes))}
        isAdmin={user.role === "ADMIN"}
      />
    </div>
  );
}
