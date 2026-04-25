import { UserRole } from "@prisma/client";
import { User } from "next-auth";
import { JWT } from "next-auth/jwt";

export type ExtendedUser = User & {
  role: UserRole;
  // Team context is NOT stored in JWT/session — it's resolved per-request
  // via getCurrentTeam() in lib/session.ts using a signed cookie + DB lookup.
  // This avoids stale JWT data and enables real-time context repair.
};

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
  }
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
