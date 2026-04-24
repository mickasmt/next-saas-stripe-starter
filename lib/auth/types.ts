import { TeamRole } from "@prisma/client";

export type TeamPermission =
  | "team:read"
  | "team:write"
  | "team:settings:update"
  | "team:members:invite"
  | "team:members:manage"
  | "team:members:remove"
  | "team:billing:manage"
  | "team:delete";

export type AuthContext = {
  userId: string;
  teamId: string;
  teamRole: TeamRole;
};

export type AuthResult = {
  allowed: boolean;
  reason?: string;
};
