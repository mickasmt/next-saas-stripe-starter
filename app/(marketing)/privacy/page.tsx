import { getLegalMetadata, LegalPage } from "@/components/marketing/legal-page"

export const metadata = getLegalMetadata("privacy")

export default function PrivacyPage() {
  return <LegalPage slug="privacy" />
}
