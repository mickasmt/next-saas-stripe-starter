"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { acceptInvitation } from "@/actions/invitation";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

interface AcceptInvitationButtonProps {
  token: string;
}

export function AcceptInvitationButton({ token }: AcceptInvitationButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleAccept() {
    startTransition(async () => {
      const result = await acceptInvitation(token);

      if (result.status === "error") {
        toast.error(result.error || "Failed to accept invitation");
      } else {
        toast.success("You have joined the team!");
        router.push("/dashboard");
        router.refresh();
      }
    });
  }

  return (
    <Button onClick={handleAccept} disabled={isPending} className="w-full">
      {isPending ? (
        <Icons.spinner className="mr-2 size-4 animate-spin" />
      ) : null}
      Accept Invitation
    </Button>
  );
}
