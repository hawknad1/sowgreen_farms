"use client";

import ProductDetailCard from "@/components/ProductDetailCard";
import ProductDetailPopUp from "@/components/ProductDetailPopUp";
import LoadPopUpProductDetail from "@/components/loading/LoadPopUpProductDetail";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import GlobalApi from "@/utils/GlobalApi";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Props {
  product: any;
}

const ProductInterception = ({ params }: { params: { productId: string } }) => {
  const [product, setProduct] = useState([]);
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
          {/* <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription> */}
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
