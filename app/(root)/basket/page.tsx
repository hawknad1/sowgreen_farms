"use client";
import Basket from "@/components/basket/Basket";
import CheckoutBox from "@/components/checkout/CheckoutBox";
import Coupon from "@/components/checkout/Coupon";
import OrderSummery from "@/components/checkout/OrderSummery";
import PaymentMethod from "@/components/checkout/PaymentMethod";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import React from "react";

const BasketPage = () => {
  const router = useRouter();

  return (
    <div className="w-full p-10 max-w-7xl mx-auto">
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <ShoppingCartIcon className="h-10 w-10" />
          <h1 className="text-3xl font-bold">Your Shopping Cart</h1>
        </div>
        <p className="mt-2">
          Review the items in your cart and checkout when ready!
        </p>
      </div>
      <div className="flex items-center justify-between ">
        <div className="mt-8">
          <div className="overflow-scroll scrollbar-hide w-fit h-[600px]">
            <Basket />
          </div>
          <div className="hidden lg:inline-flex items-center gap-4 mt-8">
            <div
              onClick={() => router.back()}
              className="flex items-center cursor-pointer"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <p className="text-sm font-semibold">Back</p>
            </div>
            <Button variant="destructive">Cancel Order</Button>
          </div>
        </div>

        <div className="lg:flex items-center">
          <div className="hidden lg:flex flex-col gap-4 mt-5">
            <CheckoutBox>
              <Coupon />
            </CheckoutBox>
            <CheckoutBox>
              <OrderSummery />
            </CheckoutBox>
            <CheckoutBox>
              <PaymentMethod />
            </CheckoutBox>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasketPage;
