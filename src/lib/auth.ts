import { getSessionUser } from "@/actions/auth.actions";
import type { UserRole } from "@prisma/client";
import type { SessionUser } from "@/types";

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export async function requireAuth(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    throw new AuthError("Vous devez etre connecte pour effectuer cette action.");
  }
  return user;
}

export async function authorize(roles: UserRole[]): Promise<SessionUser> {
  const user = await requireAuth();
  if (!roles.includes(user.role)) {
    throw new AuthError("Vous n'avez pas les permissions necessaires pour cette action.");
  }
  return user;
}
