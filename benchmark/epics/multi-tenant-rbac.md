# Epic: Multi-Tenant RBAC System

## Overview
A complete multi-tenant team management system with role-based access control. Users can create teams, invite members by email, assign roles (Owner, Admin, Member, Viewer), and permissions gate access to features, UI components, and API routes. This is a cross-cutting feature touching database, auth, API, middleware, and UI layers.

## Acceptance Criteria

### AC-1: Database Schema — Team & Membership Models
- New Prisma models: `Team`, `TeamMember`, `Role`, `Permission`, `TeamInvite`
- `Team` has `id`, `name`, `slug` (unique), `createdAt`, `updatedAt`, `ownerId` (FK → User)
- `TeamMember` is a join table: `userId` + `teamId` + `roleId`, with unique constraint on `(userId, teamId)`
- `Role` has `id`, `name` (Owner/Admin/Member/Viewer), `teamId` (nullable — null means system-default role)
- `Permission` is a join: `roleId` + `action` (string enum: `team:manage`, `members:invite`, `members:remove`, `billing:manage`, `content:edit`, `content:view`, `analytics:view`)
- `TeamInvite` has `id`, `email`, `teamId`, `roleId`, `token` (unique), `expiresAt`, `status` (pending/accepted/expired)
- Proper cascading deletes: deleting a Team removes all TeamMembers, Roles, Invites
- A migration file is generated (`npx prisma migrate dev`)

### AC-2: Auth Session Extension
- Auth.js session callback populates `session.user.activeTeamId` and `session.user.teamRole`
- JWT token includes `activeTeamId` and `teamPermissions` array
- `types/next-auth.d.ts` is extended with the new session fields
- A user with no team still gets a valid session (graceful degradation)
- Switching active team updates the session (via server action or API call)

### AC-3: Middleware Permission Guard
- New middleware utility `lib/permissions.ts` exports `withPermission(action: string)` wrapper
- Protected API routes and server actions can wrap with `withPermission("members:invite")` to gate access
- Returns 403 with JSON `{ error: "Insufficient permissions" }` if user lacks the permission on their active team
- Falls back to existing auth check if no team context (backwards compatible)

### AC-4: Team CRUD API Routes
- `POST /api/teams` — Create team (any authenticated user). Auto-assigns creator as Owner.
- `GET /api/teams` — List teams for authenticated user (only teams they're a member of)
- `GET /api/teams/[teamId]` — Get team details (members only)
- `PATCH /api/teams/[teamId]` — Update team name/slug (Owner/Admin only)
- `DELETE /api/teams/[teamId]` — Delete team (Owner only). Cascades all data.
- All routes validate auth + team membership + role permissions

### AC-5: Member Invite Flow
- `POST /api/teams/[teamId]/invites` — Create invite (requires `members:invite` permission). Accepts `{ email, roleId }`. Generates unique token. Sets 7-day expiry.
- `GET /api/teams/[teamId]/invites` — List pending invites (Admin+ only)
- `DELETE /api/teams/[teamId]/invites/[inviteId]` — Cancel invite (Admin+ only)
- `POST /api/teams/join/[token]` — Accept invite. Creates TeamMember, sets invite status to `accepted`. If user doesn't have an account, they must register first, then the token still works.
- Owner role cannot be assigned via invite (only via transfer)

### AC-6: Member Management
- `GET /api/teams/[teamId]/members` — List members with roles (any team member)
- `PATCH /api/teams/[teamId]/members/[memberId]` — Update member role (Admin+ only, cannot change Owner)
- `DELETE /api/teams/[teamId]/members/[memberId]` — Remove member (Admin+ only, cannot remove Owner). Members can remove themselves (leave team).
- Validation: team must always have exactly one Owner

### AC-7: Team Settings UI Page
- New route: `/dashboard/team` or `/dashboard/settings/team`
- Shows: team name, slug, member list with roles, pending invites
- "Invite Member" form: email input + role selector dropdown
- Member list: each row shows name, email, role, with "Change Role" dropdown and "Remove" button (permission-gated)
- Pending invites list: email, role, expiry, "Cancel" button
- Uses existing Shadcn/ui components (Card, Table, Button, Input, Select, Dialog)
- Responsive layout matching existing dashboard pages

### AC-8: Permission-Gated UI Components
- New component `<RequirePermission action="members:invite">` that conditionally renders children based on active team permissions
- Sidebar navigation shows/hides "Team" link based on team membership
- "Invite" and "Remove" buttons only render if user has the required permission
- Non-member users see a "Create or Join a Team" CTA instead of team settings

### AC-9: Team Switcher
- If a user belongs to multiple teams, a team switcher appears in the dashboard sidebar (above or replacing the existing project-switcher)
- Switching teams updates `activeTeamId` in the session and refreshes permission-gated UI
- Uses existing Shadcn/ui Popover + Command pattern (similar to project-switcher)

### AC-10: Audit Log
- New model `AuditLog`: `id`, `teamId`, `userId`, `action` (string), `targetType`, `targetId`, `metadata` (JSON), `createdAt`
- Key actions logged: member invited, member removed, role changed, team updated, team deleted
- `GET /api/teams/[teamId]/audit-log` — paginated list (Admin+ only)
- No UI required for v1 — API-only is sufficient

## Evaluation Notes
- All acceptance criteria are evaluated against the PR diff
- PASS = fully implemented and functional
- PARTIAL = partially implemented (e.g., model exists but missing fields, route exists but no auth check)
- FAIL = not implemented or fundamentally broken
- The implementation should follow existing codebase patterns (server actions, Prisma, Auth.js v5, Shadcn/ui)
