import { getAcademicYears } from "@/actions/academic-year.actions";
import { AcademicYearsClient } from "./client";

export const metadata = { title: "Annees scolaires - College Polyvalent Negou" };

export default async function AnneesPage() {
  const years = await getAcademicYears();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Annees scolaires</h2>
        <p className="text-muted-foreground">Gerer les annees scolaires et les trimestres</p>
      </div>
      <AcademicYearsClient years={JSON.parse(JSON.stringify(years))} />
    </div>
  );
}
