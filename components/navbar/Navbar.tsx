import Image from "next/image";
import React from "react";
import SignInPopUp from "../SignInPopUp";
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import SideSheet from "./SideSheet";

const Navbar = () => {
  return (
    <header className="bg-white border shadow-sm py-2">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-1.5 ">
          <div className=" md:flex md:items-center md:gap-12">
            <a className="block text-teal-600" href="/">
              <span className="sr-only">Home</span>
              <Image
                src="/images/sowgreen.png"
                alt="logo"
                width={80}
                height={80}
                className="object-contain w-24"
              />
            </a>
          </div>
          <div className=" flex-1 max-w-sm">
            <div className="flex  items-center border px-2 border-gray-300 rounded-3xl">
              <MagnifyingGlassIcon className="size-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search here..."
                className="text-sm outline-none p-2 bg-transparent"
              />
            </div>
          </div>

          <div className="md:flex md:items-center md:gap-12">
            <nav aria-label="Global" className="hidden md:block"></nav>

            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-4 md:space-x-6">
                <SignInPopUp />
                <div className="p-2 bg-white rounded-full cursor-pointer">
                  <ShoppingCartIcon className="size-5 " />
                </div>

                <SideSheet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
