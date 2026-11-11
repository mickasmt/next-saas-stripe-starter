"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { ArrowUp, Sparkles, Square } from "lucide-react"
import { useState } from "react"

import { EmptyState } from "@/components/dashboard/empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const transport = new DefaultChatTransport({ api: "/api/assistant" })

export function AssistantChat({ model }: { model: string }) {
  const [input, setInput] = useState("")
  const { messages, sendMessage, status, stop, error } = useChat({ transport })
  const busy = status === "submitted" || status === "streaming"

  function submit(event: React.FormEvent) {
    event.preventDefault()
    const text = input.trim()
    if (!text || busy) return
    sendMessage({ text })
    setInput("")
  }

  return (
    <div className="flex flex-col gap-4">
      {messages.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="Ask anything"
          description={`Answers stream from ${model} through Neon AI Gateway.`}
        />
      ) : (
        <div className="flex flex-col gap-3 rounded-lg border bg-card p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "max-w-[85%] rounded-lg px-3 py-2 whitespace-pre-wrap",
                message.role === "user"
                  ? "self-end bg-primary text-primary-foreground"
                  : "self-start bg-muted"
              )}
            >
              {message.parts.map((part, index) =>
                part.type === "text" ? (
                  <span key={`${message.id}-${index}`}>{part.text}</span>
                ) : null
              )}
            </div>
          ))}
          {status === "submitted" && (
            <div className="self-start rounded-lg bg-muted px-3 py-2 text-muted-foreground">
              Thinking…
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-destructive">
          {error.message || "Something went wrong. Try again."}
        </p>
      )}

      <form onSubmit={submit} className="flex items-center gap-2">
        <Input
          value={input}
          maxLength={4000}
          placeholder="Message the assistant…"
          aria-label="Message"
          className="bg-card dark:bg-card"
          onChange={(event) => setInput(event.target.value)}
        />
        {busy ? (
          <Button
            type="button"
            size="icon"
            variant="outline"
            aria-label="Stop"
            onClick={() => stop()}
          >
            <Square />
          </Button>
        ) : (
          <Button
            type="submit"
            size="icon"
            aria-label="Send"
            disabled={!input.trim()}
          >
            <ArrowUp />
          </Button>
        )}
      </form>
    </div>
  )
}
