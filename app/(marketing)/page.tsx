import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { cn, nFormatter } from "@/lib/utils"
import { Icons } from "@/components/shared/icons"
import { Medal } from "lucide-react"

export default async function IndexPage() {
  return (
    <>
      <section className="space-y-6 pb-12 pt-16 lg:py-28">
        <div className="container flex max-w-[64rem] flex-col items-center gap-5 text-center">
          <Medal className="animate-fade-up opacity-0" style={{ animationDelay: "0.05s", animationFillMode: "forwards" }} size={64} />
          <Link
            href="https://twitter.com/snack_xyz"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "animate-fade-up opacity-0")}
            style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
            target="_blank"
          >
            Introducing on <Icons.twitter className="ml-2 size-4" />
          </Link>

          <h1
            className="animate-fade-up text-balance font-urban text-4xl font-extrabold tracking-tight opacity-0 sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
          >
            Kick off with a bang with{" "}
            <span className="text-gradient_indigo-purple font-extrabold">
              SaaS Starter
            </span>
          </h1>

          <p
            className="max-w-[42rem] animate-fade-up text-balance leading-normal text-muted-foreground opacity-0 sm:text-xl sm:leading-8"
            style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
          >
            <Balancer>
              With Snack, you can create, organize, and publish lists of links in a snap. Whether you&apos;re a content creator, a knowledge enthusiast, or just someone who loves sharing interesting finds, Snack has got you covered!
            </Balancer>
          </p>

          <div
            className="flex animate-fade-up justify-center space-x-2 opacity-0 md:space-x-4"
            style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
          >
            <Link href="/pricing" className={cn(buttonVariants({ size: "lg" }))}>
              Get Started
            </Link>
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "px-4")}
            >
              Create a List
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}