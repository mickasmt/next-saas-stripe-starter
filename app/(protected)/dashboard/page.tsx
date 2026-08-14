import Link from "next/link";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

export const metadata = constructMetadata({ title: "Learning dashboard", description: "Continue your learning track." });

export default async function DashboardPage() {
  const user = await getCurrentUser();
  return <><DashboardHeader heading="Learning dashboard" text={`Welcome back${user?.name ? `, ${user.name}` : ""}. Your courses and progress will appear here.`} /><EmptyPlaceholder><EmptyPlaceholder.Icon name="bookOpen" /><EmptyPlaceholder.Title>No active enrollment</EmptyPlaceholder.Title><EmptyPlaceholder.Description>Purchase a track offering or ask an administrator for a manual access grant.</EmptyPlaceholder.Description><Link href="/pricing"><Button>Browse offerings</Button></Link></EmptyPlaceholder></>;
}
