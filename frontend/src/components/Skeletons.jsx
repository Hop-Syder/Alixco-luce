import React from "react";

export const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-md bg-[hsl(var(--muted))] ${className}`} />
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="rounded-xl border bg-[hsl(var(--card))] p-3">
        <Skeleton className="aspect-[4/5] w-full" />
        <Skeleton className="mt-3 h-4 w-3/4" />
        <Skeleton className="mt-2 h-3 w-1/2" />
        <Skeleton className="mt-3 h-8 w-full" />
      </div>
    ))}
  </div>
);

export default Skeleton;
