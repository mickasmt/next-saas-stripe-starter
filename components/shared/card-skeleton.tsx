import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CardSkeleton() {
  return (
    <Card>
      <CardHeader className="gap-1">
        <Skeleton className="h-5 w-1/5" />
        <Skeleton className="h-3.5 w-2/5" />
      </CardHeader>
      <CardContent className="h-16" />
      <CardFooter className="flex h-14 items-center justify-between border-t bg-accent/50 p-6" />
    </Card>
  );
}
