import { getFeeStructures } from "@/actions/payment.actions";
import { getAcademicYears, getCurrentYear } from "@/actions/academic-year.actions";
import { FeesClient } from "./client";

export const metadata = { title: "Frais scolaires - College Polyvalent Negou" };

export default async function FraisPage() {
  const currentYear = await getCurrentYear();
  const years = await getAcademicYears();
  const fees = currentYear ? await getFeeStructures(currentYear.id) : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Frais scolaires</h2>
        <p className="text-muted-foreground">Gerer la structure des frais par niveau</p>
      </div>
      <FeesClient
        fees={JSON.parse(JSON.stringify(fees))}
        years={JSON.parse(JSON.stringify(years))}
        currentYearId={currentYear?.id || ""}
      />
    </div>
  );
}
