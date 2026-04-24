"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

import { switchTeam } from "@/actions/team";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCreateTeamModal } from "@/components/modals/create-team-modal";

interface TeamItem {
  id: string;
  name: string;
  slug: string;
  role: string;
}

function slugColor(slug: string): string {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-orange-500",
  ];
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function ProjectSwitcher({
  large = false,
  teams = [],
  currentTeamId,
}: {
  large?: boolean;
  teams?: TeamItem[];
  currentTeamId?: string | null;
}) {
  const [openPopover, setOpenPopover] = useState(false);
  const { setShowCreateTeamModal, CreateTeamModal } = useCreateTeamModal();

  const selected = teams.find((t) => t.id === currentTeamId) ?? teams[0];

  if (!teams.length) {
    return (
      <>
        <CreateTeamModal />
        <Button
          variant="outline"
          className="h-8 gap-2 px-2"
          onClick={() => setShowCreateTeamModal(true)}
        >
          <Plus size={16} />
          <span className="text-sm">Create Team</span>
        </Button>
      </>
    );
  }

  return (
    <div>
      <CreateTeamModal />
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger>
          <Button
            className="h-8 px-2"
            variant={openPopover ? "secondary" : "ghost"}
            onClick={() => setOpenPopover(!openPopover)}
          >
            <div className="flex items-center space-x-3 pr-2">
              <div
                className={cn(
                  "size-3 shrink-0 rounded-full",
                  selected ? slugColor(selected.slug) : "bg-gray-400",
                )}
              />
              <div className="flex items-center space-x-3">
                <span
                  className={cn(
                    "inline-block truncate text-sm font-medium xl:max-w-[120px]",
                    large ? "w-full" : "max-w-[80px]",
                  )}
                >
                  {selected?.name ?? "Select team"}
                </span>
              </div>
            </div>
            <ChevronsUpDown
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="max-w-60 p-2">
          <TeamList
            selected={selected}
            teams={teams}
            setOpenPopover={setOpenPopover}
            onCreateTeam={() => {
              setOpenPopover(false);
              setShowCreateTeamModal(true);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function TeamList({
  selected,
  teams,
  setOpenPopover,
  onCreateTeam,
}: {
  selected?: TeamItem;
  teams: TeamItem[];
  setOpenPopover: (open: boolean) => void;
  onCreateTeam: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSwitch = (teamId: string) => {
    setOpenPopover(false);
    startTransition(async () => {
      await switchTeam(teamId);
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-1">
      {teams.map((team) => (
        <button
          key={team.id}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "relative flex h-9 w-full items-center gap-3 p-3 text-muted-foreground hover:text-foreground",
          )}
          onClick={() => handleSwitch(team.id)}
          disabled={isPending}
        >
          <div
            className={cn("size-3 shrink-0 rounded-full", slugColor(team.slug))}
          />
          <span
            className={`flex-1 truncate text-left text-sm ${
              selected?.id === team.id
                ? "font-medium text-foreground"
                : "font-normal"
            }`}
          >
            {team.name}
          </span>
          {selected?.id === team.id && (
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-foreground">
              <Check size={18} aria-hidden="true" />
            </span>
          )}
        </button>
      ))}
      <Button
        variant="outline"
        className="relative flex h-9 items-center justify-center gap-2 p-2"
        onClick={onCreateTeam}
      >
        <Plus size={18} className="absolute left-2.5 top-2" />
        <span className="flex-1 truncate text-center">New Team</span>
      </Button>
    </div>
  );
}
