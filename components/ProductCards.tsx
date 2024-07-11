"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./cards/ProductCard";
import HomeProductSkeleton from "./skeletons/HomeProductSkeleton";

const ProductCards = () => {
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  console.log(productList);

  useEffect(() => {
    async function getProductList() {
      try {
        const res = await fetch("/api/products", {
          method: "GET",
          cache: "no-store",
        });

        if (res.ok) {
          const products = await res.json();
          setProductList(products);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getProductList();
  }, []);

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <>
        {isLoading ? (
          <HomeProductSkeleton />
        ) : (
          <div className="flex space-x-4 p-4 w-max ">
            {productList.map((card) => (
              <ProductCard data={card} key={card.id} />
            ))}
          </div>
        )}
      </>
    </div>
  );
};

export default ProductCards;
