import { ReactNode } from "react";

import { cn } from "@/lib/utils";

export default function MaxWidthWrapper({
  className,
  children,
  large = false,
}: {
  className?: string;
  large?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "container",
        large ? "max-w-screen-2xl" : "max-w-6xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
