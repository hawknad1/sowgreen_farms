"use client";
import React from "react";
import { Separator } from "../ui/separator";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const PaymentMethod = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold divide-y-4 divide-black ">
        Payment Method
      </h2>
      <Separator className=" h-0.5" />
      <div className="flex items-center justify-between gap-2">
        <div className="bg-slate-100/70 px-2 rounded-lg cursor-pointer">
          <Image
            src="/images/mtn.png"
            alt="Mtn logo"
            width={50}
            height={50}
            className="h-10 w-12 object-contain"
          />
        </div>
        <div className="bg-slate-100/70 px-2 rounded-lg cursor-pointer">
          <Image
            src="/images/mastercard.png"
            alt="Mtn logo"
            width={50}
            height={50}
            className="h-10 w-12 object-contain"
          />
        </div>
        <div className="bg-slate-100/70 px-2 rounded-lg cursor-pointer">
          <Image
            src="/images/visa.png"
            alt="Mtn logo"
            width={50}
            height={50}
            className="h-10 w-12 object-contain"
          />
        </div>
        <div className="bg-slate-100/70 px-2 rounded-lg cursor-pointer">
          <Image
            src="/images/paypal.png"
            alt="Mtn logo"
            width={50}
            height={50}
            className="h-10 w-12 object-contain"
          />
        </div>
      </div>
      <Button onClick={() => router.push("/checkout")}>Checkout</Button>
    </div>
  );
};

export default PaymentMethod;
