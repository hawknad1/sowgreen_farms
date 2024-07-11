"use client";
import PaginationButtons from "@/components/PaginationButtons";
import ProductCard from "@/components/cards/ProductCard";
import GlobalApi from "@/utils/GlobalApi";
import React, { useEffect, useState } from "react";

interface ProductProps {
  data: any;
}

const Products: React.FC<ProductProps> = ({ data }) => {
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    getProductList();
  }, []);

  const getProductList = () => {
    GlobalApi.getProduct().then((res: any) => {
      setAllProducts(res.data.data);
    });
  };

  return (
    <main className="container mx-auto py-8 flex-1">
      <div className="flex items-center flex-col gap-8">
        <h4 className="text-3xl font-bold text-center">
          Organic Fresh Farm Produce
        </h4>
        <div>
          <PaginationButtons />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6 ">
          {allProducts.map((card, index) => (
            <ProductCard data={card} key={index} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Products;
