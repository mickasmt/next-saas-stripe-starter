"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { updateTeam } from "@/actions/team";
import { updateTeamSchema } from "@/lib/validations/team";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionColumns } from "@/components/dashboard/section-columns";
import { Icons } from "@/components/shared/icons";

type FormData = z.infer<typeof updateTeamSchema>;

interface TeamSettingsFormProps {
  team: { id: string; name: string; slug: string };
}

export function TeamSettingsForm({ team }: TeamSettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [updated, setUpdated] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(updateTeamSchema),
    defaultValues: { name: team.name, slug: team.slug },
  });

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const result = await updateTeam(team.id, data);

      if (result.status === "error") {
        toast.error(result.error || "Failed to update team");
      } else {
        toast.success("Team updated successfully!");
        setUpdated(false);
        router.refresh();
      }
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <SectionColumns
        title="Team Name"
        description="The display name of your team."
      >
        <div className="flex w-full items-center gap-2">
          <Label className="sr-only" htmlFor="name">
            Name
          </Label>
          <Input
            id="name"
            className="flex-1"
            {...register("name")}
            onChange={(e) => {
              register("name").onChange(e);
              setUpdated(true);
            }}
          />
        </div>
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </SectionColumns>

      <SectionColumns
        title="Team Slug"
        description="The URL-friendly identifier for your team."
      >
        <div className="flex w-full items-center gap-2">
          <Label className="sr-only" htmlFor="slug">
            Slug
          </Label>
          <Input
            id="slug"
            className="flex-1"
            {...register("slug")}
            onChange={(e) => {
              register("slug").onChange(e);
              setUpdated(true);
            }}
          />
          <Button
            type="submit"
            variant={updated ? "default" : "disable"}
            disabled={isPending || !updated}
            className="w-[67px] shrink-0 px-0 sm:w-[130px]"
          >
            {isPending ? (
              <Icons.spinner className="size-4 animate-spin" />
            ) : (
              <p>
                Save
                <span className="hidden sm:inline-flex">&nbsp;Changes</span>
              </p>
            )}
          </Button>
        </div>
        {errors.slug && (
          <p className="text-sm text-red-600">{errors.slug.message}</p>
        )}
      </SectionColumns>
    </form>
  );
}
