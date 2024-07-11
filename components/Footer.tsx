import {
  accountLinks,
  companyLinks,
  footerLeftLinks,
  helpfulLinks,
  paymentLinks,
} from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Subscribe from "./footer/Subscribe";
import Socials from "./footer/Socials";

const Footer = () => {
  return (
    <footer className="bg-green-50">
      <div className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-start lg:gap-8">
          <div className="">
            <Image
              src="/images/sowgreen.png"
              height={100}
              width={100}
              className="h-32 w-32 object-contain opacity-70"
              alt="logo"
            />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-8 lg:mt-0 lg:grid-cols-4 lg:gap-y-8 lg:w-full">
            <div className="col-span-2">
              <div>
                <p className="mt-4 text-gray-500 max-w-36">
                  Sowgreen Farms - East Legon - Accra.
                </p>
              </div>
            </div>

            <Subscribe />

            <div className="col-span-2 sm:col-span-1">
              <p className="font-medium text-gray-900">Account</p>
              <div className="gap-3 mt-4 flex flex-col">
                {accountLinks.map((acc) => (
                  <Link
                    key={acc.id}
                    href={acc.href}
                    className=" text-sm text-gray-700 transition hover:opacity-75"
                  >
                    {acc.title}
                  </Link>
                ))}
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <p className="font-medium text-gray-900">Company</p>

              <div className="gap-3 mt-4 flex flex-col">
                {companyLinks.map((com) => (
                  <Link
                    key={com.id}
                    href={com.href}
                    className=" text-sm text-gray-700 transition hover:opacity-75"
                  >
                    {com.title}
                  </Link>
                ))}
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <p className="font-medium text-gray-900">Helpful Links</p>
              <div className="gap-3 mt-4 flex flex-col">
                {helpfulLinks.map((com) => (
                  <Link
                    key={com.id}
                    href={com.href}
                    className=" text-sm text-gray-700 transition hover:opacity-75"
                  >
                    {com.title}
                  </Link>
                ))}
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <p className="font-medium text-gray-900">Payment Methods</p>
              <div className="gap-3 mt-4 flex flex-col">
                {paymentLinks.map((pay) => (
                  <div
                    key={pay.id}
                    className="border-slate-300 border rounded-md w-20 "
                  >
                    <Image
                      src={pay.image}
                      width={100}
                      height={100}
                      alt="Payment Logo"
                      className="h-9 w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>

            <Socials />
          </div>
        </div>

        <div className="mt-4 border-t border-gray-100 pt-4">
          <div className="sm:flex sm:justify-between">
            <p className="text-xs text-gray-500">
              &copy; 2024. Sowgreen Farms. All rights reserved.
            </p>

            <div className="mt-8 flex flex-wrap justify-start gap-4 text-xs sm:mt-0 lg:justify-end">
              {footerLeftLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="text-gray-500 transition hover:opacity-75"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
