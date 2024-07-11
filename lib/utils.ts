// import { Product } from "@/typings/productTypings";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchProduct(productId: any) {
  const res = await fetch(`http://localhost:1337/api/products/${productId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function getCategories() {
  try {
    const res = await fetch("http://localhost:3000/api/categories", {
      cache: "no-store",
      method: "GET",
    });
    if (res.ok) {
      const categories = await res.json();
      return categories;
    }
  } catch (error) {
    console.log(error);
  }
  return null;
}

export async function getCategory(params: string) {
  try {
    const res = await fetch(`http://localhost:3000/api/categories/${params}`);
    if (res.ok) {
      const category = await res.json();
      return category;
    }
  } catch (error) {
    console.log(error);
  }
  return null;
}
