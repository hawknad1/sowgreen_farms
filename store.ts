import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Product } from "./typings/productTypings";
// import type {} from "@redux-devtools/extension"; // required for devtools typing

interface CartState {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (product: Product) => void;
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        cart: [],
        addToCart: (product) =>
          set((state) => ({ cart: [...state.cart, product] })),
        removeFromCart: (product) => {
          set((state) => {
            const productToRemoveIndex = state.cart.findIndex(
              (p) => p.id === product.id
            );

            if (productToRemoveIndex === -1) {
              return state;
            }

            const newCart = [...state.cart];
            newCart.splice(productToRemoveIndex, 1);
            return { cart: newCart };
          });
        },
      }),
      {
        name: "shopping-cart-storage",
      }
    )
  )
);
