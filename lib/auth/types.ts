import { TeamRole, UserRole } from "@prisma/client";

export type TeamPermission =
  | "team:read"
  | "team:write"
  | "team:settings:update"
  | "team:members:invite"
  | "team:members:manage"
  | "team:members:remove"
  | "team:billing:manage"
  | "team:delete";

export interface AuthContext {
  userId: string;
  globalRole: UserRole;
  team: {
    teamId: string;
    role: TeamRole;
  } | null;
}

export type AuthDecision =
  | { allowed: true }
  | { allowed: false; reason: string; code: "UNAUTHENTICATED" | "NO_TEAM" | "NOT_MEMBER" | "FORBIDDEN" };
