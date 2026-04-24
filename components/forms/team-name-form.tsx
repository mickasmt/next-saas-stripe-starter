"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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

interface TeamNameFormProps {
  team: { id: string; name: string };
}

export function TeamNameForm({ team }: TeamNameFormProps) {
  const router = useRouter();
  const [updated, setUpdated] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(updateTeamSchema),
    defaultValues: { name: team.name },
  });

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const result = await updateTeam(team.id, data);
      if (result.status === "success") {
        setUpdated(false);
        toast.success("Team name updated.");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to update team name.");
      }
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <SectionColumns
        title="Team Name"
        description="The display name for your team."
      >
        <div className="flex w-full items-center gap-2">
          <Label className="sr-only" htmlFor="name">
            Name
          </Label>
          <Input
            id="name"
            className="flex-1"
            size={32}
            {...register("name")}
            onChange={(e) => setUpdated(e.target.value !== team.name)}
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
        <div className="flex flex-col justify-between p-1">
          {errors?.name && (
            <p className="pb-0.5 text-[13px] text-red-600">
              {errors.name.message}
            </p>
          )}
          <p className="text-[13px] text-muted-foreground">Max 100 characters</p>
        </div>
      </SectionColumns>
    </form>
  );
}
