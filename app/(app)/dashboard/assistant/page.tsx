import { AssistantChat } from "@/components/assistant/assistant-chat"
import { PageContent, PageHeader } from "@/components/dashboard/page-header"
import { buildMetadata } from "@/lib/metadata"
import { ASSISTANT_MODEL } from "@/modules/assistant/model"

export const metadata = buildMetadata({
  title: "Assistant",
  noIndex: true,
})

export default function AssistantPage() {
  return (
    <PageContent>
      <PageHeader
        title="Assistant"
        description="Chat with an AI model through Neon AI Gateway. Conversations aren't saved."
      />
      <AssistantChat model={ASSISTANT_MODEL} />
    </PageContent>
  )
}
