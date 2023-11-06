import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex w-full flex-col gap-16 py-8 md:py-8">
      <section className="container flex flex-col items-center">
        <div className="mx-auto flex w-full flex-col items-center gap-5">
          <Skeleton className="mb-2 h-4 w-1/12" />
          <Skeleton className="h-10 w-2/6" />
          <Skeleton className="mb-3 mt-5 h-8 w-1/5" />
        </div>

        <div className="mx-auto grid w-full max-w-screen-lg gap-5 bg-inherit py-5 md:grid-cols-3 lg:grid-cols-3">
          <Skeleton className="h-[520px] w-full" />
          <Skeleton className="h-[520px] w-full" />
          <Skeleton className="h-[520px] w-full" />
        </div>

        <div className="mt-3 flex w-full flex-col items-center gap-2">
          <Skeleton className="h-4 w-2/6" />
          <Skeleton className="h-4 w-1/6" />

        </div>
      </section>

      <hr className='container' />
    </div>
  );
}