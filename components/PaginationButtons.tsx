import React from "react";
import { Button } from "./ui/button";

const PaginationButtons = () => {
  return (
    <div className=" items-center space-x-2 hidden md:inline-flex">
      <Button className="py-0 px-3 h-8 text-xs font-semibold tracking-wide bg-red-600 hover:bg-red-700 rounded-full">
        All Products
      </Button>
      <Button
        className="py-0 px-3 h-8 text-xs font-semibold tracking-wide rounded-full"
        variant="outline"
      >
        Fruits
      </Button>
      <Button
        className="py-0 px-3 h-8 text-xs font-semibold tracking-wide rounded-full"
        variant="outline"
      >
        Vegetables
      </Button>
      <Button
        className="py-0 px-3 h-8 text-xs font-semibold tracking-wide rounded-full"
        variant="outline"
      >
        Cereals
      </Button>
      <Button
        className="py-0 px-3 h-8 text-xs font-semibold tracking-wide rounded-full"
        variant="outline"
      >
        Meats
      </Button>
    </div>
  );
};

export default PaginationButtons;
