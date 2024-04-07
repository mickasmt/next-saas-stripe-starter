import Image from "next/image";
import { InfoLdg } from "@/types";

import { cn } from "@/lib/utils";

import { Icons } from "../shared/icons";

interface InfoLandingProps {
  data: InfoLdg;
  reverse?: boolean;
}

export function InfoLanding({ data, reverse = false }: InfoLandingProps) {
  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:gap-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div className={cn(reverse ? "lg:order-2" : "lg:order-1")}>
          <h2 className="font-heading text-3xl text-foreground md:text-4xl lg:text-[40px]">
            {data.title}
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            {data.description}
          </p>
          <dl className="mt-6 space-y-4 leading-7">
            {data.list.map((item, index) => {
              const Icon = Icons[item.icon || "arrowRight"];
              return (
                <div className="relative pl-8" key={index}>
                  <dt className="font-semibold">
                    <Icon className="absolute left-0 top-1 size-5 stroke-purple-700" />
                    <span>{item.title}</span>
                  </dt>
                  <dd className="text-sm text-muted-foreground">
                    {item.description}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
        <div
          className={cn(
            "overflow-hidden rounded-xl border lg:-m-4",
            reverse ? "order-1" : "order-2",
          )}
        >
          <div className="aspect-video">
            <Image
              className="size-full object-cover object-center"
              src={data.image}
              alt={data.title}
              width={1000}
              height={500}
              priority={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
