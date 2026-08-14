export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ status: "ok", service: "learner-frontend", timestamp: new Date().toISOString() });
}
