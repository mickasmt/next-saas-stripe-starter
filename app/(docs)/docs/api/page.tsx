import type { Metadata } from "next";

import { ApiReference } from "@/components/docs/api-reference";
import openapi from "@/lib/api/generated/openapi.json";

export const metadata: Metadata = {
  title: "LMS API Reference",
  description: "Development-only reference for the versioned LMS API contract.",
  robots: { index: false, follow: false },
};

export default function ApiReferencePage() {
  return <ApiReference spec={openapi} />;
}

