import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { TeamRole, UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

import { prisma } from "@/lib/db";
import { getPermissionsForRole } from "@/lib/permissions";
import { getTeamMembership } from "@/lib/team";
import { getUserById } from "@/lib/user";

// More info: https://authjs.dev/getting-started/typescript#module-augmentation
declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole;
      activeTeamId?: string;
      activeTeamRole?: TeamRole;
      activeTeamSlug?: string;
      teamPermissions?: string[];
    } & DefaultSession["user"];
  }
}

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    // error: "/auth/error",
  },
  callbacks: {
    async session({ token, session }) {
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }

        if (token.email) {
          session.user.email = token.email;
        }

        if (token.role) {
          session.user.role = token.role;
        }

        session.user.name = token.name;
        session.user.image = token.picture;
        session.user.activeTeamId = token.activeTeamId;
        session.user.activeTeamRole = token.activeTeamRole;
        session.user.activeTeamSlug = token.activeTeamSlug;
        session.user.teamPermissions = token.teamPermissions;
      }

      return session;
    },

    async jwt({ token, trigger }) {
      if (!token.sub) return token;

      const dbUser = await getUserById(token.sub);

      if (!dbUser) return token;

      token.name = dbUser.name;
      token.email = dbUser.email;
      token.picture = dbUser.image;
      token.role = dbUser.role;

      // Resolve team context on session update OR first login (when no team in token yet)
      if (trigger === "update" || !token.activeTeamId) {
        // If we have an active team, re-verify membership
        if (token.activeTeamId) {
          const membership = await getTeamMembership(
            token.sub,
            token.activeTeamId,
          );
          if (membership) {
            token.activeTeamRole = membership.role;
            token.activeTeamSlug = membership.team.slug;
            token.teamPermissions = getPermissionsForRole(membership.role);
          } else {
            token.activeTeamId = undefined;
            token.activeTeamRole = undefined;
            token.activeTeamSlug = undefined;
            token.teamPermissions = [];
          }
        }

        // If still no active team, hydrate with the user's first team
        if (!token.activeTeamId) {
          const firstMembership = await prisma.teamMember.findFirst({
            where: { userId: token.sub },
            include: { team: { select: { slug: true } } },
            orderBy: { createdAt: "asc" },
          });
          if (firstMembership) {
            token.activeTeamId = firstMembership.teamId;
            token.activeTeamRole = firstMembership.role;
            token.activeTeamSlug = firstMembership.team.slug;
            token.teamPermissions = getPermissionsForRole(
              firstMembership.role,
            );
          }
        }
      }

      return token;
    },
  },
  ...authConfig,
  // debug: process.env.NODE_ENV !== "production"
});
