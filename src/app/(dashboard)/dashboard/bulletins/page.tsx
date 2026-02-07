import { getClasses } from "@/actions/class.actions";
import { getAcademicYears } from "@/actions/academic-year.actions";
import { BulletinsClient } from "./client";

export const metadata = { title: "Bulletins - College Polyvalent Negou" };

export default async function BulletinsPage() {
  const [classes, years] = await Promise.all([getClasses(), getAcademicYears()]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Bulletins</h2>
        <p className="text-muted-foreground">Generer et consulter les bulletins de notes</p>
      </div>
      <BulletinsClient
        classes={JSON.parse(JSON.stringify(classes))}
        years={JSON.parse(JSON.stringify(years))}
      />
    </div>
  );
}
