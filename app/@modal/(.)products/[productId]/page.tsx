"use client";

import ProductDetailPopUp from "@/components/modals/ProductDetailPopUp";
import LoadPopUpProductDetail from "@/components/loading/LoadPopUpProductDetail";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/typings/productTypings";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const ProductInterception = ({ params }: { params: { productId: string } }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getProductDetails() {
      try {
        const res = await fetch(`/api/products/${params.productId}`, {
          method: "GET",
          cache: "no-store",
        });

        if (res.ok) {
          const product = await res.json();
          setProduct(product);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getProductDetails();
  }, [params.productId]);

  function onDismiss() {
    router.back();
  }

  return (
    <Dialog
      open
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onDismiss();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add To Basket</DialogTitle>
        </DialogHeader>
        {loading ? (
          <LoadPopUpProductDetail />
        ) : (
          <ProductDetailPopUp product={product} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductInterception;
