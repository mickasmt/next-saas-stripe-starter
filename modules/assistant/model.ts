import "server-only"

import { neon } from "@neon/ai-sdk-provider"

// Any id from https://neon.com/models works: the provider routes it to the
// right gateway endpoint. Reads NEON_AI_GATEWAY_BASE_URL and
// NEON_AI_GATEWAY_TOKEN, written by `neon deploy` (see neon.ts).
export const ASSISTANT_MODEL = process.env.NEON_AI_MODEL || "gpt-5-mini"

export function assistantModel() {
  return neon(ASSISTANT_MODEL)
}

// Bounds on what a client can send in one request: the whole history is
// replayed on every turn, so an unbounded one gets expensive fast.
export const MAX_HISTORY = 20
export const MAX_MESSAGE_CHARS = 4000
