import type { UserRole } from "@prisma/client";

export type NavItem = {
  title: string;
  href: string;
  icon: string;
  badge?: string;
};

export type NavSection = {
  label: string;
  items: NavItem[];
};

const adminNav: NavSection[] = [
  {
    label: "General",
    items: [
      { title: "Tableau de bord", href: "/dashboard", icon: "LayoutDashboard" },
      { title: "Annonces", href: "/dashboard/annonces", icon: "Megaphone" },
    ],
  },
  {
    label: "Gestion Academique",
    items: [
      { title: "Annees scolaires", href: "/dashboard/annees", icon: "Calendar" },
      { title: "Classes", href: "/dashboard/classes", icon: "School" },
      { title: "Matieres", href: "/dashboard/matieres", icon: "BookOpen" },
      { title: "Emploi du temps", href: "/dashboard/emploi-du-temps", icon: "Clock" },
    ],
  },
  {
    label: "Personnes",
    items: [
      { title: "Eleves", href: "/dashboard/eleves", icon: "Users" },
      { title: "Enseignants", href: "/dashboard/enseignants", icon: "GraduationCap" },
      { title: "Parents", href: "/dashboard/parents", icon: "UserCheck" },
      { title: "Inscriptions", href: "/dashboard/inscriptions", icon: "ClipboardList" },
    ],
  },
  {
    label: "Notes & Bulletins",
    items: [
      { title: "Notes", href: "/dashboard/notes", icon: "FileText" },
      { title: "Bulletins", href: "/dashboard/bulletins", icon: "FileBarChart" },
    ],
  },
  {
    label: "Finances",
    items: [
      { title: "Frais scolaires", href: "/dashboard/frais", icon: "Banknote" },
      { title: "Paiements", href: "/dashboard/paiements", icon: "CreditCard" },
    ],
  },
  {
    label: "Contenu",
    items: [
      { title: "Actualites", href: "/dashboard/actualites", icon: "Newspaper" },
      { title: "Evenements", href: "/dashboard/evenements", icon: "CalendarDays" },
      { title: "Galerie", href: "/dashboard/galerie", icon: "Image" },
      { title: "Images du site", href: "/dashboard/images-site", icon: "ImagePlus" },
      { title: "Preinscriptions", href: "/dashboard/preinscriptions", icon: "UserPlus" },
    ],
  },
];

const teacherNav: NavSection[] = [
  {
    label: "General",
    items: [
      { title: "Tableau de bord", href: "/dashboard", icon: "LayoutDashboard" },
      { title: "Annonces", href: "/dashboard/annonces", icon: "Megaphone" },
    ],
  },
  {
    label: "Enseignement",
    items: [
      { title: "Mes classes", href: "/dashboard/mes-classes", icon: "School" },
      { title: "Saisie des notes", href: "/dashboard/saisie-notes", icon: "PenLine" },
      { title: "Emploi du temps", href: "/dashboard/emploi-du-temps", icon: "Clock" },
    ],
  },
];

const studentNav: NavSection[] = [
  {
    label: "General",
    items: [
      { title: "Tableau de bord", href: "/dashboard", icon: "LayoutDashboard" },
      { title: "Annonces", href: "/dashboard/annonces", icon: "Megaphone" },
    ],
  },
  {
    label: "Scolarite",
    items: [
      { title: "Mes notes", href: "/dashboard/mes-notes", icon: "FileText" },
      { title: "Mes bulletins", href: "/dashboard/mes-bulletins", icon: "FileBarChart" },
      { title: "Emploi du temps", href: "/dashboard/emploi-du-temps", icon: "Clock" },
    ],
  },
  {
    label: "Finances",
    items: [
      { title: "Mes paiements", href: "/dashboard/mes-paiements", icon: "CreditCard" },
    ],
  },
];

const parentNav: NavSection[] = [
  {
    label: "General",
    items: [
      { title: "Tableau de bord", href: "/dashboard", icon: "LayoutDashboard" },
      { title: "Annonces", href: "/dashboard/annonces", icon: "Megaphone" },
    ],
  },
  {
    label: "Suivi Enfants",
    items: [
      { title: "Notes des enfants", href: "/dashboard/notes-enfants", icon: "FileText" },
      { title: "Bulletins", href: "/dashboard/bulletins-enfants", icon: "FileBarChart" },
    ],
  },
  {
    label: "Finances",
    items: [
      { title: "Paiements", href: "/dashboard/paiements-enfants", icon: "CreditCard" },
    ],
  },
];

export const navigationByRole: Record<UserRole, NavSection[]> = {
  ADMIN: adminNav,
  TEACHER: teacherNav,
  STUDENT: studentNav,
  PARENT: parentNav,
};

export const roleBadgeColors: Record<UserRole, string> = {
  ADMIN: "bg-red-100 text-red-800",
  TEACHER: "bg-blue-100 text-blue-800",
  STUDENT: "bg-green-100 text-green-800",
  PARENT: "bg-purple-100 text-purple-800",
};

export const roleLabels: Record<UserRole, string> = {
  ADMIN: "Administrateur",
  TEACHER: "Enseignant",
  STUDENT: "Eleve",
  PARENT: "Parent",
};
