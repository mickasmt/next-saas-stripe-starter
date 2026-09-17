"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { SectionCard } from "@/components/dashboard/section-card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth/client"

const CONFIRM_PHRASE = "delete my account"

export function DeleteAccountCard({ hasPassword }: { hasPassword: boolean }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [phrase, setPhrase] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const ready = phrase === CONFIRM_PHRASE && (!hasPassword || password)

  function onOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setPhrase("")
      setPassword("")
      setError(null)
    }
  }

  function deleteAccount() {
    setError(null)
    startTransition(async () => {
      const { error } = await authClient.deleteUser(
        hasPassword ? { password } : {}
      )
      if (error) {
        setError(
          error.code === "SESSION_EXPIRED"
            ? "For security, sign in again before deleting your account."
            : (error.message ?? "Couldn't delete your account.")
        )
        return
      }
      router.replace("/")
      router.refresh()
    })
  }

  return (
    <SectionCard
      tone="danger"
      title="Delete Account"
      description="Permanently remove your account and all of its contents. This action is not reversible, so please continue with caution."
      footer={
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogTrigger
            render={
              <Button
                size="sm"
                className="ml-auto bg-destructive px-2.5 text-white hover:bg-destructive/90"
              />
            }
          >
            Delete Account
          </DialogTrigger>
          <DialogContent className="rounded-lg">
            <DialogHeader>
              <DialogTitle>Delete Account</DialogTitle>
              <DialogDescription>
                Your account, your sessions and the organizations where you are
                the only member will be deleted. This can&apos;t be undone.
              </DialogDescription>
            </DialogHeader>

            <form
              id="delete-account"
              className="flex flex-col gap-4"
              onSubmit={(event) => {
                event.preventDefault()
                if (ready) deleteAccount()
              }}
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="delete-phrase">
                  To verify, type{" "}
                  <span className="font-semibold">{CONFIRM_PHRASE}</span> below
                </Label>
                <Input
                  id="delete-phrase"
                  autoComplete="off"
                  value={phrase}
                  onChange={(event) => setPhrase(event.target.value)}
                />
              </div>
              {hasPassword && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="delete-password">Your password</Label>
                  <Input
                    id="delete-password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
              )}
              {error && <p className="text-destructive">{error}</p>}
            </form>

            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <Button
                type="submit"
                form="delete-account"
                disabled={!ready || pending}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                {pending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    />
  )
}
