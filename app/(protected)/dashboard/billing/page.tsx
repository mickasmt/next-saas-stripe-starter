import Link from "next/link";

import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = constructMetadata({ title: "Access and payments", description: "View LMS access and purchase a learning track." });

export default function BillingPage() {
  return <><DashboardHeader heading="Access and payments" text="Paystack-backed purchases and manual grants determine your learning access." /><Card><CardHeader><CardTitle>Track access</CardTitle></CardHeader><CardContent className="space-y-4"><p className="text-sm text-muted-foreground">Your entitlements are managed by the LMS backend and remain independent of cohort membership.</p><Link href="/pricing" className="inline-flex"><Button>View available offerings</Button></Link></CardContent></Card></>;
}
