const MANAGER_ROLES = new Set(["owner", "admin"])

// Organization roles (member.role) can be a comma-separated list.
export function isOrganizationManager(role: string) {
  return role.split(",").some((r) => MANAGER_ROLES.has(r.trim()))
}
