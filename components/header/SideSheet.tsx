import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Bars3BottomRightIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import { menuLinks } from "@/constants";
import Link from "next/link";
import SideMenu from "../SideMenu";

const SideSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="p-2 bg-white rounded-full lg:hidden cursor-pointer">
          <Bars3BottomRightIcon className="size-5" />
        </button>
      </SheetTrigger>
      <SheetContent>
        <SideMenu />
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Sign Out</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SideSheet;
