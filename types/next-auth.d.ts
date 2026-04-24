import { TeamRole, UserRole } from "@prisma/client";
import { User } from "next-auth";
import { JWT } from "next-auth/jwt";

export type ExtendedUser = User & {
  role: UserRole;
  activeTeamId?: string;
  activeTeamRole?: TeamRole;
  activeTeamSlug?: string;
  teamPermissions?: string[];
};

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    activeTeamId?: string;
    activeTeamRole?: TeamRole;
    activeTeamSlug?: string;
    teamPermissions?: string[];
  }
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
