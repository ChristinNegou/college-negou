import { getSessionUser } from "@/actions/auth.actions";
import { redirect } from "next/navigation";
import { getParents, getStudentsForParentAssignment } from "@/actions/parent.actions";
import { ParentsClient } from "./client";

export const metadata = { title: "Parents - College Polyvalent Negou" };

export default async function ParentsPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") redirect("/connexion");

  const [parents, students] = await Promise.all([
    getParents(),
    getStudentsForParentAssignment(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Parents</h2>
        <p className="text-muted-foreground">Gerer les parents d&apos;eleves</p>
      </div>
      <ParentsClient
        parents={JSON.parse(JSON.stringify(parents))}
        students={JSON.parse(JSON.stringify(students))}
      />
    </div>
  );
}
