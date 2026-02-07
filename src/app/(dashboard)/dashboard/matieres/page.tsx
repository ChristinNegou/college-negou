import { getSubjects } from "@/actions/subject.actions";
import { SubjectsClient } from "./client";

export const metadata = { title: "Matieres - College Polyvalent Negou" };

export default async function MatieresPage() {
  const subjects = await getSubjects();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Matieres</h2>
        <p className="text-muted-foreground">Gerer les matieres enseignees</p>
      </div>
      <SubjectsClient subjects={JSON.parse(JSON.stringify(subjects))} />
    </div>
  );
}
