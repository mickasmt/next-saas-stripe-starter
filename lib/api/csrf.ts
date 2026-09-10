"use client";

// Mirrors next-shadcn-admin's src/lib/auth/csrf-client.ts. The backend issues
// this as a non-HttpOnly cookie scoped to the shared parent domain so both
// learn.* and admin.* can read it; the value itself carries no authority; it
// only proves the request came from script that could read a same-site
// cookie, not a cross-site form/link.
const CSRF_HEADER_NAME = "x-csrf-token";

function csrfCookieName() {
  const isSecureContext = typeof window !== "undefined" && window.location.protocol === "https:";
  return isSecureContext ? "__Secure-twe.csrf-token" : "twe.csrf-token";
}

export function getCsrfHeaders(): Record<string, string> {
  if (typeof document === "undefined") return {};
  const name = csrfCookieName();
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  const token = match ? decodeURIComponent(match[1]) : null;
  return token ? { [CSRF_HEADER_NAME]: token } : {};
}
