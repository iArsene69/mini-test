import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function TableSkeleton() {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center py-4">
        <Skeleton className="max-w-sm h-12 w-[300px]" />
        <Skeleton className="w-16 h-12" />
      </div>
      <div className="flex flex-wrap gap-2">
        {[...Array(54)].map((idx) => (
          <Skeleton key={idx} className="h-12 w-[10%]" />
        ))}
      </div>
    </div>
  );
}
