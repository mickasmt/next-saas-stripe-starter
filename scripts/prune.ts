// Deletes modules for good: their files, the code marked for them in shared
// files, their flag and their packages. Modules that depend on a pruned module
// are pruned too. Marker syntax is documented in AGENTS.md.
//
//   pnpm modules:prune blog changelog          prints what would change
//   pnpm modules:prune blog changelog --yes    applies it (needs a clean git tree)

import { execFileSync } from "node:child_process"
import {
  existsSync,
  readdirSync,
  readFileSync,
  rmdirSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import path from "node:path"

import {
  featureKeys,
  features,
  isFeatureKey,
  type FeatureKey,
} from "../config/features.ts"

const root = path.resolve(import.meta.dirname, "..")
const self = path.relative(root, import.meta.filename)

const MARKER_FILES =
  /\.(ts|tsx|mts|mjs|cjs|js|jsx|css|md|mdx|ya?ml)$|^\.env\.example$/
const MARKER =
  /(?:\/\/|\/\*|\{\/\*|<!--|#)\s*module:([\w-]+(?:,[\w-]+)*)(?:\s+(start|end))?/

class PruneError extends Error {}

type Edit = { file: string; before: string; after: string; removed: number }

function main() {
  const args = process.argv.slice(2)
  const apply = args.includes("--yes")
  const requested = args.filter((arg) => !arg.startsWith("--"))

  if (requested.length === 0) {
    throw new PruneError(
      `Usage: pnpm modules:prune <module...> [--yes]\nModules: ${featureKeys.join(", ")}`
    )
  }
  for (const key of requested) {
    if (!isFeatureKey(key)) {
      throw new PruneError(
        `Unknown module "${key}". Modules: ${featureKeys.join(", ")}`
      )
    }
  }

  const pruned = withDependents(requested as FeatureKey[])
  const kept = featureKeys.filter((key) => !pruned.has(key))

  checkDeclaredFiles()

  const keptFiles = new Set(kept.flatMap((key) => features[key].files ?? []))
  const deletedPaths = unique(
    [...pruned].flatMap((key) => features[key].files ?? [])
  ).filter((file) => !keptFiles.has(file))

  const keptPackages = new Set(
    kept.flatMap((key) => features[key].packages ?? [])
  )
  const removedPackages = unique(
    [...pruned].flatMap((key) => features[key].packages ?? [])
  ).filter((name) => !keptPackages.has(name))

  const isDeleted = (file: string) =>
    deletedPaths.some((p) => file === p || file.startsWith(`${p}/`))
  const remainingFiles = listFiles().filter((file) => !isDeleted(file))

  const edits: Edit[] = []
  for (const file of remainingFiles) {
    if (file === self || !MARKER_FILES.test(path.basename(file))) continue
    const before = readFileSync(path.join(root, file), "utf8")
    const { text, removed } = stripMarkers(file, before, pruned)
    if (text !== before) edits.push({ file, before, after: text, removed })
  }

  const packageEdit = removePackages(removedPackages)
  if (packageEdit) edits.push(packageEdit)

  const deadLinks = findDeadLinks(remainingFiles, edits, pruned)

  report({ pruned, deletedPaths, edits, removedPackages, deadLinks, apply })
  if (deadLinks.length > 0) process.exitCode = 1

  if (!apply) return

  const dirty = git(["status", "--porcelain"]).trim()
  if (dirty) {
    throw new PruneError(
      "The git tree has uncommitted changes. Commit or stash them first, so the prune can be reviewed and undone."
    )
  }

  for (const p of deletedPaths) {
    rmSync(path.join(root, p), { recursive: true, force: true })
    removeEmptyParents(path.dirname(path.join(root, p)))
  }
  for (const edit of edits) {
    writeFileSync(path.join(root, edit.file), edit.after)
  }
  formatFiles(edits.map((edit) => edit.file))

  console.log("\nDone. Next: pnpm install && pnpm typecheck && pnpm build")
}

// Adds every module that depends, directly or not, on a pruned module.
function withDependents(requested: FeatureKey[]) {
  const pruned = new Set(requested)
  let grew = true
  while (grew) {
    grew = false
    for (const key of featureKeys) {
      const deps: readonly FeatureKey[] = features[key].dependsOn ?? []
      if (!pruned.has(key) && deps.some((dep) => pruned.has(dep))) {
        pruned.add(key)
        grew = true
      }
    }
  }
  return pruned
}

// A module listing a path that no longer exists would silently leave its new
// location behind: fail instead.
function checkDeclaredFiles() {
  const missing = featureKeys.flatMap((key) =>
    (features[key].files ?? [])
      .filter((file) => !existsSync(path.join(root, file)))
      .map((file) => `  ${key}: ${file}`)
  )
  if (missing.length > 0) {
    throw new PruneError(
      `Files declared in config/features.ts do not exist:\n${missing.join("\n")}`
    )
  }
}

// Removes the lines of a marker whose modules are all pruned. A marker that
// still names a kept module stays, without the pruned names.
function stripMarkers(file: string, text: string, pruned: Set<FeatureKey>) {
  const lines = text.split("\n")
  const out: string[] = []
  const blocks: { modules: string; remove: boolean; line: number }[] = []
  let removed = 0

  lines.forEach((line, index) => {
    const match = MARKER.exec(line)
    const insideRemoved = blocks.some((block) => block.remove)

    if (!match) {
      if (insideRemoved) removed++
      else out.push(line)
      return
    }

    const [, list, kind] = match
    const modules = list.split(",")
    const where = `${file}:${index + 1}`
    for (const key of modules) {
      if (!isFeatureKey(key)) {
        throw new PruneError(`${where}: unknown module "${key}" in marker`)
      }
    }

    const remove = modules.every((key) => pruned.has(key as FeatureKey))
    const rest = modules.filter((key) => !pruned.has(key as FeatureKey))
    const rewritten = line.replace(`module:${list}`, `module:${rest.join(",")}`)

    if (kind === "start") {
      blocks.push({ modules: list, remove, line: index + 1 })
    } else if (kind === "end") {
      const block = blocks.pop()
      if (!block || block.modules !== list) {
        throw new PruneError(
          `${where}: "module:${list} end" has no matching start`
        )
      }
    }

    if (insideRemoved || remove) removed++
    else out.push(rewritten)
  })

  const open = blocks.at(-1)
  if (open) {
    throw new PruneError(
      `${file}:${open.line}: "module:${open.modules} start" is never closed`
    )
  }

  return { text: out.join("\n"), removed }
}

function removePackages(names: string[]): Edit | undefined {
  const file = "package.json"
  const before = readFileSync(path.join(root, file), "utf8")
  const pkg = JSON.parse(before)
  let removed = 0
  for (const field of ["dependencies", "devDependencies"]) {
    for (const name of names) {
      if (pkg[field]?.[name] !== undefined) {
        delete pkg[field][name]
        removed++
      }
    }
  }
  if (removed === 0) return undefined
  return { file, before, after: `${JSON.stringify(pkg, null, 2)}\n`, removed }
}

// Links to a pruned route still present after the prune, e.g. an unmarked
// `href="/blog"`. They don't break the build, only lead to a 404.
function findDeadLinks(
  files: string[],
  edits: Edit[],
  pruned: Set<FeatureKey>
) {
  const routes = [...pruned].flatMap((key) => features[key].routes ?? [])
  if (routes.length === 0) return []

  const pattern = new RegExp(
    `["'\`(](${routes.map(escapeRegExp).join("|")})(?=[/?#"'\`)])`
  )
  const edited = new Map(edits.map((edit) => [edit.file, edit.after]))

  return files.flatMap((file) => {
    if (file === self || !MARKER_FILES.test(path.basename(file))) return []
    const text = edited.get(file) ?? readFileSync(path.join(root, file), "utf8")
    return text
      .split("\n")
      .flatMap((line, index) =>
        pattern.test(line) ? [`${file}:${index + 1}  ${line.trim()}`] : []
      )
  })
}

function report({
  pruned,
  deletedPaths,
  edits,
  removedPackages,
  deadLinks,
  apply,
}: {
  pruned: Set<FeatureKey>
  deletedPaths: string[]
  edits: Edit[]
  removedPackages: string[]
  deadLinks: string[]
  apply: boolean
}) {
  console.log(`${apply ? "Pruning" : "Would prune"}: ${[...pruned].join(", ")}`)

  console.log("\nDelete:")
  for (const p of deletedPaths) console.log(`  ${p}`)

  console.log("\nEdit:")
  for (const edit of edits) {
    const change = edit.removed > 0 ? `-${edit.removed} lines` : "markers"
    console.log(`  ${edit.file} (${change})`)
  }

  if (removedPackages.length > 0) {
    console.log(`\nUninstall: ${removedPackages.join(", ")}`)
  }

  if (deadLinks.length > 0) {
    console.log("\nLinks to pruned routes (mark them or remove them):")
    for (const link of deadLinks) console.log(`  ${link}`)
  }

  if (!apply) console.log("\nNothing changed. Run again with --yes to apply.")
}

// Removed lines can leave blank lines or empty arrays behind.
function formatFiles(files: string[]) {
  const prettier = path.join(root, "node_modules/.bin/prettier")
  if (!existsSync(prettier)) return
  execFileSync(
    prettier,
    ["--write", "--ignore-unknown", "--log-level", "warn", ...files],
    { cwd: root, stdio: "inherit" }
  )
}

function listFiles() {
  return git(["ls-files", "-z", "--cached", "--others", "--exclude-standard"])
    .split("\0")
    .filter((file) => file && existsSync(path.join(root, file)))
}

function removeEmptyParents(dir: string) {
  while (dir.startsWith(`${root}${path.sep}`) && existsSync(dir)) {
    if (readdirSync(dir).length > 0) return
    rmdirSync(dir)
    dir = path.dirname(dir)
  }
}

function git(args: string[]) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" })
}

function unique<T>(values: T[]) {
  return [...new Set(values)]
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

try {
  main()
} catch (error) {
  if (!(error instanceof PruneError)) throw error
  console.error(error.message)
  process.exitCode = 1
}
