"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { createTeam } from "@/actions/team";
import { createTeamSchema } from "@/lib/validations/team";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/shared/icons";

type FormData = z.infer<typeof createTeamSchema>;

export function CreateTeamForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: { name: "", slug: "" },
  });

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const result = await createTeam(data);

      if (result.status === "error") {
        toast.error(result.error || "Failed to create team");
      } else {
        toast.success("Team created successfully!");
        router.push("/dashboard/team");
        router.refresh();
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Team Name</Label>
        <Input
          id="name"
          placeholder="My Team"
          {...register("name")}
          onChange={(e) => {
            register("name").onChange(e);
            setValue("slug", generateSlug(e.target.value));
          }}
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Team Slug</Label>
        <Input
          id="slug"
          placeholder="my-team"
          {...register("slug")}
        />
        {errors.slug && (
          <p className="text-sm text-red-600">{errors.slug.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Used in URLs. Only lowercase letters, numbers, and hyphens.
        </p>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <Icons.spinner className="mr-2 size-4 animate-spin" />
        ) : null}
        Create Team
      </Button>
    </form>
  );
}
