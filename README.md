# SaaS Starter

An open-source, modular SaaS starter built with Next.js 16, Better Auth, Drizzle, Neon and Stripe. Everything you usually rebuild on day one — auth, organizations, subscriptions, an admin panel, docs, a blog and a changelog — is here, and every part of it can be switched off or deleted for good.

- **Modular**: each module is a flag in `config/features.ts`. Switch it off and its routes 404, its links disappear and its endpoints are refused. Delete it with one command.
- **Typed end to end**: TypeScript, Drizzle schema, Zod validation, server actions.
- **Ready to charge**: Stripe Checkout, customer portal, webhooks, plan prices read from Stripe.

Need onboarding, teams, seat-based billing and transactional emails? **[Get Pro](https://buy.polar.sh/polar_cl_P0l5APsd2ke0F23jE8JZXBCJv5xHbJzAHOMMN1g6u8k)** — $99 early bird until Oct 12 (then $149), one-time payment. See [Pro version](#pro-version).

## Stack

| Layer     | Choice                                                 |
| --------- | ------------------------------------------------------ |
| Framework | Next.js 16 (App Router, Turbopack)                     |
| Database  | Neon Postgres + Drizzle ORM                            |
| Auth      | Better Auth (Google, organizations)                    |
| Payments  | Stripe (Checkout, customer portal, webhooks)           |
| UI        | Tailwind CSS v4, shadcn/ui, Base UI                    |
| Content   | MDX with Fumadocs (docs, blog, changelog, legal pages) |

## Modules

- **`auth`** — Google sign-in and the dashboard: `/login`, `/register`, `/dashboard`. Requires Database and Auth. <!-- module:auth -->
- **`billing`** — subscriptions and customer portal: `/pricing`, `/dashboard/billing`. Depends on `auth`, requires Payments. <!-- module:billing -->
- **`admin`** — user management for platform admins: `/admin`. Depends on `auth`. <!-- module:admin -->
- **`docs`** — MDX documentation: `/docs`. <!-- module:docs -->
- **`blog`** — MDX articles with authors and categories: `/blog`. <!-- module:blog -->
- **`changelog`** — product updates on a single page: `/changelog`. <!-- module:changelog -->

A module stays off while a module it depends on is off, or while a service it requires misses its environment variables. In development, the flag button in the bottom-right corner shows the state of everything; in production, set `default: false` on the module in `config/features.ts` and rebuild.

Don't need a module at all?

```bash
pnpm modules:prune blog changelog
```

Without `--yes`, the command only prints what it would delete: routes, components, content, packages, plus any link left pointing at a removed route.

## Getting started

```bash
npx create-next-app my-saas --example "https://github.com/mickasmt/next-saas-stripe-starter"
cd my-saas
pnpm install
cp .env.example .env.local
```

Fill in what you need — nothing has to be complete on the first run, since a module stays off until its services are configured. Then apply the migrations and start the app:

```bash
pnpm db:migrate
pnpm dev
```

To test subscriptions locally, forward Stripe events in a second terminal:

```bash
stripe listen --forward-to localhost:3000/api/auth/stripe/webhook
```

The full setup — Stripe products and prices, Google OAuth, deployment — is documented in `/docs`, or in `content/docs`. <!-- module:docs -->

## Project structure

```
app/            Routes: (marketing), (auth), (app), (docs), api
components/     UI and feature components
config/         Site, features, foundation, navigation
content/        MDX: docs, blog, changelog, legal
lib/            Auth, database, content sources, feature resolution
modules/        Server logic of the feature modules
drizzle/        Migrations
```

## Scripts

| Command                                                   | What it does                  |
| --------------------------------------------------------- | ----------------------------- |
| `pnpm dev`                                                | Start the dev server          |
| `pnpm build`                                              | Production build              |
| `pnpm typecheck` / `pnpm lint` / `pnpm format`            | Types, linting, formatting    |
| `pnpm db:generate` / `pnpm db:migrate` / `pnpm db:studio` | Drizzle migrations and studio |
| `pnpm modules:prune <module...>`                          | Delete a module for good      |

## Metadata and SEO

Titles, descriptions, canonical URLs and social cards come from `lib/metadata.ts`; the site-wide card is generated in `app/opengraph-image.tsx`. `app/sitemap.ts` lists the public pages of the enabled modules, and `app/robots.ts` keeps the dashboard and API out of search results. Set `NEXT_PUBLIC_APP_URL` to your domain so every absolute URL is right.

## Pro version

A paid version adds what comes after launch — onboarding, transactional emails, team management and seat-based billing — on the same foundation. It isn't part of this repository; every "About Pro" link in the app points back to this section.

**[Get Pro](https://buy.polar.sh/polar_cl_P0l5APsd2ke0F23jE8JZXBCJv5xHbJzAHOMMN1g6u8k)** — $99 early bird until Oct 12 (then $149), one-time payment, no subscription.

<!-- TODO: replace with a short screen recording — onboarding, team members, emails — hosted on GitHub or linked to YouTube. -->

### What's included

- **Onboarding** — a guided, full-screen first-run flow with its own routes, saved and resumed per member.
- **Teams and roles** — invite by email, accept in one click, assign owner, admin or member. Every page and action checks the role.
- **Seat-based billing** — charge per member with Stripe. Seats follow invites and removals, prorations handled automatically.
- **Transactional emails** — welcome, magic link, team invite, receipt, trial ending: React Email templates sent through Resend.
- **Account security** — two-factor authentication and session revocation.
- **Admin panel** — real user management: roles, bans and logging in as a user.
- **Error monitoring** — Sentry wired for server and client errors.
- **SEO** — metadata, JSON-LD, sitemap and Open Graph images.
- **Installs like any other module** — Pro modules show up in the same dev panel and prune with the same command.

### Free vs Pro

| Feature                                  | Free | Pro |
| ---------------------------------------- | :--: | :-: |
| Modules, dev panel and prune command     |  ✅  | ✅  |
| Auth with organizations (Better Auth)    |  ✅  | ✅  |
| Stripe subscriptions and customer portal |  ✅  | ✅  |
| Admin panel                              |  ✅  | ✅  |
| Docs, blog and changelog                 |  ✅  | ✅  |
| Guided onboarding flow                   |  —   | ✅  |
| Team invitations, roles and permissions  |  —   | ✅  |
| Seat-based team billing                  |  —   | ✅  |
| Transactional email templates via Resend |  —   | ✅  |
| Error monitoring with Sentry             |  —   | ✅  |
| SEO: metadata, JSON-LD and sitemap       |  —   | ✅  |
| Private repository and lifetime updates  |  —   | ✅  |

### Pricing

**$99** early bird until Oct 12, then $149. One-time payment, no subscription. **[Get Pro](https://buy.polar.sh/polar_cl_P0l5APsd2ke0F23jE8JZXBCJv5xHbJzAHOMMN1g6u8k)**

The dashboard previews those features on locked pages: sample data, inert controls and an "About Pro" banner. When you ship your own product, delete `components/dashboard/pro`, the routes that use it and the `pro: true` nav items in `config/nav.ts`.

## License

MIT — see [LICENSE.md](LICENSE.md).
