"use client";
import ProductCard from "@/components/cards/ProductCard";
import { Product } from "@/typings/productTypings";
import React, { useEffect, useState } from "react";

type Props = {
  searchParams: {
    q: string;
  };
};

const Category = ({ searchParams: { q } }: Props) => {
  const [productsByCategory, setProductsByCategory] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const catProducts = productsByCategory[0]?.products;
  useEffect(() => {
    const fetchProductsByCategory = async (catName: string) => {
      try {
        const res = await fetch(`/api/categories/${catName}`);
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        const data = await res.json();
        setProductsByCategory(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProductsByCategory(q);
  }, []);

  return (
    <main className="container mx-auto py-8 my-6 flex-1">
      <div className="flex flex-col items-start gap-3">
        <h3 className="text-2xl font-bold ml-4">
          Search results for <span>{q.toLowerCase()}</span>
        </h3>
        <div className="flex gap-5 p-4 w-max">
          {catProducts?.map((product: Product) => (
            <ProductCard key={product.id} data={product} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Category;
