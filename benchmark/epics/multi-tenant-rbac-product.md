# Product Review Rubric: Multi-Tenant RBAC System

## Reviewer Persona
You are a **Product Owner** evaluating whether this feature is shippable to real users. You care about user experience, edge cases users will actually hit, business logic completeness, and whether a PM would approve this for release — not implementation details like schema field names or API response formats.

## Acceptance Criteria

### PC-1: First-Time Team Experience
- A new user who has never created a team sees a clear path to create one (CTA, empty state, onboarding prompt)
- Team creation is simple — name is the only required field, slug auto-generates
- After creating a team, the user is immediately in that team's context (no extra clicks)
- The experience doesn't feel bolted on — it integrates naturally with the existing dashboard

### PC-2: Invite Flow Feels Complete
- Inviting a team member by email is straightforward — enter email, pick a role, send
- The invited person receives clear communication about what they're being invited to
- If the invitee doesn't have an account yet, the flow still works after they sign up (token persists)
- Inviting someone who is already a team member is handled gracefully (error message, not a crash)
- The inviter can see pending invites and cancel them
- There's a way to resend an invite if the recipient didn't see it

### PC-3: Role Boundaries Make Sense to Users
- The role hierarchy is intuitive — users can understand what each role can and can't do without reading docs
- Permission boundaries are visible in the UI (buttons hidden/disabled, not just server-side 403s)
- A Member can't accidentally stumble into admin-only actions
- Role names match user expectations (not internal jargon)

### PC-4: Team Switching is Seamless
- Users who belong to multiple teams can switch between them without logging out
- Switching teams is fast and obvious — the current team is always visible
- Context changes immediately — navigation, data, and permissions reflect the new team
- The user's "last active team" is remembered across sessions

### PC-5: Ownership Transfer and Team Lifecycle
- There's a path to transfer ownership (what happens when the owner leaves the company?)
- Deleting a team has a confirmation step — this is a destructive, irreversible action
- Users understand what happens to their data when they leave a team
- A team can't be left in an ownerless state — the system prevents it

### PC-6: Error States and Edge Cases
- What does the user see when they try to join an expired invite? (Clear message, not a 500)
- What happens when the last admin tries to leave? (Prevented with explanation)
- What if someone is invited to a team they're already on? (Handled, not a crash)
- What if the team slug conflicts with an existing one? (Validation before save)
- Network errors during invite/role-change show user-friendly messages

### PC-7: Team Settings are Manageable
- The team settings page shows a complete picture — members, their roles, pending invites
- Admins can manage the team without needing to ask the owner (within their permission scope)
- The settings page works on mobile — responsive layout, not just desktop
- Bulk actions aren't needed for v1, but individual member management is fast and clear

### PC-8: Security Without Friction
- Users can't access teams they don't belong to (no URL guessing)
- Changing someone's role requires appropriate permissions but isn't buried in menus
- Removing a team member is possible but has appropriate friction (confirmation)
- Invite tokens can't be reused after acceptance
- Sensitive actions (delete team, remove member, change role) have audit visibility

### PC-9: Backward Compatibility
- Users who don't use teams have the exact same experience as before — nothing breaks
- The feature is additive — existing users don't see team UI unless they opt in
- Auth still works for users without any team membership
- No forced migration or onboarding interruption for existing users

### PC-10: Collaboration Readiness
- The foundation supports real collaboration — shared context within a team
- Team membership implies shared access to team-scoped resources (not just a roster)
- The data model can grow — adding team-scoped features later doesn't require rearchitecting
- There's consideration for what "team-scoped" means for existing features (dashboard, billing, settings)

## Evaluation Notes
- PASS = the user flow works end-to-end and handles obvious edge cases
- PARTIAL = the happy path works but edge cases or UX polish are missing
- FAIL = the flow is broken, missing, or would confuse a real user
- Evaluate from a "would I ship this to customers?" perspective, not "is the code correct?"
- If something is technically implemented but the UX is confusing or incomplete, that's PARTIAL at best
