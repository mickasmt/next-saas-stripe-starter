"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { acceptInvite, declineInvite } from "@/actions/manage-invites";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

export function InviteActions({ token }: { token: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleAccept() {
    setLoading(true);
    const result = await acceptInvite(token);
    if (result.status === "error") {
      toast.error(result.message);
      setLoading(false);
    } else {
      toast.success("Welcome to the team!");
      router.push("/dashboard");
    }
  }

  async function handleDecline() {
    setLoading(true);
    const result = await declineInvite(token);
    if (result.status === "error") {
      toast.error(result.message);
    } else {
      toast.success("Invitation declined");
      router.push("/dashboard");
    }
    setLoading(false);
  }

  return (
    <div className="flex gap-4">
      <Button variant="outline" onClick={handleDecline} disabled={loading}>
        Decline
      </Button>
      <Button onClick={handleAccept} disabled={loading}>
        {loading && <Icons.spinner className="mr-2 size-4 animate-spin" />}
        Accept Invitation
      </Button>
    </div>
  );
}
