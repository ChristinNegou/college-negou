import type { UserRole } from "@prisma/client";

export type SessionUser = {
  id: string;
  email: string;
  role: UserRole;
  supabaseId: string;
  profile: {
    firstName: string;
    lastName: string;
    photoUrl?: string | null;
  };
};

export type NavItem = {
  title: string;
  href: string;
  icon: string;
  badge?: string;
};

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { error: string };
