import { PrismaAdapter } from "@auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import { env } from "@/env.mjs";
import { prisma } from "@/lib/db";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY as string);

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    EmailProvider({
      from: env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const result = await resend.emails.send({
          from: env.EMAIL_FROM,
          to: identifier,
          subject: "Sign in to your account",
          html: `<p>Click <a href="${url}">here</a> to sign in.</p>`,
        });
        const { data, error } = result;
        if (error) {
          throw new Error("Failed to send verification email");
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }: { token: any; session: any }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      const dbUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        if (user) {
          token.id = user.id;
        }
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
      };
    },
  },
};