import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/16/solid";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { getCategories } from "@/lib/utils";
import { Product } from "@/typings/productTypings";

const AllCategory = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Button
      onClick={(prev) => {
        setIsOpen(!prev);
        setIsOpen(!isOpen);
      }}
      className="py-0 px-3 h-8 text-xs font-semibold tracking-wide bg-red-600 hover:bg-red-700 rounded-full"
    >
      All Products
      {isOpen ? (
        <ChevronUpIcon className="h-5 w-5" />
      ) : (
        <ChevronDownIcon className="h-5 w-5" />
      )}
    </Button>
  );
};

export default AllCategory;
