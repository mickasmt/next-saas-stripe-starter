type ApiOperation = {
  summary?: string;
  description?: string;
  operationId?: string;
  tags?: string[];
  security?: Array<Record<string, string[]>>;
  responses?: Record<string, unknown>;
};

type ApiSpec = {
  info: { title: string; version: string; description?: string };
  paths: Record<string, Partial<Record<string, ApiOperation>>>;
};

const methodStyles: Record<string, string> = {
  get: "bg-blue-500/15 text-blue-400",
  post: "bg-emerald-500/15 text-emerald-400",
  put: "bg-amber-500/15 text-amber-400",
  patch: "bg-violet-500/15 text-violet-400",
  delete: "bg-red-500/15 text-red-400",
};

export function ApiReference({ spec }: { spec: ApiSpec }) {
  const operations = Object.entries(spec.paths).flatMap(([path, methods]) =>
    Object.entries(methods)
      .filter(([method]) => method in methodStyles)
      .map(([method, operation]) => ({ path, method, operation: operation! })),
  );

  return (
    <main className="py-10">
      <div className="mb-10 space-y-3">
        <p className="text-sm font-semibold text-primary">Internal API reference</p>
        <h1 className="text-4xl font-bold tracking-tight">{spec.info.title}</h1>
        <p className="max-w-3xl text-muted-foreground">{spec.info.description}</p>
        <p className="text-sm text-muted-foreground">
          Contract version <code>{spec.info.version}</code> · Base path <code>/api/v1</code>
        </p>
      </div>

      <div className="space-y-5">
        {operations.map(({ path, method, operation }) => (
          <section
            className="rounded-xl border bg-card p-5 shadow-sm"
            key={`${method}-${path}`}
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className={`rounded px-2 py-1 font-mono text-xs font-bold uppercase ${methodStyles[method]}`}>
                {method}
              </span>
              <code className="text-sm font-semibold">/api/v1{path}</code>
              <span className="ml-auto text-xs text-muted-foreground">
                {operation.security?.length ? "Session required" : "Public"}
              </span>
            </div>
            <h2 className="mt-4 text-lg font-semibold">{operation.summary ?? operation.operationId}</h2>
            {operation.description ? (
              <p className="mt-2 text-sm text-muted-foreground">{operation.description}</p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span>{operation.tags?.join(", ") ?? "Uncategorised"}</span>
              <span aria-hidden="true">·</span>
              <span>Responses: {Object.keys(operation.responses ?? {}).join(", ")}</span>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
