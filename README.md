# TWE Learning — Learner Frontend

The learner-facing web application for the TWE Learning LMS. It serves the public website, authentication screens, learner dashboard, pricing, lessons, assessments, submissions, cohort experiences, and certificate display.

This repository is presentation-only. The backend/admin application owns authentication, Prisma, PostgreSQL, authorization, payments, progression, certificates, and every authoritative business mutation.

## Repository role

| Concern | Owner |
| --- | --- |
| Marketing, documentation, and learner UI | This repository |
| Forms, UI preferences, and cached API data | This repository |
| REST API and OpenAPI contract | `next-shadcn-admin` |
| Authentication and shared-domain sessions | `next-shadcn-admin` |
| Prisma, migrations, and PostgreSQL | `next-shadcn-admin` |
| Paystack, RBAC, entitlements, and certificates | `next-shadcn-admin` |
| Curriculum source | `Software-Dev-2026` |

The authoritative architecture and OpenAPI documents live in `next-shadcn-admin/docs`. See [frontend documentation](docs/README.md) for the documentation boundary.

## Technology

- Next.js 16 and React 19
- TypeScript
- Tailwind CSS 4 and shadcn/ui
- Contentlayer for the retained marketing and documentation content
- Versioned `/api/v1` communication with the backend/admin application
- pnpm and Node.js 20.9 or newer

The frontend intentionally contains no Prisma client, database credentials, payment secrets, staff RBAC rules, or certificate-generation logic.

## Local development

1. Install Node.js 20.9+ and enable Corepack.
2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Copy `.env.example` to `.env.local` and set:

   ```dotenv
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
   GITHUB_OAUTH_TOKEN=your-development-token
   ```

4. Start the backend/admin application on port `3001`.
5. Start this application:

   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000).

Authentication requests include credentials so the backend can issue and read the shared parent-domain session cookie. Production origins and cookie domains must be configured together.

## Commands

```bash
pnpm dev        # local development server
pnpm build      # production build using webpack for Contentlayer compatibility
pnpm start      # start the production server
pnpm typecheck  # TypeScript validation
pnpm lint       # ESLint validation
```

The health endpoint is available at `/health`.

## Collaboration workflow

- Work from short-lived branches; do not push directly to `main`.
- The current architecture branch is `phase1/foundation`.
- Every feature has one primary implementer and one cross-reviewer.
- Cross-repository work merges in this order: backend and OpenAPI, generated client release, frontend integration, joint end-to-end review, then feature activation.
- Architecture, schema, authentication, OpenAPI, payments, RBAC, and certificate changes require the product owner's approval.
- Do not duplicate cross-system architecture in this repository.

The preserved pre-extraction Prisma upgrade is recorded on `recovery/frontend-prisma7-workspace`. Do not delete or rewrite that branch.

## Current implementation status

The Phase 1 foundation upgrades the app to the shared platform baseline, removes the starter-owned Prisma/Auth.js/Stripe boundary, introduces the LMS API session client, removes internal admin routes, and adds production container and health-check support. Learner domain screens and generated-client package consumption continue as subsequent cross-repository features.

## Deployment

The initial target is Vercel at `learn.<domain>`. A production multi-stage Dockerfile is included for later VPS deployment. Set `NEXT_PUBLIC_API_URL` to the backend/admin `/api/v1` origin during the build.

## Template attribution

This application was refactored from [mickasmt/next-saas-stripe-starter](https://github.com/mickasmt/next-saas-stripe-starter). The original author remains available through the repository's `upstream` remote and the existing license is preserved.
