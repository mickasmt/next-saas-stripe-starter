import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  safeValidateUIMessages,
  streamText,
  toUIMessageStream,
} from "ai"
import { eq } from "drizzle-orm"

import { siteConfig } from "@/config/site"
import { getSession } from "@/lib/auth/session"
import { db } from "@/lib/db"
import { organization } from "@/lib/db/schema"
import { isFeatureEnabled } from "@/lib/features/resolve"
import {
  assistantModel,
  MAX_HISTORY,
  MAX_MESSAGE_CHARS,
} from "@/modules/assistant/model"

function error(message: string, status: number) {
  return Response.json({ error: message }, { status })
}

export async function POST(request: Request) {
  if (!(await isFeatureEnabled("assistant"))) return error("Not found", 404)

  const session = await getSession()
  if (!session) return error("Sign in to use the assistant.", 401)

  const body = await request.json().catch(() => null)
  const parsed = await safeValidateUIMessages({ messages: body?.messages })
  if (!parsed.success) return error("Invalid messages.", 400)

  const messages = parsed.data.slice(-MAX_HISTORY)
  const tooLong = messages.some((message) =>
    message.parts.some(
      (part) => part.type === "text" && part.text.length > MAX_MESSAGE_CHARS
    )
  )
  if (tooLong) {
    return error(`Keep messages under ${MAX_MESSAGE_CHARS} characters.`, 400)
  }

  const organizationId = session.session.activeOrganizationId
  const [workspace] = organizationId
    ? await db
        .select({ name: organization.name })
        .from(organization)
        .where(eq(organization.id, organizationId))
        .limit(1)
    : []

  const result = streamText({
    model: assistantModel(),
    system: [
      `You are the in-app assistant of ${siteConfig.name}.`,
      `You are talking to ${session.user.name}` +
        (workspace
          ? `, a member of the "${workspace.name}" organization.`
          : "."),
      "Be concise and answer in Markdown-free plain text.",
    ].join(" "),
    messages: await convertToModelMessages(messages),
    abortSignal: request.signal,
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      // Gateway errors can include request details: log them, show a generic one.
      onError: (cause) => {
        console.error("[assistant] generation failed", cause)
        return "The assistant couldn't answer. Try again in a moment."
      },
    }),
  })
}
