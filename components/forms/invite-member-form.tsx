"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createInvitation } from "@/actions/invitation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "@/components/shared/icons";

function InviteMemberModal({
  showModal,
  setShowModal,
  teamId,
}: {
  showModal: boolean;
  setShowModal: (open: boolean) => void;
  teamId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"ADMIN" | "MEMBER">("MEMBER");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await createInvitation(teamId, { email, role });
      if (result.status === "success") {
        toast.success("Invitation sent.");
        setShowModal(false);
        setEmail("");
        setRole("MEMBER");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to send invitation.");
      }
    });
  };

  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <div className="flex flex-col items-center justify-center space-y-3 border-b p-4 pt-8 sm:px-16">
        <Icons.mail className="size-10" />
        <h3 className="text-lg font-semibold">Invite Member</h3>
        <p className="text-center text-sm text-muted-foreground">
          Send an invitation to join your team.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 bg-accent px-4 py-8 sm:px-16"
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="colleague@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={role} onValueChange={(v) => setRole(v as "ADMIN" | "MEMBER")}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MEMBER">Member</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Icons.spinner className="mr-2 size-4 animate-spin" />
          ) : null}
          Send Invitation
        </Button>
      </form>
    </Modal>
  );
}

export function InviteMemberButton({ teamId }: { teamId: string }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <InviteMemberModal
        showModal={showModal}
        setShowModal={setShowModal}
        teamId={teamId}
      />
      <Button onClick={() => setShowModal(true)} size="sm">
        <Icons.add className="mr-2 size-4" />
        Invite
      </Button>
    </>
  );
}
