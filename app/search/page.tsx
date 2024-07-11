"use client";
import ProductCards from "@/components/ProductCards";
import GlobalApi from "@/utils/GlobalApi";
import React, { useEffect, useState } from "react";

interface Props {
  searchParams: {
    q: string;
  };
}

const Search = ({ searchParams: { q } }: Props) => {
  const [result, setResult] = useState<any[]>([]);
  // const filteredSearch = result.filter(
  //   (search) => search.attributes?.title === q
  // );
  // console.log(filteredSearch);

  console.log(`Hello ${result}`);

  useEffect(() => {
    getProductList();
  }, []);

  const getProductList = () => {
    GlobalApi.getProduct().then((res: any) => {
      setResult(res.data.data);
    });
  };

  console.log(q);
  return (
    <div className="p-10">
      <h4 className="text-lg:3xl font-bold">{`Results for ${q}`}</h4>
      <div>
        <ProductCards />
      </div>
    </div>
  );
};

export default Search;
