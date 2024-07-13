import Image from "next/image";
import React from "react";
import SignInPopUp from "../SignInPopUp";
import SideSheet from "./SideSheet";
import Searchbar from "../Searchbar";
import MenuBar from "./MenuBar";
import ShopBasketIcon from "../ShopBasketIcon";
import { useCartStore } from "@/store";
import { Product } from "@/typings/productTypings";

const Navbar = () => {
  return (
    <header className="bg-white border shadow-sm py-2">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2 lg:gap-4 lg:space-x-10 ">
          <div className=" md:flex md:items-center md:gap-12">
            <a className="block text-teal-600" href="/">
              <span className="sr-only">Home</span>
              <Image
                src="/images/sowgreen.png"
                alt="logo"
                width={80}
                height={80}
                className="object-contain w-20"
              />
            </a>
          </div>

          <Searchbar />
          <div className="hidden md:inline-flex">
            <MenuBar />
          </div>

          <div className="md:flex md:items-center md:gap-12">
            <nav aria-label="Global" className="hidden md:block"></nav>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 lg:gap-4">
                <SignInPopUp />
                <ShopBasketIcon />
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
