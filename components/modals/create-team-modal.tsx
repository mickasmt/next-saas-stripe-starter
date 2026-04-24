"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
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
import { Modal } from "@/components/ui/modal";
import { Icons } from "@/components/shared/icons";

type FormData = z.infer<typeof createTeamSchema>;

function CreateTeamModalInner({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: (open: boolean) => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(createTeamSchema),
  });

  const generateSlug = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setValue("slug", slug);
  };

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const result = await createTeam(data);
      if (result.status === "success") {
        toast.success("Team created successfully.");
        setShowModal(false);
        reset();
        router.refresh();
      } else {
        toast.error(result.message || "Failed to create team.");
      }
    });
  });

  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <div className="flex flex-col items-center justify-center space-y-3 border-b p-4 pt-8 sm:px-16">
        <Icons.users className="size-10" />
        <h3 className="text-lg font-semibold">Create Team</h3>
        <p className="text-center text-sm text-muted-foreground">
          Create a new team to collaborate with others.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="flex flex-col space-y-4 bg-accent px-4 py-8 sm:px-16"
      >
        <div className="space-y-2">
          <Label htmlFor="name">Team Name</Label>
          <Input
            id="name"
            placeholder="My Team"
            {...register("name", {
              onChange: (e) => generateSlug(e.target.value),
            })}
            className="bg-background"
          />
          {errors.name && (
            <p className="text-[13px] text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Team Slug</Label>
          <Input
            id="slug"
            placeholder="my-team"
            {...register("slug")}
            className="bg-background"
          />
          {errors.slug && (
            <p className="text-[13px] text-red-600">{errors.slug.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Icons.spinner className="mr-2 size-4 animate-spin" />
          ) : null}
          Create Team
        </Button>
      </form>
    </Modal>
  );
}

export function useCreateTeamModal() {
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);

  const CreateTeamModalCallback = useCallback(() => {
    return (
      <CreateTeamModalInner
        showModal={showCreateTeamModal}
        setShowModal={setShowCreateTeamModal}
      />
    );
  }, [showCreateTeamModal]);

  return useMemo(
    () => ({
      setShowCreateTeamModal,
      CreateTeamModal: CreateTeamModalCallback,
    }),
    [setShowCreateTeamModal, CreateTeamModalCallback],
  );
}
