"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import {
  AuthDivider,
  AuthField,
  FormError,
  GoogleButton,
  SubmitButton,
} from "@/components/auth/auth-ui"
import { authClient } from "@/lib/auth/client"

export function RegisterForm({
  redirectTo,
  googleEnabled,
}: {
  redirectTo: string
  googleEnabled: boolean
}) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const data = new FormData(event.currentTarget)

    setPending(true)
    const { error } = await authClient.signUp.email({
      name: String(data.get("name")),
      email: String(data.get("email")),
      password: String(data.get("password")),
    })

    if (error) {
      setPending(false)
      setError(error.message ?? "Unable to create your account.")
      return
    }

    router.replace(redirectTo)
    router.refresh()
  }

  return (
    <div className="grid gap-5">
      {googleEnabled && (
        <>
          <GoogleButton redirectTo={redirectTo} onError={setError} />
          <AuthDivider>or sign up with email</AuthDivider>
        </>
      )}

      <form onSubmit={onSubmit} className="grid gap-4">
        <AuthField
          id="name"
          name="name"
          label="Name"
          placeholder="Jane Doe"
          autoComplete="name"
          required
        />
        <AuthField
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="you@company.com"
          autoComplete="email"
          required
        />
        <AuthField
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          minLength={8}
          required
        />

        <FormError message={error} />

        <SubmitButton pending={pending}>Create account</SubmitButton>
      </form>
    </div>
  )
}
