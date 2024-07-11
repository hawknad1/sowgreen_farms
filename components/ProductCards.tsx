"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./cards/ProductCard";
import { productCard } from "@/constants";
import GlobalApi from "@/utils/GlobalApi";

const ProductCards = () => {
  const [productList, setproductList] = useState([]);
  console.log(productList);

  useEffect(() => {
    getProductList();
  }, []);

  const getProductList = () => {
    GlobalApi.getProduct().then((res: any) => {
      setproductList(res.data.data);
    });
  };

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex space-x-4 p-4 w-max ">
        {productList.map((card, index) => (
          <ProductCard data={card} key={index} />
        ))}
      </div>
    </div>
  );
};

export default ProductCards;
