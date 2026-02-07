import { getClasses } from "@/actions/class.actions";
import { getSubjects } from "@/actions/subject.actions";
import { getTeachers } from "@/actions/teacher.actions";
import { ClassesClient } from "./client";

export const metadata = { title: "Classes - College Polyvalent Negou" };

export default async function ClassesPage() {
  const [classes, subjects, teachers] = await Promise.all([
    getClasses(),
    getSubjects(),
    getTeachers(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Classes</h2>
        <p className="text-muted-foreground">Gerer les classes, matieres et enseignants</p>
      </div>
      <ClassesClient
        classes={JSON.parse(JSON.stringify(classes))}
        subjects={JSON.parse(JSON.stringify(subjects))}
        teachers={JSON.parse(JSON.stringify(teachers))}
      />
    </div>
  );
}
