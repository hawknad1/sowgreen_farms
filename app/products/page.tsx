"use client";
import PaginationButtons from "@/components/PaginationButtons";
import ProductCard from "@/components/cards/ProductCard";
import React, { useEffect, useState } from "react";

const Products = () => {
  const [allProducts, setAllProducts] = useState([]);

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
        <div>
          <PaginationButtons />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {allProducts.map((card) => (
            <ProductCard data={card} key={card.id} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Products;
