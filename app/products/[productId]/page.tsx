"use client";
import ProductDetailCard from "@/components/ProductDetailCard";
import LoadProductDetail from "@/components/loading/LoadProductDetail";
import GlobalApi from "@/utils/GlobalApi";
import { useEffect, useState } from "react";

const ProductDetailPage = ({ params }: { params: { productId: string } }) => {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductDetails();
  }, []);

  const getProductDetails = () => {
    GlobalApi.getProductbyId(params.productId).then((res: any) => {
      setProduct(res.data.data);
      setLoading(false);
    });
  };

  if (loading) return <LoadProductDetail />;

  return (
    <div>
      <ProductDetailCard product={product} />
    </div>
  );
};

export default ProductDetailPage;
