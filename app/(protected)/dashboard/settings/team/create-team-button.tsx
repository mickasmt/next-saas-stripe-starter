"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import { CreateTeamModal } from "@/components/modals/create-team-modal";

export function CreateTeamButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Icons.add className="mr-2 size-4" />
        Create Team
      </Button>
      <CreateTeamModal open={open} onOpenChange={setOpen} />
    </>
  );
}
