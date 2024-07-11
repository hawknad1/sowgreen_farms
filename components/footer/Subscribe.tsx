import React from "react";
import { Input } from "../ui/input";

const Subscribe = () => {
  return (
    <div className="col-span-2 lg:col-span-3 lg:flex lg:items-end">
      <form className="w-full">
        <label htmlFor="UserEmail" className="sr-only">
          {" "}
          Email{" "}
        </label>

        <div className="border border-gray-100 rounded-lg px-3 py-2 focus-within:ring sm:flex sm:items-center outline-none sm:gap-4">
          <Input
            type="email"
            id="UserEmail"
            placeholder="Enter email"
            className="w-full outline-none sm:text-sm"
          />

          <button className="mt-1 w-full bg-neutral-800 rounded-lg px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-none hover:bg-teal-600 sm:mt-0 sm:w-auto sm:shrink-0">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Subscribe;
