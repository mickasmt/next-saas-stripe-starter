"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import {
  AuthDivider,
  AuthField,
  FormError,
  GoogleButton,
  SubmitButton,
} from "@/components/auth/auth-ui"
import { authClient } from "@/lib/auth/client"

export function LoginForm({
  redirectTo,
  googleEnabled,
  initialError,
}: {
  redirectTo: string
  googleEnabled: boolean
  initialError?: string | null
}) {
  const router = useRouter()
  const [step, setStep] = useState<"email" | "password">("email")
  const [email, setEmail] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(initialError ?? null)
  const passwordRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (step === "password") passwordRef.current?.focus()
  }, [step])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (step === "email") {
      setStep("password")
      return
    }

    const password = String(new FormData(event.currentTarget).get("password"))

    setPending(true)
    const { error } = await authClient.signIn.email({ email, password })

    if (error) {
      setPending(false)
      setError(error.message ?? "Unable to log in.")
      return
    }

    router.replace(redirectTo)
    router.refresh()
  }

  return (
    <div className="grid gap-5">
      <form onSubmit={onSubmit} className="grid gap-4">
        <AuthField
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="you@company.com"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        {step === "password" && (
          <AuthField
            id="password"
            name="password"
            type="password"
            label="Password"
            autoComplete="current-password"
            ref={passwordRef}
            required
          />
        )}

        <FormError message={error} />

        <SubmitButton pending={pending}>
          {step === "email" ? "Continue with email" : "Log in"}
        </SubmitButton>
      </form>

      {googleEnabled && (
        <>
          <AuthDivider />
          <GoogleButton redirectTo={redirectTo} onError={setError} />
        </>
      )}
    </div>
  )
}
