import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/connexion");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="hidden w-64 md:block">
        <Sidebar role={user.role} />
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar user={user} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
