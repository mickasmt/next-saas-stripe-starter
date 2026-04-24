"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteTeam } from "@/actions/delete-team";
import { leaveTeam } from "@/actions/manage-members";
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

interface TeamDangerZoneProps {
  teamId: string;
  teamName: string;
  isOwner: boolean;
  canDelete: boolean;
}

export function TeamDangerZone({
  teamId,
  teamName,
  isOwner,
  canDelete,
}: TeamDangerZoneProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLeave() {
    setLoading(true);
    const result = await leaveTeam(teamId);
    if (result.status === "error") {
      toast.error(result.message);
    } else {
      toast.success("You have left the team");
      router.push("/dashboard");
      router.refresh();
    }
    setLoading(false);
  }

  async function handleDelete() {
    setLoading(true);
    const result = await deleteTeam(teamId);
    if (result.status === "error") {
      toast.error(result.message);
    } else {
      toast.success("Team deleted");
      router.push("/dashboard");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-wrap gap-4">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" disabled={loading}>
            Leave Team
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave {teamName}?</AlertDialogTitle>
            <AlertDialogDescription>
              You will lose access to this team. You&apos;ll need a new invite to
              rejoin.
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

      {canDelete && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={loading}>
              Delete Team
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {teamName}?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. All team data, members, and invites
                will be permanently deleted.
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
  );
}
