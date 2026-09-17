import * as React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/70 dark:bg-muted/40",
        className
      )}
      {...props}
    />
  );
}

export function CalculatorSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 animate-fade-up">
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <Skeleton className="h-6 w-1/3 rounded-lg" />
        <Skeleton className="h-4 w-2/3 rounded-md" />
        <div className="space-y-3 pt-4">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <Skeleton className="h-6 w-1/3 rounded-lg" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="space-y-2 pt-2">
          <Skeleton className="h-6 w-full rounded-md" />
          <Skeleton className="h-6 w-full rounded-md" />
          <Skeleton className="h-6 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
