"use client"
import { Badge } from "@/components/ui/badge"
import { Product } from "@/types"
import Image from "next/image"
import React, { useState } from "react"

interface ProductImagesProps {
  product: Product
}

const ProductImages = ({ product }: ProductImagesProps) => {
  const [index, setIndex] = useState(0)
  return (
    <div>
      <div className="h-[500px] relative">
        <Image
          src={product?.images[index]?.url}
          alt=""
          fill
          sizes="50vw"
          className="object-contain rounded-md bg-gray-100"
        />
        <div className="absolute right-5 top-3">
          {product?.isInStock === "out-of-stock" ? (
            <Badge className="bg-gray-500/25 text-gray-500 hover:disabled:pointer-events-none">
              Out of stock
            </Badge>
          ) : product?.discount ? (
            <Badge className="bg-red-500/85">
              <p className="text-[10px] text-white tracking-wide">
                {product?.discount}% OFF
              </p>
            </Badge>
          ) : null}
        </div>
      </div>
      <div className="flex justify-between gap-4">
        {product?.images.map((img, i) => (
          <div
            className="w-1/4 h-32 relative gap-4 mt-8 cursor-pointer bg-gray-100 rounded-md"
            key={img.publicId}
            onClick={() => setIndex(i)}
          >
            <Image
              src={img.url}
              alt=""
              fill
              sizes="30vw"
              className="object-contain rounded-md"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductImages
