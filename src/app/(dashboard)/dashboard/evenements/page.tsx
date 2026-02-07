import { getSessionUser } from "@/actions/auth.actions";
import { redirect } from "next/navigation";
import { getEvents } from "@/actions/event.actions";
import { EventsClient } from "./client";

export const metadata = { title: "Evenements - College Polyvalent Negou" };

export default async function EvenementsAdminPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") redirect("/connexion");

  const events = await getEvents();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Evenements</h2>
        <p className="text-muted-foreground">Gerer les evenements du college</p>
      </div>
      <EventsClient events={JSON.parse(JSON.stringify(events))} />
    </div>
  );
}
