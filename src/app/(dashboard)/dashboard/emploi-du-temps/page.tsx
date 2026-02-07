import { getClasses } from "@/actions/class.actions";
import { TimetableClient } from "./client";

export const metadata = { title: "Emploi du temps - College Polyvalent Negou" };

export default async function EmploiDuTempsPage() {
  const classes = await getClasses();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Emploi du temps</h2>
        <p className="text-muted-foreground">Consulter et gerer les emplois du temps</p>
      </div>
      <TimetableClient classes={JSON.parse(JSON.stringify(classes))} />
    </div>
  );
}
