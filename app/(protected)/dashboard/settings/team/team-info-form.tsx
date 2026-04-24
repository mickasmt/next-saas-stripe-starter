"use client";

import { useState } from "react";
import { toast } from "sonner";

import { updateTeam } from "@/actions/update-team";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/shared/icons";

interface TeamInfoFormProps {
  teamId: string;
  defaultValues: {
    name: string;
    slug: string;
  };
}

export function TeamInfoForm({ teamId, defaultValues }: TeamInfoFormProps) {
  const [name, setName] = useState(defaultValues.name);
  const [slug, setSlug] = useState(defaultValues.slug);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const result = await updateTeam(teamId, { name, slug });

    if (result.status === "error") {
      toast.error(result.message);
    } else {
      toast.success("Team updated");
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Team name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading && <Icons.spinner className="mr-2 size-4 animate-spin" />}
        Save Changes
      </Button>
    </form>
  );
}
