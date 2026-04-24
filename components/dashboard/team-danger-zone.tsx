"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { leaveTeam } from "@/actions/member";
import { deleteTeam } from "@/actions/team";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { SectionColumns } from "@/components/dashboard/section-columns";

interface TeamDangerZoneProps {
  teamId: string;
  isOwner: boolean;
}

export function TeamDangerZone({ teamId, isOwner }: TeamDangerZoneProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleLeave() {
    startTransition(async () => {
      const result = await leaveTeam(teamId);
      if (result.status === "error") {
        toast.error(result.error);
      } else {
        toast.success("You have left the team");
        router.push("/dashboard");
        router.refresh();
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteTeam(teamId);
      if (result.status === "error") {
        toast.error(result.error);
      } else {
        toast.success("Team deleted");
        router.push("/dashboard");
        router.refresh();
      }
    });
  }

  return (
    <SectionColumns
      title="Danger Zone"
      description="Irreversible and destructive actions."
    >
      <div className="flex flex-col gap-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" disabled={isPending}>
              Leave Team
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Leave Team</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to leave this team? You will lose access to
                all team resources.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLeave}>
                Leave Team
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {isOwner && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isPending}>
                Delete Team
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Team</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  team, remove all members, and revoke all invitations.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete Team
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </SectionColumns>
  );
}
