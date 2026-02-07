"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Megaphone, Calendar, School, BookOpen, Clock,
  Users, GraduationCap, UserCheck, ClipboardList, FileText, FileBarChart,
  Banknote, CreditCard, Newspaper, CalendarDays, Image, UserPlus,
  PenLine,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { navigationByRole } from "@/config/dashboard";
import type { UserRole } from "@prisma/client";
import { SCHOOL_SHORT_NAME } from "@/config/cameroon-education";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Megaphone, Calendar, School, BookOpen, Clock,
  Users, GraduationCap, UserCheck, ClipboardList, FileText, FileBarChart,
  Banknote, CreditCard, Newspaper, CalendarDays, Image, UserPlus,
  PenLine,
};

interface SidebarProps {
  role: UserRole;
  onNavigate?: () => void;
}

export function Sidebar({ role, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const sections = navigationByRole[role];

  return (
    <div className="flex h-full flex-col border-r bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
          {SCHOOL_SHORT_NAME}
        </div>
        <span className="font-semibold text-sidebar-foreground">
          College Negou
        </span>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-6">
          {sections.map((section) => (
            <div key={section.label}>
              <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {section.label}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = iconMap[item.icon];
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" &&
                      pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                      )}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}
