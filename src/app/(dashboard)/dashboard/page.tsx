import { getSessionUser } from "@/actions/auth.actions";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, School, CreditCard } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { roleLabels } from "@/config/dashboard";

export const metadata = {
  title: "Tableau de bord - College Polyvalent Negou",
};

async function getAdminStats() {
  const [students, teachers, classes, payments] = await Promise.all([
    prisma.student.count(),
    prisma.teacher.count(),
    prisma.class.count(),
    prisma.payment.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true },
    }),
  ]);

  return {
    students,
    teachers,
    classes,
    totalRevenue: payments._sum.amount || 0,
  };
}

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/connexion");

  const isAdmin = user.role === "ADMIN";
  const stats = isAdmin ? await getAdminStats() : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Bienvenue, {user.profile.firstName} {user.profile.lastName}
        </h2>
        <p className="text-muted-foreground">
          {roleLabels[user.role]} - College Polyvalent Negou
        </p>
      </div>

      {isAdmin && stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Eleves</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.students}</div>
              <p className="text-xs text-muted-foreground">inscrits</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Enseignants</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.teachers}</div>
              <p className="text-xs text-muted-foreground">actifs</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Classes</CardTitle>
              <School className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.classes}</div>
              <p className="text-xs text-muted-foreground">ouvertes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Revenus</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("fr-FR").format(stats.totalRevenue)} XAF
              </div>
              <p className="text-xs text-muted-foreground">total percu</p>
            </CardContent>
          </Card>
        </div>
      )}

      {user.role === "TEACHER" && (
        <Card>
          <CardHeader>
            <CardTitle>Espace Enseignant</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Bienvenue dans votre espace enseignant. Utilisez le menu pour acceder
              a la saisie des notes et consulter vos classes.
            </p>
          </CardContent>
        </Card>
      )}

      {user.role === "STUDENT" && (
        <Card>
          <CardHeader>
            <CardTitle>Espace Eleve</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Bienvenue dans votre espace eleve. Consultez vos notes, bulletins
              et emploi du temps.
            </p>
          </CardContent>
        </Card>
      )}

      {user.role === "PARENT" && (
        <Card>
          <CardHeader>
            <CardTitle>Espace Parent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Bienvenue dans votre espace parent. Suivez les notes et bulletins
              de vos enfants.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
