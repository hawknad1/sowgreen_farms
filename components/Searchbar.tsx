"use client";
import React, { FormEvent, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

const Searchbar = () => {
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("search") as string;

    if (name) {
      router.push(`/products?name=${name}`);
    }
  };

  return (
    <form
      className="flex items-center justify-between bg-gray-100 p-2 rounded-full pl-3 flex-1 px-2 lg:px-4"
      onSubmit={handleSearch}
    >
      <input
        type="text"
        name="search"
        placeholder="search products"
        className="flex-1 bg-transparent outline-none text-sm lg:text-base"
      />
      <MagnifyingGlassIcon className="lg:h-6 lg:w-6 h-5 w-5 cursor-pointer text-gray-400" />
    </form>
  );
};

export default Searchbar;
