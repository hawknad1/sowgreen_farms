"use client";

import { SearchIcon, ShoppingCartIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import MenuBar from "./navbar/MenuBar";
import SignInPopUp from "./SignInPopUp";
import SideSheet from "./navbar/SideSheet";
import Link from "next/link";
import UserAvatar from "./UserAvatar";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const Header = () => {
  const router = useRouter();

  const handlesubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.input.value;
    router.push(`/search?q=${input}`);
  };
  return (
    <div className="flex items-center mx-auto p-2 justify-between px-4 gap-2">
      <Link href="/" className="">
        <Image
          src="/images/sowgreen.png"
          alt="logo"
          width={80}
          height={80}
          className="object-contain w-16 md:w-24 "
        />
      </Link>

      <div className=" lg:flex-1 lg:px-4">
        <div className="flex space-x-1 items-center max-w-xl  bg-gray-100 px-1.5 py-1 rounded-full">
          <SearchIcon className="h-4 text-gray-500" />
          <form onSubmit={handlesubmit}>
            <Input
              type="text"
              name="input"
              className="h-6 md:h-8 text-xs lg:text-sm bg-transparent border-none focus-visible:ring-offset-0 focus-visible:ring-0"
              placeholder="Search products"
            />
          </form>
        </div>
      </div>

      <div className=" flex items-center ">
        <div className="hidden lg:flex">
          <MenuBar />
        </div>
        <div className="md:flex md:items-center md:gap-12">
          <nav aria-label="Global" className="hidden md:block"></nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-4 md:space-x-6">
              <div onClick={() => router.push("/signin")}>
                <Button className="hidden md:inline-flex">Sign In</Button>
              </div>
              <div
                onClick={() => router.push("/basket")}
                className="p-2 h-10 w-10 flex items-center justify-center rounded-full cursor-pointer bg-accent"
              >
                <ShoppingCartIcon className="size-5 " />
              </div>

              <SideSheet />
            </div>
          </div>
        </div>
      </div>
      <UserAvatar />
    </div>
  );
};

export default Header;
