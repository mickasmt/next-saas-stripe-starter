import { NextRequest, NextResponse } from "next/server";

import { getAuthContext } from "@/lib/session";

import { authorize } from "./engine";
import type { AuthContext, TeamPermission } from "./types";

type HandlerWithAuth = (
  context: AuthContext,
  req: NextRequest,
  params: Record<string, string>,
) => Promise<Response>;

function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export function withUserAuth(handler: HandlerWithAuth) {
  return async (req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => {
    const context = await getAuthContext();
    const decision = authorize(context, { scope: "user" });

    if (!decision.allowed) {
      return errorResponse(401, decision.code, decision.reason);
    }

    const params = await ctx.params;
    return handler(context!, req, params);
  };
}

export function withTeamAuth(permission: TeamPermission, handler: HandlerWithAuth) {
  return async (req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => {
    const context = await getAuthContext();
    const decision = authorize(context, { scope: "team", permission });

    if (!decision.allowed) {
      const status = decision.code === "UNAUTHENTICATED" ? 401 : 403;
      return errorResponse(status, decision.code, decision.reason);
    }

    const params = await ctx.params;

    // IDOR protection: if route has teamId param, validate it matches the session's active team
    if (params.teamId && context!.team!.teamId !== params.teamId) {
      return errorResponse(403, "TEAM_MISMATCH", "URL team does not match your active team context");
    }

    return handler(context!, req, params);
  };
}
