import { redirect } from "next/navigation"

import { EmptyPlaceholder } from "@/components/shared/empty-placeholder"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { Button } from "@/components/ui/button"

import ListList from "@/components/lists/ListList";
import NewListModal from "@/components/lists/ListModal";
import { api } from "@/lib/trpc/api";
import { checkAuth } from "@/lib/auth";

export const metadata = {
  title: "Dashboard",
}

export default async function ListsPage() {
  await checkAuth();
  const { lists } = await api.lists.getLists.query();

  return (
    <DashboardShell>
      <DashboardHeader heading="Lists" text="Create and manage content." />
      <div className="flex justify-between">
        <NewListModal />
      </div>
      <ListList lists={lists} />
    </DashboardShell>
  )
}