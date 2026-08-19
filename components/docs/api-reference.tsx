import { DocsPageHeader } from "@/components/docs/page-header";
import { MdxCard } from "@/components/content/mdx-card";
import { Callout } from "@/components/shared/callout";

type Reference = { $ref?: string };

type Schema = Reference & {
  type?: string | string[];
  format?: string;
  const?: unknown;
  enum?: unknown[];
  example?: unknown;
  examples?: unknown[];
  properties?: Record<string, Schema>;
  required?: string[];
  items?: Schema;
  additionalProperties?: boolean | Schema;
  allOf?: Schema[];
  oneOf?: Schema[];
  anyOf?: Schema[];
};

type MediaType = {
  schema?: Schema;
  example?: unknown;
  examples?: Record<string, { value?: unknown }>;
};

type ApiResponse = Reference & {
  description?: string;
  content?: Record<string, MediaType>;
};

type ApiParameter = Reference & {
  name?: string;
  in?: string;
  required?: boolean;
  description?: string;
  schema?: Schema;
};

type ApiOperation = {
  summary?: string;
  description?: string;
  operationId?: string;
  tags?: string[];
  security?: Array<Record<string, string[]>>;
  parameters?: ApiParameter[];
  requestBody?: Reference & {
    required?: boolean;
    content?: Record<string, MediaType>;
  };
  responses?: Record<string, ApiResponse>;
};

type ApiSpec = {
  info: { title: string; version: string; description?: string };
  security?: Array<Record<string, string[]>>;
  paths: Record<string, Partial<Record<string, ApiOperation>>>;
  components?: {
    schemas?: Record<string, Schema>;
    responses?: Record<string, ApiResponse>;
    parameters?: Record<string, ApiParameter>;
  };
};

const methodStyles: Record<string, string> = {
  get: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  post: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  put: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  patch: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  delete: "bg-red-500/15 text-red-700 dark:text-red-300",
};

const errorCodes: Record<string, string> = {
  "400": "BAD_REQUEST",
  "401": "UNAUTHENTICATED",
  "403": "FORBIDDEN",
  "404": "NOT_FOUND",
  "409": "CONFLICT",
  "429": "RATE_LIMITED",
  "500": "INTERNAL_ERROR",
};

function referenceName(reference: string) {
  return reference.split("/").at(-1) ?? reference;
}

function resolveSchema(spec: ApiSpec, schema?: Schema): Schema | undefined {
  if (!schema?.$ref) return schema;
  return spec.components?.schemas?.[referenceName(schema.$ref)];
}

function resolveResponse(spec: ApiSpec, response: ApiResponse): ApiResponse {
  if (!response.$ref) return response;
  return spec.components?.responses?.[referenceName(response.$ref)] ?? response;
}

function resolveParameter(spec: ApiSpec, parameter: ApiParameter): ApiParameter {
  if (!parameter.$ref) return parameter;
  return spec.components?.parameters?.[referenceName(parameter.$ref)] ?? parameter;
}

function scalarExample(schema: Schema, propertyName?: string): unknown {
  if (schema.example !== undefined) return schema.example;
  if (schema.examples?.length) return schema.examples[0];
  if (schema.const !== undefined) return schema.const;
  if (schema.enum?.length) return schema.enum[0];

  const name = propertyName?.toLowerCase() ?? "";
  if (schema.format === "email" || name === "email") return "learner@example.com";
  if (schema.format === "date-time") return "2026-08-19T12:00:00.000Z";
  if (schema.format === "uri" || name.endsWith("url")) return "https://example.com/resource";
  if (name.includes("password")) return "correct-horse-battery-staple";
  if (name.includes("token")) return "opaque-verification-token-1234567890";
  if (name.includes("currency")) return "NGN";
  if (name.includes("amount")) return 2500000;
  if (name.endsWith("id") || name === "id") return `${propertyName ?? "resource"}_123`;
  if (name.includes("name")) return "Example learner";
  if (name.includes("title")) return "Example title";
  if (name.includes("slug")) return "software-development";

  const type = Array.isArray(schema.type)
    ? schema.type.find((value) => value !== "null")
    : schema.type;
  if (type === "boolean") return true;
  if (type === "integer") return 1;
  if (type === "number") return 80;
  return "string";
}

function schemaExample(
  spec: ApiSpec,
  input?: Schema,
  propertyName?: string,
  seen = new Set<string>(),
): unknown {
  if (!input) return {};
  if (input.$ref) {
    if (seen.has(input.$ref)) return {};
    const nextSeen = new Set(seen).add(input.$ref);
    return schemaExample(spec, resolveSchema(spec, input), propertyName, nextSeen);
  }
  if (input.oneOf?.length) {
    const candidate = input.oneOf.find((schema) => schema.type !== "null") ?? input.oneOf[0];
    return schemaExample(spec, candidate, propertyName, seen);
  }
  if (input.anyOf?.length) return schemaExample(spec, input.anyOf[0], propertyName, seen);
  if (input.allOf?.length) {
    return input.allOf.reduce<Record<string, unknown>>((result, schema) => {
      const value = schemaExample(spec, schema, propertyName, seen);
      return typeof value === "object" && value !== null && !Array.isArray(value)
        ? { ...result, ...value }
        : result;
    }, {});
  }
  if (input.properties) {
    return Object.fromEntries(
      Object.entries(input.properties).map(([name, schema]) => [
        name,
        schemaExample(spec, schema, name, seen),
      ]),
    );
  }
  const type = Array.isArray(input.type)
    ? input.type.find((value) => value !== "null")
    : input.type;
  if (type === "array") return [schemaExample(spec, input.items, propertyName, seen)];
  return scalarExample(input, propertyName);
}

function mediaExample(spec: ApiSpec, media?: MediaType) {
  if (media?.example !== undefined) return media.example;
  const namedExample = media?.examples && Object.values(media.examples)[0]?.value;
  return namedExample ?? schemaExample(spec, media?.schema);
}

function failureExample(status: string, description?: string) {
  return {
    error: {
      code: errorCodes[status] ?? "REQUEST_FAILED",
      message: description ?? "The request could not be completed.",
      ...(status === "400" ? { details: { field: "Explain the invalid value." } } : {}),
    },
    meta: {
      correlationId: "7d628735-8a1e-4f20-8e57-f6f708df42db",
      timestamp: "2026-08-19T12:00:00.000Z",
    },
  };
}

function CodeExample({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-zinc-950 text-zinc-100">
      <div className="border-b border-zinc-800 px-4 py-2 text-xs font-medium text-zinc-400">
        {label}
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-6">
        <code>{typeof value === "string" ? value : JSON.stringify(value, null, 2)}</code>
      </pre>
    </div>
  );
}

function ApiEndpoint({
  spec,
  path,
  method,
  operation,
}: {
  spec: ApiSpec;
  path: string;
  method: string;
  operation: ApiOperation;
}) {
  const parameters = (operation.parameters ?? []).map((parameter) =>
    resolveParameter(spec, parameter),
  );
  const requestBody = operation.requestBody?.content?.["application/json"];
  const requestExample = mediaExample(spec, requestBody);
  const responses = Object.entries(operation.responses ?? {}).map(([status, response]) => [
    status,
    resolveResponse(spec, response),
  ] as const);
  const successResponses = responses.filter(([status]) => status.startsWith("2"));
  const failureResponses = responses.filter(([status]) => !status.startsWith("2"));
  const requiresSession = operation.security
    ? operation.security.length > 0
    : Boolean(spec.security?.length);
  const idempotent = parameters.some((parameter) => parameter.name === "Idempotency-Key");
  const curl = [
    `curl --request ${method.toUpperCase()} 'https://admin.example.com/api/v1${path}'`,
    `  --header 'Accept: application/json'`,
    ...(requiresSession ? [`  --header 'Cookie: __Secure-lms.session=<session>'`] : []),
    ...(idempotent ? [`  --header 'Idempotency-Key: 7d628735-8a1e-4f20-8e57-f6f708df42db'`] : []),
    ...(requestBody
      ? [
          `  --header 'Content-Type: application/json'`,
          `  --data '${JSON.stringify(requestExample)}'`,
        ]
      : []),
  ].join(" \\\n");

  return (
    <MdxCard className="p-0 shadow-sm" id={operation.operationId}>
      <article className="space-y-6 p-5 sm:p-6">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`rounded px-2 py-1 font-mono text-xs font-bold uppercase ${methodStyles[method]}`}>
              {method}
            </span>
            <code className="break-all text-sm font-semibold">/api/v1{path}</code>
            <span className="ml-auto rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
              {requiresSession ? "Session required" : "Public"}
            </span>
          </div>
          <h3 className="mt-4 text-xl font-semibold">
            {operation.summary ?? operation.operationId}
          </h3>
          {operation.description ? (
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{operation.description}</p>
          ) : null}
          <p className="mt-2 text-xs text-muted-foreground">
            Operation ID: <code>{operation.operationId ?? "Not assigned"}</code>
          </p>
        </div>

        {parameters.length ? (
          <div>
            <h4 className="mb-3 text-sm font-semibold">Parameters and headers</h4>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/60 text-xs text-muted-foreground">
                  <tr><th className="px-3 py-2">Name</th><th className="px-3 py-2">Location</th><th className="px-3 py-2">Required</th><th className="px-3 py-2">Description</th></tr>
                </thead>
                <tbody className="divide-y">
                  {parameters.map((parameter) => (
                    <tr key={`${parameter.in}-${parameter.name}`}>
                      <td className="px-3 py-2 font-mono text-xs">{parameter.name}</td>
                      <td className="px-3 py-2">{parameter.in}</td>
                      <td className="px-3 py-2">{parameter.required ? "Yes" : "No"}</td>
                      <td className="px-3 py-2 text-muted-foreground">{parameter.description ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        <section className="space-y-3">
          <h4 className="text-sm font-semibold">Example request</h4>
          <div className={requestBody ? "grid gap-3 xl:grid-cols-2" : undefined}>
            <CodeExample label="cURL" value={curl} />
            {requestBody ? (
              <CodeExample
                label={operation.requestBody?.required ? "Required JSON body" : "JSON body"}
                value={requestExample}
              />
            ) : null}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold">Expected responses</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Success and failure bodies use the common API envelope and always include request metadata.
            </p>
          </div>
          <div className="space-y-4">
            {successResponses.map(([status, response]) => (
              <div key={status} className="space-y-2">
                <p className="text-sm"><span className="font-semibold text-emerald-600">{status} success</span> — {response.description}</p>
                <CodeExample
                  label={`Expected ${status} response`}
                  value={mediaExample(spec, response.content?.["application/json"])}
                />
              </div>
            ))}
            {failureResponses.map(([status, response]) => (
              <div key={status} className="space-y-2">
                <p className="text-sm"><span className="font-semibold text-red-600">{status} failure</span> — {response.description}</p>
                <CodeExample label={`Expected ${status} response`} value={failureExample(status, response.description)} />
              </div>
            ))}
          </div>
        </section>
      </article>
    </MdxCard>
  );
}

export function ApiReference({ spec }: { spec: ApiSpec }) {
  const operations = Object.entries(spec.paths).flatMap(([path, methods]) =>
    Object.entries(methods)
      .filter(([method]) => method in methodStyles)
      .map(([method, operation]) => ({ path, method, operation: operation! })),
  );
  const groups = Map.groupBy(operations, ({ operation }) => operation.tags?.[0] ?? "Other");

  return (
    <main className="relative py-6 lg:py-8">
      <DocsPageHeader heading="LMS API Reference" text={spec.info.description} />
      <div className="mt-8 space-y-10">
        <Callout type="info" twClass="mt-0">
          Examples are generated from OpenAPI {spec.info.version}. Replace placeholder IDs and tokens,
          send browser credentials with every authenticated request, and use the returned correlation ID
          when reporting a failed request.
        </Callout>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from(groups.entries()).map(([tag, endpoints]) => (
            <MdxCard href={`#${tag.toLowerCase().replaceAll(" ", "-")}`} key={tag}>
              <h3>{tag}</h3>
              <p>{endpoints.length} documented endpoint{endpoints.length === 1 ? "" : "s"}</p>
            </MdxCard>
          ))}
        </div>

        {Array.from(groups.entries()).map(([tag, endpoints]) => (
          <section className="scroll-mt-20 space-y-5" id={tag.toLowerCase().replaceAll(" ", "-")} key={tag}>
            <div className="border-b pb-3">
              <h2 className="text-2xl font-semibold tracking-tight">{tag}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Requests, required parameters, and expected success and failure envelopes.
              </p>
            </div>
            {endpoints.map(({ path, method, operation }) => (
              <ApiEndpoint
                key={`${method}-${path}`}
                spec={spec}
                path={path}
                method={method}
                operation={operation}
              />
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}
