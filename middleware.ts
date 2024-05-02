import NextAuth, { Session } from "next-auth"
import { NextRequest } from 'next/server';

import authConfig from "./auth.config"
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

const { auth: middleware } = NextAuth(authConfig)

export default middleware((req: NextRequest & { auth: Session | null }): Response | void  => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.some(route => {
    if (route === "/") {
      return nextUrl.pathname === route;
    } else {
      return nextUrl.pathname.startsWith(route);
    }
  });

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) return;

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(new URL(
      `/login?callbackUrl=${encodedCallbackUrl}`,
      nextUrl
    ));
  }

  return;
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  // clerck matcher
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}