"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import LinkForm from "./LinkForm";
import { Link } from "@/lib/db/schema/links";

export default function LinkModal({ 
  link,
  emptyState,
}: { 
  link?: Link;
  emptyState?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const editing = !!link?.id;
  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerTrigger asChild>
      { emptyState ? (
          <Button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            New Link
          </Button>
        ) : (
        <Button
          variant={editing ? "ghost" : "outline"}
          size={editing ? "sm" : "icon"}
        >
          {editing ? "Edit" : "+"}
        </Button> )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="px-5 pt-5">
          <DrawerTitle>{ editing ? "Edit" : "Create" } Link</DrawerTitle>
        </DrawerHeader>
        <div className="px-5 pb-5">
          <LinkForm closeModal={closeModal} link={link} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
