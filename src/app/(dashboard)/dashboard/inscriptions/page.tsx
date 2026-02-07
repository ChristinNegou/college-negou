import { getEnrollments } from "@/actions/enrollment.actions";
import { getClasses } from "@/actions/class.actions";
import { getStudents } from "@/actions/student.actions";
import { getAcademicYears } from "@/actions/academic-year.actions";
import { EnrollmentsClient } from "./client";

export const metadata = { title: "Inscriptions - College Polyvalent Negou" };

export default async function InscriptionsPage() {
  const [enrollments, classes, students, years] = await Promise.all([
    getEnrollments(),
    getClasses(),
    getStudents(),
    getAcademicYears(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Inscriptions</h2>
        <p className="text-muted-foreground">Gerer les inscriptions des eleves</p>
      </div>
      <EnrollmentsClient
        enrollments={JSON.parse(JSON.stringify(enrollments))}
        classes={JSON.parse(JSON.stringify(classes))}
        students={JSON.parse(JSON.stringify(students))}
        years={JSON.parse(JSON.stringify(years))}
      />
    </div>
  );
}
