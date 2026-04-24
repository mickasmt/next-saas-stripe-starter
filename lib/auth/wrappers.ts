import { auth } from "@/auth";

import { authorize } from "./engine";
import { TeamPermission } from "./types";

type ActionResult = { status: string; error?: string };

export function withTeamAuth<T extends unknown[], R extends ActionResult>(
  permission: TeamPermission,
  handler: (userId: string, teamId: string, ...args: T) => Promise<R>,
) {
  return async (teamId: string, ...args: T): Promise<R> => {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "error", error: "Unauthorized" } as R;
    }

    const result = await authorize(session.user.id, teamId, permission);
    if (!result.allowed) {
      return { status: "error", error: result.reason } as R;
    }

    return handler(session.user.id, teamId, ...args);
  };
}

export function withUserAuth<T extends unknown[], R extends ActionResult>(
  handler: (userId: string, ...args: T) => Promise<R>,
) {
  return async (...args: T): Promise<R> => {
    const session = await auth();
    if (!session?.user?.id) {
      return { status: "error", error: "Unauthorized" } as R;
    }

    return handler(session.user.id, ...args);
  };
}
