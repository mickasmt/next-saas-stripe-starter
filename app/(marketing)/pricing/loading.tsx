import { Skeleton } from "@/components/ui/skeleton";
import { HeaderSection } from "@/components/shared/header-section";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function Loading() {
  return (
    <div className="flex w-full flex-col gap-16 py-8 md:py-8">
      <MaxWidthWrapper>
        <section className="flex flex-col items-center">
          <div className="mx-auto flex w-full flex-col items-center gap-5">
            <HeaderSection label="Pricing" title="Start at full speed !" />
            <Skeleton className="mb-3 mt-5 h-8 w-1/5 rounded-full" />
          </div>

          <div className="grid w-full gap-5 bg-inherit py-5 md:grid-cols-3 lg:grid-cols-3">
            <Skeleton className="h-[520px] w-full rounded-3xl" />
            <Skeleton className="h-[520px] w-full rounded-3xl" />
            <Skeleton className="h-[520px] w-full rounded-3xl" />
          </div>

          <div className="mt-3 flex w-full flex-col items-center gap-2">
            <Skeleton className="h-4 w-2/6" />
            <Skeleton className="h-4 w-1/6" />
          </div>
        </section>
      </MaxWidthWrapper>

      <hr className="container" />
    </div>
  );
}
