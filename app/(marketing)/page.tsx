// TODO: after cloning, replace these sections with your own landing page. They
// present the starter itself, not your product. You can then delete
// app/(marketing)/pro, and components/marketing/hero-starter.tsx,
// module-deck.tsx, stack-marquee.tsx, stack-logos.tsx, modules-showcase.tsx,
// panel-demo.tsx, pro-showcase.tsx, onboarding-demo.tsx, why-modular.tsx and
// closing-cta.tsx.
import { ClosingCta } from "@/components/marketing/closing-cta"
import { HeroStarter } from "@/components/marketing/hero-starter"
import { ModulesShowcase } from "@/components/marketing/modules-showcase"
import { StackMarquee } from "@/components/marketing/stack-marquee"
import { WhyModular } from "@/components/marketing/why-modular"

export default function HomePage() {
  return (
    <>
      <HeroStarter />
      <StackMarquee />
      <ModulesShowcase />
      <WhyModular />
      <ClosingCta />
    </>
  )
}
