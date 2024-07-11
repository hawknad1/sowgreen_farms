import { StarIcon } from "@heroicons/react/16/solid";
import React from "react";

const Ratings = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center ">
        <StarIcon className="h-4 w-4 text-orange-400" />
        <StarIcon className="h-4 w-4 text-orange-400" />
        <StarIcon className="h-4 w-4 text-orange-400" />
        <StarIcon className="h-4 w-4 text-orange-400" />
      </div>
      <p className="text-sm font-semibold">
        Rating 4.5 <span className="text-neutral-500">(1.2K Reviews)</span>
      </p>
    </div>
  );
};

export default Ratings;
