"use client";
import { getCartTotal } from "@/lib/getCartTotal";
import groupById from "@/lib/groupById";
import { useCartStore } from "@/store";
import Image from "next/image";
import React, { useState } from "react";
import AddToCart from "./AddToCart";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const Basket = () => {
  const [isLoading, setIsLoading] = useState(false);
  const cart = useCartStore((state) => state.cart);
  const grouped = groupById(cart);
  const basketTotal = getCartTotal(cart);
  const router = useRouter();

  return (
    <div className="w-fit">
      <ul className="divide-y-[2px] w-fit">
        {Object.keys(grouped).map((id) => {
          const item = grouped[id][0];
          const total = getCartTotal(grouped[id]);

          return (
            <li
              key={id}
              className="p-5 my-2 flex items-center justify-between  "
            >
              {item.imageUrl && (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  width={80}
                  height={80}
                  className="h-20 w-20 object-contain"
                />
              )}

              <div className="flex items-center space-x-4 pl-4">
                <div>
                  <p className="line-clamp-2 font-bold">{item.title}</p>
                  <div
                    dangerouslySetInnerHTML={{ __html: item.description }}
                    className="line-clamp-2 font-light text-sm mt-2 max-w-lg"
                  />
                </div>
                <div className="flex flex-col border rounded-md p-2 lg:p-5">
                  <AddToCart product={item} />
                  <p className="mt-4 font-bold text-right">{total}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-col lg:hidden justify-end p-5">
        <p className="font-bold text-xl lg:text-2xl text-right mb-5">
          Total: {basketTotal}
        </p>
        <Button onClick={() => router.push("/checkout")}>Checkout</Button>
      </div>
    </div>
  );
};

export default Basket;