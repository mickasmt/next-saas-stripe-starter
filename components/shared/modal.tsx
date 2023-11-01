"use client";

import useMediaQuery from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";
import { Drawer } from "vaul";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";


export function Modal({
  children,
  className,
  showModal,
  setShowModal,
}: {
  children: React.ReactNode;
  className?: string;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  // FIX: Drawer does not want to display. Why ?
  // const { isMobile } = useMediaQuery();
  const isMobile = false;

  if (isMobile) {
    return (
      <Drawer.Root open={showModal} onOpenChange={setShowModal}>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-gray-100/10 backdrop-blur" />
        <Drawer.Portal>
          <Drawer.Content
            className={cn(
              "fixed inset-x-0 bottom-0 z-50 mt-24 rounded-t-[10px] border-t border-gray-200 bg-white",
              className,
            )}
          >
            <div className="sticky top-0 z-20 flex w-full items-center justify-center rounded-t-[10px] bg-inherit">
              <div className="my-3 h-1 w-12 rounded-full bg-gray-300" />
            </div>
            {children}
          </Drawer.Content>
          <Drawer.Overlay />
        </Drawer.Portal>
      </Drawer.Root>
    );
  }
  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="overflow-hidden p-0 md:max-w-md md:rounded-2xl md:border">
        {children}
      </DialogContent>
    </Dialog>

  );
}
