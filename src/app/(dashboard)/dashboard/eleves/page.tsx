import { getStudents } from "@/actions/student.actions";
import { getClasses } from "@/actions/class.actions";
import { getCurrentYear } from "@/actions/academic-year.actions";
import { StudentsClient } from "./client";

export const metadata = { title: "Eleves - College Polyvalent Negou" };

export default async function ElevesPage() {
  const [students, classes, currentYear] = await Promise.all([
    getStudents(),
    getClasses(),
    getCurrentYear(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Eleves</h2>
        <p className="text-muted-foreground">Gerer les eleves du college</p>
      </div>
      <StudentsClient
        students={JSON.parse(JSON.stringify(students))}
        classes={JSON.parse(JSON.stringify(classes))}
        currentYearId={currentYear?.id || ""}
      />
    </div>
  );
}
