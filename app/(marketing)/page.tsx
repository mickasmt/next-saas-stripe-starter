// TODO: after cloning, replace HeroStarter and StackMarquee with your own
// landing page. They present the starter itself, not your product. You can
// then delete components/marketing/hero-starter.tsx, module-deck.tsx,
// stack-marquee.tsx and stack-logos.tsx.
import { HeroStarter } from "@/components/marketing/hero-starter"
import { StackMarquee } from "@/components/marketing/stack-marquee"

export default function HomePage() {
  return (
    <>
      <HeroStarter />
      <StackMarquee />
    </>
  )
}
