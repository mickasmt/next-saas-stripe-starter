import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"

import LinkList from "@/components/links/LinkList";
import NewLinkModal from "@/components/links/LinkModal";
import { api } from "@/lib/trpc/api";
import { checkAuth } from "@/lib/auth";

export const metadata = {
  title: "Links",
}
export default async function LinksPage() {
  await checkAuth();
  const { links } = await api.listlinks.getLinks.query();  

  return (
    <DashboardShell>
      <DashboardHeader heading="Links" text="Add and manage your links.">
      </DashboardHeader>
      <div className="flex justify-between">
        <NewLinkModal />
      </div>
      <LinkList links={links} />
    </DashboardShell>
  );
}
