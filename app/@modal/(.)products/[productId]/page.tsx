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
    getProductDetails();
  }, []);

  const getProductDetails = () => {
    GlobalApi.getProductbyId(params.productId).then((res: any) => {
      setProduct(res.data.data);
      setLoading(false);
    });
  };

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
