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
      <div className="animate-slide-up-fade [animation-delay:500ms] motion-reduce:animate-none sm:flex sm:items-center sm:gap-8">
        <p className="mx-auto max-w-sm text-center text-sm font-medium text-balance text-muted-foreground sm:mx-0 sm:shrink-0 sm:text-left sm:leading-snug">
          Built on a modern, <br className="hidden sm:block" />
          production-ready stack
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
