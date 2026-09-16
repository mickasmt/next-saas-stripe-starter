import { getLegalMetadata, LegalPage } from "@/components/marketing/legal-page"

export const metadata = getLegalMetadata("terms")

export default function TermsPage() {
  return <LegalPage slug="terms" />
}
