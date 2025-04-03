import {
  accountLinks,
  companyLinks,
  footerLeftLinks,
  helpfulLinks,
  paymentLinks,
} from "@/constants"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import Subscribe from "./Subscribe"
import Socials from "./Socials"
import { Separator } from "../ui/separator"
import { ChevronRight } from "lucide-react"
import { ArrowLongRightIcon } from "@heroicons/react/24/outline"

const Footer = () => {
  return (
    <>
      <footer className="bg-sowgren_Color">
        <div className="container px-6 py-10 mx-auto">
          <div className="md:flex md:-mx-3 md:items-center md:justify-between ">
            <h1 className="text-xl font-semibold tracking-tight text-gray-300 md:mx-3 xl:text-2xl">
              Subscribe our newsletter to get update.
            </h1>
            <div className="mt-6 md:mx-3 shrink-0 md:mt-0 md:w-auto">
              <a
                href="/sign-up"
                className="inline-flex items-center justify-center w-full px-4 py-2 text-sm text-sowgren_Color duration-300 bg-gray-200 rounded-lg gap-x-3 hover:bg-gray-300 focus:ring focus:ring-gray-300 focus:ring-opacity-80"
              >
                <span>Sign Up Now</span>
                <ArrowLongRightIcon className="h-6 w-6" />

                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg> */}
              </a>
            </div>
          </div>
          {/* <hr className="my-6 border-neutral-50 md:my-7 " /> */}
          <div className="my-6 border-neutral-50 md:my-7 " />
          {/* <Separator className="border-neutral-50" /> */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div className="">
              <p className="font-semibold text-gray-300">Account</p>
              <div className="gap-3 mt-4 flex flex-col">
                {accountLinks.map((acc) => (
                  <Link
                    key={acc.id}
                    href={acc.href}
                    className=" text-gray-300 transition-colors duration-300 hover:underline hover:text-gray-500"
                  >
                    {acc.title}
                  </Link>
                ))}
              </div>
            </div>

            <div className="">
              <p className="font-semibold text-gray-300">Company</p>
              <div className="gap-3 mt-4 flex flex-col">
                {companyLinks.map((com) => (
                  <Link
                    key={com.id}
                    href={com.href}
                    className=" text-gray-300 transition-colors duration-300 hover:underline hover:text-gray-500"
                  >
                    {com.title}
                  </Link>
                ))}
              </div>
            </div>

            <div className="">
              <p className="font-semibold text-gray-300">Helpful Links</p>
              <div className="gap-3 mt-4 flex flex-col">
                {helpfulLinks.map((com) => (
                  <Link
                    key={com.id}
                    href={com.href}
                    className=" text-gray-300 transition-colors duration-300 hover:underline hover:text-gray-500"
                  >
                    {com.title}
                  </Link>
                ))}
              </div>
            </div>

            <div className="">
              <p className="font-medium text-gray-300">Payment Methods</p>
              <div className="gap-y-2 mt-4 grid grid-cols-2">
                {paymentLinks.map((pay) => (
                  <div
                    key={pay.id}
                    className="border-slate-300 bg-gray-200 border rounded-md w-20"
                  >
                    <Image
                      src={pay.image}
                      width={100}
                      height={100}
                      alt="Payment Logo"
                      className="h-9 w-full object-contain rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* <hr className="my-6 border-gray-200 dark:border-gray-700" /> */}
          <div className="my-6 border-neutral-50 md:my-7 " />

          <div className="flex flex-col items-center justify-between sm:flex-row">
            <a href="/">
              <Image
                src="/images/logo.png"
                height={100}
                width={100}
                className="w-[200px] object-contain"
                alt="logo"
              />
            </a>

            <p className="mt-4 text-sm text-gray-400 sm:mt-0 dark:text-gray-300">
              © Copyright 2021. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
