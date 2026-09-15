export const DEFAULT_LOGIN_REDIRECT = "/dashboard"

// Only allow same-origin relative paths, so `?next=` can't be used as an open redirect.
export function getSafeRedirect(value: unknown) {
  if (typeof value !== "string") return DEFAULT_LOGIN_REDIRECT
  if (
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.startsWith("/\\")
  ) {
    return DEFAULT_LOGIN_REDIRECT
  }
  return value
}
