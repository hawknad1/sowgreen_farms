"use client";
import { useCartStore } from "@/store";
import { Product } from "@/typings/productTypings";
import React from "react";
import { Button } from "../ui/button";
import RemoveFromCart from "./RemoveFromCart";

const AddToCart = ({ product }: { product: Product }) => {
  const { cart, addToCart } = useCartStore((state) => ({
    cart: state.cart,
    addToCart: state.addToCart,
  }));

  console.log(cart);
  const howManyInCart = cart.filter(
    (item: Product) => item.id === product.id
  ).length;

  console.log("how many in the cart", howManyInCart);

  const handleAdd = () => {
    console.log("Adding to cart", product);
    addToCart(product);
  };

  if (howManyInCart > 0) {
    return (
      <div className="flex space-x-2 items-center">
        <RemoveFromCart product={product} />
        <span>{howManyInCart}</span>
        <Button onClick={handleAdd}>+</Button>
      </div>
    );
  }
  return <Button onClick={handleAdd}>Add To Cart</Button>;
};

export default AddToCart;
