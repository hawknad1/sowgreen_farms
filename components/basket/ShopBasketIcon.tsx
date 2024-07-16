"use client";
import { useCartStore } from "@/store";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import React from "react";

const ShopBasketIcon = () => {
  const router = useRouter();
  const cart = useCartStore((state) => state.cart);
  const quantity = cart.length;
  return (
    <div
      onClick={() => router.push("/basket")}
      className="cursor-pointer relative"
    >
      <ShoppingCartIcon className="size-6" />
      {quantity <= 0 ? (
        ""
      ) : (
        <div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center text-sm bg-red-400 rounded-full text-white">
          {quantity}
        </div>
      )}
    </div>
  );
};

export default ShopBasketIcon;
