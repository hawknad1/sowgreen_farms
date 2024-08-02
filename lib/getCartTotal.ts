import { Product } from "@/typings/productTypings";

export function getCartTotal(products: Product[]): string {
  const total = products.reduce(
    (accumulator: number, currentProduct: Product) =>
      accumulator + currentProduct.price,
    0
  );
  return total.toFixed(2);
}

// return `GHC ${total.toFixed(2)}`;
