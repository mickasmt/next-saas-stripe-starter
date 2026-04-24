import { redirect } from "next/navigation";

import { sidebarLinks } from "@/config/dashboard";
import { getActiveTeamId, setActiveTeamId } from "@/lib/active-team";
import { hasPermission, type Permission } from "@/lib/permissions";
import { getCurrentUser } from "@/lib/session";
import { getUserTeams } from "@/lib/team";
import { SearchCommand } from "@/components/dashboard/search-command";
import {
  DashboardSidebar,
  MobileSheetSidebar,
} from "@/components/layout/dashboard-sidebar";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { UserAccountNav } from "@/components/layout/user-account-nav";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function Dashboard({ children }: ProtectedLayoutProps) {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  // Fetch user's teams
  const teamMemberships = await getUserTeams(user.id);
  const teams = teamMemberships.map((m) => m.team);

  // Resolve active team from cookie (default to first team if any)
  let activeTeamId = await getActiveTeamId();
  const activeTeamMembership = activeTeamId
    ? teamMemberships.find((m) => m.team.id === activeTeamId)
    : null;

  if (!activeTeamMembership && teams.length > 0) {
    activeTeamId = teams[0].id;
    await setActiveTeamId(activeTeamId);
  } else if (!activeTeamMembership) {
    activeTeamId = undefined;
  }

  const activeRole = activeTeamMembership?.role;

  const filteredLinks = sidebarLinks.map((section) => ({
    ...section,
    items: section.items.filter(({ authorizeOnly, requiresTeamPermission }) => {
      if (authorizeOnly && authorizeOnly !== user.role) return false;
      if (requiresTeamPermission && activeRole) {
        return hasPermission(activeRole, requiresTeamPermission as Permission);
      }
      if (requiresTeamPermission && !activeRole) return false;
      return true;
    }),
  }));

  return (
    <div className="relative flex min-h-screen w-full">
      <DashboardSidebar
        links={filteredLinks}
        teams={teams}
        activeTeamId={activeTeamId}
      />

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-50 flex h-14 bg-background px-4 lg:h-[60px] xl:px-8">
          <MaxWidthWrapper className="flex max-w-7xl items-center gap-x-3 px-0">
            <MobileSheetSidebar
              links={filteredLinks}
              teams={teams}
              activeTeamId={activeTeamId}
            />

            <div className="w-full flex-1">
              <SearchCommand links={filteredLinks} />
            </div>

            <ModeToggle />
            <UserAccountNav />
          </MaxWidthWrapper>
        </header>

        <main className="flex-1 p-4 xl:px-8">
          <MaxWidthWrapper className="flex h-full max-w-7xl flex-col gap-4 px-0 lg:gap-6">
            {children}
          </MaxWidthWrapper>
        </main>
      </div>
    </div>
  );
}
