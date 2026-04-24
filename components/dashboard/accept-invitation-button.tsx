"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { acceptInvitation } from "@/actions/invitation";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

export function AcceptInvitationButton({ token }: { token: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAccept = () => {
    startTransition(async () => {
      const result = await acceptInvitation(token);
      if (result.status === "success") {
        toast.success("Invitation accepted! Welcome to the team.");
        router.push("/dashboard/team");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to accept invitation.");
      }
    });
  };

  return (
    <Button onClick={handleAccept} disabled={isPending} className="w-full sm:w-auto">
      {isPending ? (
        <Icons.spinner className="mr-2 size-4 animate-spin" />
      ) : (
        <Icons.check className="mr-2 size-4" />
      )}
      Accept Invitation
    </Button>
  );
}
