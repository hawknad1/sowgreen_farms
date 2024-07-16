import React from "react";
import { Skeleton } from "../ui/skeleton";

const ProductsSkeleton = () => {
  return (
    <div className="container mx-auto py-8 flex-1">
      <div className="flex items-center flex-col gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <Skeleton className="w-48 h-56 rounded-lg" />
          <Skeleton className="w-48 h-56 rounded-lg" />
          <Skeleton className="w-48 h-56 rounded-lg" />
          <Skeleton className="w-48 h-56 rounded-lg" />
          <Skeleton className="w-48 h-56 rounded-lg" />
          <Skeleton className="w-48 h-56 rounded-lg" />
          <Skeleton className="w-48 h-56 rounded-lg" />
          <Skeleton className="w-48 h-56 rounded-lg" />
          <Skeleton className="w-48 h-56 rounded-lg" />
          <Skeleton className="w-48 h-56 rounded-lg" />
          <Skeleton className="w-48 h-56 rounded-lg" />
          <Skeleton className="w-48 h-56 rounded-lg" />
          <Skeleton className="w-48 h-56 rounded-lg" />
          <Skeleton className="w-48 h-56 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default ProductsSkeleton;
