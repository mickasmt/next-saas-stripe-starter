"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useSession } from "next-auth/react";

import { switchTeam } from "@/actions/switch-team";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CreateTeamModal } from "@/components/modals/create-team-modal";

type TeamItem = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
};

interface TeamSwitcherProps {
  teams?: TeamItem[];
  activeTeamId?: string;
  large?: boolean;
}

const TEAM_COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-indigo-500",
];

function getTeamColor(index: number) {
  return TEAM_COLORS[index % TEAM_COLORS.length];
}

export default function ProjectSwitcher({
  teams = [],
  activeTeamId,
  large = false,
}: TeamSwitcherProps) {
  const { update, status } = useSession();
  const router = useRouter();
  const [openPopover, setOpenPopover] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (status === "loading") {
    return <ProjectSwitcherPlaceholder />;
  }

  const activeTeam = teams.find((t) => t.id === activeTeamId);

  async function handleSwitch(teamId: string) {
    setOpenPopover(false);
    if (teamId === activeTeamId) return;
    await switchTeam(teamId);
    await update();
    router.refresh();
  }

  return (
    <>
      <div>
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
                    activeTeam
                      ? getTeamColor(teams.indexOf(activeTeam))
                      : "bg-gray-400",
                  )}
                />
                <div className="flex items-center space-x-3">
                  <span
                    className={cn(
                      "inline-block truncate text-sm font-medium xl:max-w-[120px]",
                      large ? "w-full" : "max-w-[80px]",
                    )}
                  >
                    {activeTeam?.name || "Select Team"}
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
              teams={teams}
              activeTeamId={activeTeamId}
              onSelect={handleSwitch}
              onNewTeam={() => {
                setOpenPopover(false);
                setShowCreateModal(true);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <CreateTeamModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </>
  );
}

function TeamList({
  teams,
  activeTeamId,
  onSelect,
  onNewTeam,
}: {
  teams: TeamItem[];
  activeTeamId?: string;
  onSelect: (teamId: string) => void;
  onNewTeam: () => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      {teams.map((team, index) => (
        <button
          key={team.id}
          className={cn(
            "relative flex h-9 w-full items-center gap-3 rounded-md p-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
          onClick={() => onSelect(team.id)}
        >
          <div
            className={cn("size-3 shrink-0 rounded-full", getTeamColor(index))}
          />
          <span
            className={`flex-1 truncate text-left text-sm ${
              activeTeamId === team.id
                ? "font-medium text-foreground"
                : "font-normal"
            }`}
          >
            {team.name}
          </span>
          {activeTeamId === team.id && (
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-foreground">
              <Check size={18} aria-hidden="true" />
            </span>
          )}
        </button>
      ))}
      <Button
        variant="outline"
        className="relative flex h-9 items-center justify-center gap-2 p-2"
        onClick={onNewTeam}
      >
        <Plus size={18} className="absolute left-2.5 top-2" />
        <span className="flex-1 truncate text-center">New Team</span>
      </Button>
    </div>
  );
}

function ProjectSwitcherPlaceholder() {
  return (
    <div className="flex animate-pulse items-center space-x-1.5 rounded-lg px-1.5 py-2 sm:w-60">
      <div className="h-8 w-36 animate-pulse rounded-md bg-muted xl:w-[180px]" />
    </div>
  );
}
