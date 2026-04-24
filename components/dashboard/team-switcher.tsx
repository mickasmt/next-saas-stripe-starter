"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TeamRole } from "@prisma/client";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { toast } from "sonner";

import { switchTeam } from "@/actions/team";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type TeamItem = {
  id: string;
  name: string;
  slug: string;
  role: TeamRole;
};

interface TeamSwitcherProps {
  teams: TeamItem[];
  currentTeamId: string | null;
  large?: boolean;
}

export default function TeamSwitcher({
  teams,
  currentTeamId,
  large = false,
}: TeamSwitcherProps) {
  const router = useRouter();
  const [openPopover, setOpenPopover] = useState(false);
  const [isPending, startTransition] = useTransition();

  const selected = teams.find((t) => t.id === currentTeamId);

  if (!teams.length) {
    return (
      <Button
        variant="outline"
        className="h-8 px-2"
        onClick={() => router.push("/dashboard/team/create")}
      >
        <Plus size={16} className="mr-1" />
        <span className="text-sm">Create Team</span>
      </Button>
    );
  }

  function handleSwitch(teamId: string) {
    setOpenPopover(false);
    if (teamId === currentTeamId) return;

    startTransition(async () => {
      const result = await switchTeam(teamId);
      if (result.status === "error") {
        toast.error(result.error);
      } else {
        router.refresh();
      }
    });
  }

  const ROLE_COLORS: Record<TeamRole, string> = {
    OWNER: "bg-amber-500",
    ADMIN: "bg-blue-500",
    MEMBER: "bg-green-500",
    VIEWER: "bg-gray-400",
  };

  return (
    <div>
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger asChild>
          <Button
            className="h-8 px-2"
            variant={openPopover ? "secondary" : "ghost"}
            disabled={isPending}
          >
            <div className="flex items-center space-x-3 pr-2">
              <div
                className={cn(
                  "size-3 shrink-0 rounded-full",
                  selected ? ROLE_COLORS[selected.role] : "bg-gray-400",
                )}
              />
              <span
                className={cn(
                  "inline-block truncate text-sm font-medium xl:max-w-[120px]",
                  large ? "w-full" : "max-w-[80px]",
                )}
              >
                {selected?.name || "Select Team"}
              </span>
            </div>
            <ChevronsUpDown
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="max-w-60 p-2">
          <div className="flex flex-col gap-1">
            {teams.map((team) => (
              <button
                key={team.id}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "relative flex h-9 items-center gap-3 p-3 text-muted-foreground hover:text-foreground",
                )}
                onClick={() => handleSwitch(team.id)}
              >
                <div
                  className={cn(
                    "size-3 shrink-0 rounded-full",
                    ROLE_COLORS[team.role],
                  )}
                />
                <span
                  className={`flex-1 truncate text-left text-sm ${
                    currentTeamId === team.id
                      ? "font-medium text-foreground"
                      : "font-normal"
                  }`}
                >
                  {team.name}
                </span>
                {currentTeamId === team.id && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-foreground">
                    <Check size={18} aria-hidden="true" />
                  </span>
                )}
              </button>
            ))}
            <Button
              variant="outline"
              className="relative flex h-9 items-center justify-center gap-2 p-2"
              onClick={() => {
                setOpenPopover(false);
                router.push("/dashboard/team/create");
              }}
            >
              <Plus size={18} className="absolute left-2.5 top-2" />
              <span className="flex-1 truncate text-center">New Team</span>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
