import { getTeachers } from "@/actions/teacher.actions";
import { TeachersClient } from "./client";

export const metadata = { title: "Enseignants - College Polyvalent Negou" };

export default async function EnseignantsPage() {
  const teachers = await getTeachers();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Enseignants</h2>
        <p className="text-muted-foreground">Gerer les enseignants</p>
      </div>
      <TeachersClient teachers={JSON.parse(JSON.stringify(teachers))} />
    </div>
  );
}
