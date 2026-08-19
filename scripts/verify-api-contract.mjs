import { readFile } from "node:fs/promises";

const spec = JSON.parse(
  await readFile(new URL("../lib/api/generated/openapi.json", import.meta.url), "utf8"),
);
const versionSource = await readFile(
  new URL("../lib/api/generated/version.ts", import.meta.url),
  "utf8",
);

if (spec.info?.version !== "1.0.0") {
  throw new Error(`Expected OpenAPI 1.0.0, received ${spec.info?.version ?? "missing"}.`);
}

if (!versionSource.includes(`LMS_API_CONTRACT_VERSION = "${spec.info.version}"`)) {
  throw new Error("The generated contract snapshot and pinned client version differ.");
}

for (const path of ["/auth/password-login", "/auth/session", "/auth/logout"]) {
  if (!spec.paths?.[path]) throw new Error(`Required auth route ${path} is absent.`);
}

console.log(`Verified LMS API contract ${spec.info.version} and required auth routes.`);

