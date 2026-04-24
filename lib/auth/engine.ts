import type { AuthContext, AuthDecision, TeamPermission } from "./types";
import { hasPermission } from "./permissions";

interface AuthRequirement {
  scope: "user" | "team";
  permission?: TeamPermission;
}

export function authorize(
  context: AuthContext | null,
  requirement: AuthRequirement,
): AuthDecision {
  if (!context) {
    return { allowed: false, reason: "Not authenticated", code: "UNAUTHENTICATED" };
  }

  if (requirement.scope === "user") {
    return { allowed: true };
  }

  // Team-scoped checks
  if (!context.team) {
    return { allowed: false, reason: "No active team", code: "NO_TEAM" };
  }

  if (requirement.permission && !hasPermission(context.team.role, requirement.permission)) {
    return { allowed: false, reason: "Insufficient permissions", code: "FORBIDDEN" };
  }

  return { allowed: true };
}
