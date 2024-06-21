"use client";

import { useDeleteAccountModal } from "@/components/modals/delete-account-modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";

export function DeleteAccountSection() {
  const { setShowDeleteAccountModal, DeleteAccountModal } =
    useDeleteAccountModal();

  return (
    <>
      <DeleteAccountModal />
      <Card className="border border-red-600">
        <CardHeader className="space-y-2">
          <CardTitle>Delete Account</CardTitle>
          <CardDescription className="text-pretty text-[15px] lg:text-balance">
            Permanently delete your {siteConfig.name} account and your
            subscription. This action cannot be undone - please proceed with
            caution.
          </CardDescription>
        </CardHeader>
        <CardFooter className="mt-2 flex justify-end border-t border-red-600 bg-red-500/5 py-2">
          <Button
            type="submit"
            variant="destructive"
            onClick={() => setShowDeleteAccountModal(true)}
          >
            <span>Delete Account</span>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
