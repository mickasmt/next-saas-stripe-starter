"use client";

import { useCreateTeamModal } from "@/components/modals/create-team-modal";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

export function CreateTeamCTA() {
  const { setShowCreateTeamModal, CreateTeamModal } = useCreateTeamModal();

  return (
    <>
      <CreateTeamModal />
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <Icons.users className="mb-4 size-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold">No team yet</h3>
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">
          Create a team to start collaborating with others. You can invite
          members and manage roles after creating your team.
        </p>
        <Button onClick={() => setShowCreateTeamModal(true)}>
          <Icons.add className="mr-2 size-4" />
          Create Your First Team
        </Button>
      </div>
    </>
  );
}
