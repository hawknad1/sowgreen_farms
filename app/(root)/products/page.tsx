"use client";
import ProductCard from "@/components/cards/product/ProductCard";
import ProductsSkeleton from "@/components/skeletons/ProductsSkeleton";
import PaginationButtons from "@/components/sort/PaginationButtons";
import { Button } from "@/components/ui/button";
import { useCategoryState } from "@/hooks/state";
import React, { useEffect, useState } from "react";

const Products = () => {
  const [allProducts, setAllProducts] = useState([]);
  const { selected } = useCategoryState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getProducts() {
      try {
        const res = await fetch("/api/products", {
          method: "GET",
          cache: "no-store",
        });
        if (res.ok) {
          const products = await res.json();
          setAllProducts(products);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getProducts();
  }, []);

  return (
    <main className="container mx-auto py-8 flex-1">
      <div className="flex items-center flex-col gap-8">
        <h4 className="text-3xl font-bold text-center">
          Organic Fresh Farm Produce
        </h4>
        <div className=" w-full flex flex-col gap-5 max-w-[1080px]">
          <div className="flex items-center w-full">
            <h2 className="text-3xl font-bold">Category / </h2>
            <h2 className="text-2xl mt-1 font-bold">{selected}</h2>
          </div>
          <PaginationButtons />
        </div>
        {isLoading ? (
          <ProductsSkeleton />
        ) : (
          <div className="">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {allProducts.map((card) => (
                <ProductCard data={card} key={card.id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Products;
