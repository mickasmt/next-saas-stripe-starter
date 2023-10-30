"use client";

import Modal from "@/components/shared/modal";
import { siteConfig } from "@/config/site";
import { signIn, useSession } from "next-auth/react";
import {
  useCallback,
  useMemo, useState
} from "react";
import { Icons } from "../shared/icons";
import { Button } from "../ui/button";
import { useModal } from '@/hooks/use-modal';

export const SignInModal = () => {
  const [signInClicked, setSignInClicked] = useState(false);
  const [modal, setModal] = useModal();

  const closeSignInModal = () => {
    setSignInClicked(false);
    setModal(() => ({ signInOpen: false }));
  };

  return (
    <Modal showModal={modal.signInOpen} setShowModal={closeSignInModal}>
      <div className="w-full">
        <div className="flex flex-col items-center justify-center space-y-3 border-b bg-background px-4 py-6 pt-8 text-center md:px-16">
          <a href={siteConfig.url}>
            <Icons.logo className="h-10 w-10" />
          </a>
          <h3 className="font-urban text-2xl font-bold">Sign In</h3>
          <p className="text-sm text-gray-500">
            This is strictly for demo purposes - only your email and profile
            picture will be stored.
          </p>
        </div>

        <div className="flex flex-col space-y-4 bg-secondary/50 px-4 py-8 md:px-16">
          <Button
            variant="default"
            disabled={signInClicked}
            onClick={() => {
              setSignInClicked(true);
              signIn("google", { redirect: false }).then(() =>
                // TODO: fix this without setTimeOut(), modal closes too quickly
                setTimeout(() => {
                  closeSignInModal();
                }, 1000)
              );
            }}
          >
            {signInClicked ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.google className="mr-2 h-4 w-4" />
            )}{" "}
            Sign In with Google
          </Button>
        </div>
      </div>
    </Modal>
  );
};


export function useSignInModal() {
  const [modal, setModal] = useModal();

  const openSignInModal = useCallback(() => {
    setModal(() => ({ signInOpen: true }));
  }, [setModal]);

  return useMemo(
    () => ({ openSignInModal }),
    [openSignInModal],
  );
}