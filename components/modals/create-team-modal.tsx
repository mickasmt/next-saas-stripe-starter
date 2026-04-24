"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { createTeam } from "@/actions/create-team";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/shared/icons";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

interface CreateTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTeamModal({ open, onOpenChange }: CreateTeamModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [loading, setLoading] = useState(false);
  const { update } = useSession();
  const router = useRouter();

  function handleNameChange(value: string) {
    setName(value);
    if (!slugManuallyEdited) {
      setSlug(slugify(value));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const result = await createTeam({ name, slug });

    if (result.status === "error") {
      toast.error(result.message);
    } else {
      toast.success("Team created");
      await update();
      setName("");
      setSlug("");
      setSlugManuallyEdited(false);
      onOpenChange(false);
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a New Team</DialogTitle>
            <DialogDescription>
              Create a team to collaborate with others.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="team-name">Team name</Label>
              <Input
                id="team-name"
                placeholder="My Team"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="team-slug">Slug</Label>
              <Input
                id="team-slug"
                placeholder="my-team"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugManuallyEdited(true);
                }}
                required
              />
              <p className="text-xs text-muted-foreground">
                Used in URLs. Only lowercase letters, numbers, and hyphens.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading || !name || !slug}>
              {loading && (
                <Icons.spinner className="mr-2 size-4 animate-spin" />
              )}
              Create Team
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
