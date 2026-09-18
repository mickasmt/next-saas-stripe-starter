# SaaS Starter

An open-source, modular SaaS starter built with Next.js 16, Better Auth, Drizzle, Neon and Stripe. Everything you usually rebuild on day one — auth, organizations, subscriptions, an admin panel, docs, a blog and a changelog — is here, and every part of it can be switched off or deleted for good.

- **Modular**: each module is a flag in `config/features.ts`. Switch it off and its routes 404, its links disappear and its endpoints are refused. Delete it with one command.
- **Typed end to end**: TypeScript, Drizzle schema, Zod validation, server actions.
- **Ready to charge**: Stripe Checkout, customer portal, webhooks, plan prices read from Stripe.

## Stack

| Layer     | Choice                                                 |
| --------- | ------------------------------------------------------ |
| Framework | Next.js 16 (App Router, Turbopack)                     |
| Database  | Neon Postgres + Drizzle ORM                            |
| Auth      | Better Auth (email/password, Google, organizations)    |
| Payments  | Stripe (Checkout, customer portal, webhooks)           |
| UI        | Tailwind CSS v4, shadcn/ui, Base UI                    |
| Content   | MDX with Fumadocs (docs, blog, changelog, legal pages) |

## Modules

- **`auth`** — sign-in, sign-up and the dashboard: `/login`, `/register`, `/dashboard`. Requires Database and Auth. <!-- module:auth -->
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

A paid version adds what comes after launch — onboarding, transactional emails, team management and seat-based billing — on the same foundation. See the `/pro` page.

The dashboard previews those features on locked pages: sample data, inert controls and a "Get Pro" banner. When you ship your own product, delete `components/dashboard/pro`, the routes that use it and the `pro: true` nav items in `config/nav.ts`.

## License

MIT — see [LICENSE.md](LICENSE.md).
