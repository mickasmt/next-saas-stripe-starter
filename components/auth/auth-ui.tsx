"use client"

import { Loader2 } from "lucide-react"
import { useState } from "react"

import { GoogleIcon } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth/client"
import { cn } from "@/lib/utils"

export function AuthField({
  id,
  label,
  className,
  ...props
}: React.ComponentProps<typeof Input> & { id: string; label: string }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} className={cn("h-10", className)} {...props} />
    </div>
  )
}

export function SubmitButton({
  pending,
  children,
  ...props
}: React.ComponentProps<typeof Button> & { pending?: boolean }) {
  return (
    <Button
      type="submit"
      size="lg"
      className="h-10 w-full"
      disabled={pending}
      {...props}
    >
      {pending && <Loader2 className="animate-spin" />}
      {children}
    </Button>
  )
}

export function AuthDivider({
  children = "OR",
}: {
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <span className="h-px flex-1 bg-border" />
      {children}
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}

export function FormError({ message }: { message?: string | null }) {
  if (!message) return null
  return (
    <p
      role="alert"
      className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive"
    >
      {message}
    </p>
  )
}

export function GoogleButton({
  redirectTo,
  onError,
}: {
  redirectTo: string
  onError: (message: string) => void
}) {
  const [pending, setPending] = useState(false)

  async function signInWithGoogle() {
    setPending(true)
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: redirectTo,
      errorCallbackURL: "/login?error=oauth",
    })
    // On success the browser is already navigating to Google.
    if (error) {
      setPending(false)
      onError(error.message ?? "Unable to continue with Google.")
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="h-10 w-full"
      disabled={pending}
      onClick={signInWithGoogle}
    >
      {pending ? <Loader2 className="animate-spin" /> : <GoogleIcon />}
      Continue with Google
    </Button>
  )
}
