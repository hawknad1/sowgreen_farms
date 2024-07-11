import React from "react";
import { Skeleton } from "../ui/skeleton";

const HomeProductSkeleton = () => {
  return (
    <div className="flex items-center space-x-4 p-4 w-max">
      <Skeleton className="w-48 h-64 rounded-lg" />
      <Skeleton className="w-48 h-64 rounded-lg" />
      <Skeleton className="w-48 h-64 rounded-lg" />
      <Skeleton className="w-48 h-64 rounded-lg" />
      <Skeleton className="w-48 h-64 rounded-lg" />
      <Skeleton className="w-48 h-64 rounded-lg" />
    </div>
  );
};

export default HomeProductSkeleton;
