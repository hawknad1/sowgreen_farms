import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const LoadingProducts = () => {
  return (
    <div className="container mx-auto py-8 flex-1">
      <div className="flex items-center flex-col gap-8">
        <h4 className="text-3xl font-bold text-center">
          Organic Fresh Farm Produce
        </h4>
        <div className="flex items-center space-x-4">
          <Skeleton className="w-20 h-9 rounded-xl" />
          <Skeleton className="w-20 h-9 rounded-xl" />
          <Skeleton className="w-20 h-9 rounded-xl" />
          <Skeleton className="w-20 h-9 rounded-xl" />
          <Skeleton className="w-20 h-9 rounded-xl" />
          <Skeleton className="w-20 h-9 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          <Skeleton className="w-48 h-52 rounded-lg" />
          <Skeleton className="w-48 h-52 rounded-lg" />
          <Skeleton className="w-48 h-52 rounded-lg" />
          <Skeleton className="w-48 h-52 rounded-lg" />
          <Skeleton className="w-48 h-52 rounded-lg" />
          <Skeleton className="w-48 h-52 rounded-lg" />
          <Skeleton className="w-48 h-52 rounded-lg" />
          <Skeleton className="w-48 h-52 rounded-lg" />
          <Skeleton className="w-48 h-52 rounded-lg" />
          <Skeleton className="w-48 h-52 rounded-lg" />
          <Skeleton className="w-48 h-52 rounded-lg" />
          <Skeleton className="w-48 h-52 rounded-lg" />
          <Skeleton className="w-48 h-52 rounded-lg" />
          <Skeleton className="w-48 h-52 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default LoadingProducts;
