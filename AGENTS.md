<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Modules

Every module in `config/features.ts` can be deleted for good with `pnpm modules:prune <module...>`. Keep it working whenever you add code:

- Code used by a single module goes in a path listed in that module's `files`: a new page under its route folder, a component in its own folder. Add the path to `files` if it isn't covered yet.
- Code for a module inside a shared file gets a marker, removed with the module:
  - one line: a trailing `// module:<key>` comment;
  - a block: `// module:<key> start` and `// module:<key> end` on their own lines.
  - `module:<key>,<key>` is removed once all the listed modules are pruned.
  - Use `#` in `.env.example`, `{/* */}` in MDX.
- A package used only by modules goes in their `packages`.
- A new module declares its `files`, `packages` and `routes`.

Check with `pnpm modules:prune <module>`: without `--yes` it only prints what it would delete.
