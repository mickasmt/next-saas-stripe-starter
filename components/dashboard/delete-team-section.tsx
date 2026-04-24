"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteTeam } from "@/actions/team";
import { Button } from "@/components/ui/button";
import { SectionColumns } from "@/components/dashboard/section-columns";
import { Icons } from "@/components/shared/icons";

export function DeleteTeamSection({ teamId }: { teamId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this team? This action cannot be undone.")) {
      return;
    }

    startTransition(async () => {
      const result = await deleteTeam(teamId);
      if (result.status === "success") {
        toast.success("Team deleted.");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to delete team.");
      }
    });
  };

  return (
    <SectionColumns
      title="Delete Team"
      description="This is a danger zone - Be careful!"
    >
      <div className="flex flex-col gap-4 rounded-xl border border-red-400 p-4 dark:border-red-900">
        <div className="flex flex-col gap-2">
          <span className="text-[15px] font-medium">Are you sure?</span>
          <div className="text-balance text-sm text-muted-foreground">
            Permanently delete this team and all its data. All members will lose
            access. This action cannot be undone.
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            ) : (
              <Icons.trash className="mr-2 size-4" />
            )}
            Delete Team
          </Button>
        </div>
      </div>
    </SectionColumns>
  );
}
