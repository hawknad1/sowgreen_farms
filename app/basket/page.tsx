import Basket from "@/components/Basket";
import CheckoutBox from "@/components/CheckoutBox";
import Coupon from "@/components/Coupon";
import OrderSummery from "@/components/OrderSummery";
import PaymentMethod from "@/components/PaymentMethod";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import React from "react";

const BasketPage = () => {
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

      <div className="lg:flex items-center">
        <Basket />
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
  );
};

export default BasketPage;
