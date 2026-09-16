import { GridSection } from "@/components/marketing/grid-section"
import {
  stack,
  StackLogo,
  type StackKey,
} from "@/components/marketing/stack-logos"

const logos = Object.keys(stack) as StackKey[]

export function StackMarquee() {
  return (
    <GridSection innerClassName="py-8 sm:py-4">
      <div className="sm:flex sm:items-center sm:gap-4">
        <p className="mx-auto max-w-sm text-center text-sm text-balance text-muted-foreground sm:mx-0 sm:shrink-0 sm:text-left">
          Built on a modern, production-ready stack
        </p>
        <div className="relative flex w-full min-w-0 items-center overflow-hidden mask-[linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] py-8 sm:py-4">
          {[false, true].map((hidden) => (
            <div
              key={String(hidden)}
              aria-hidden={hidden}
              className="flex w-max min-w-max items-center gap-10 pl-10 motion-safe:animate-infinite-scroll"
            >
              {logos.map((name) => (
                <StackLogo key={name} name={name} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </GridSection>
  )
}
