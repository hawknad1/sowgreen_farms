"use client"
import Image from "next/image"
import { Button } from "../../ui/button"
import {
  HeartIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline"
import Ratings from "../../Ratings"
import { useRouter } from "next/navigation"
import AddToCart from "../../basket/AddToCart"
import { useCartStore } from "@/store"
import { Product } from "@/types"
import { addTax } from "@/lib/addTax"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import React, { useState, useEffect } from "react"

interface Props {
  product: Product
}

const ProductDetailCard = ({ product }: Props) => {
  const router = useRouter()
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null)
  const [selectedWeight, setSelectedWeight] = useState<number | null>(null)

  // useEffect(() => {
  //   if (product?.weightsAndPrices?.length) {
  //     setSelectedPrice(product.weightsAndPrices[0].price)
  //     setSelectedWeight(product.weightsAndPrices[0].weight)
  //   }
  // }, [product])

  const handleWeightChange = (price: number, weight: number) => {
    setSelectedPrice(price)
    setSelectedWeight(weight)
  }

  // const taxedPrice = formatCurrency(addTax(product?.price), "GHS")
  const taxedPrice = formatCurrency(product?.price, "GHS")

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 place-items-center">
        <div className="flex flex-col ">
          <h3 className="text-2xl flex justify-start font-bold mb-4 w-full">{`${product?.categoryName} / ${product?.title}`}</h3>

          <div className="flex flex-col gap-3">
            <div className="flex justify-end relative">
              <Image
                src={product?.imageUrl}
                alt={product?.title}
                width={400}
                height={400}
                className="bg-gray-100 object-contain w-80 h-80 lg:w-[400px] lg:h-[400px] p-2 rounded-2xl"
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

            <div className="flex gap-2 justify-end items-center">
              <div className="bg-slate-100 h-20 w-20 lg:h-24 lg:w-[95px] flex justify-center rounded-xl p-1.5">
                <Image
                  src={product?.imageUrl}
                  alt={product?.title}
                  width={90}
                  height={90}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-screen max-w-sm lg:max-w-3xl">
          <div className="flex flex-col gap-4 mt-11">
            <p className="text-neutral-400 text-sm">
              {`Categories -> ${product?.categoryName}`}
            </p>
            <div className="flex items-center">
              <h3 className="text-3xl font-bold">{product?.title}</h3>
            </div>
            {/* ratings */}
            <Ratings />
            <div className="flex items-center space-x-2">
              {/* Display the selected price */}
              <div className="flex items-center gap-x-1.5">
                <h3 className="text-2xl font-bold text-black">{taxedPrice}</h3>
                {product?.weight && (
                  <span className="text-neutral-500 text-xl font-semibold">{`/ ${
                    product?.weight < 1
                      ? product?.weight * 1000
                      : product?.weight
                  }${product?.unit}`}</span>
                )}
              </div>
            </div>
            <div className="flex flex-col max-w-lg">
              <p className="text-sm font-semibold mb-2">Descriptions</p>
              <p className="text-sm text-neutral-600 tracking-wide">
                {product?.description}
              </p>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <AddToCart
                product={product}
                selectedPrice={selectedPrice}
                selectedWeight={selectedWeight}
              />
              <Button
                disabled={product?.isInStock === "out-of-stock"}
                onClick={() => router.push("/checkout")}
                className="rounded-full p-0 px-4"
              >
                Checkout Now
              </Button>
            </div>

            <div className="flex items-center gap-5 mt-2">
              <div className="flex items-center gap-1 hover:text-gray-400 cursor-pointer">
                <HeartIcon className="h-5 w-5" />
                <p className="text-sm font-medium">Add To Favorites</p>
              </div>
              <div className="flex items-center gap-1 hover:text-gray-400 cursor-pointer">
                <ClipboardDocumentListIcon className="h-5 w-5" />
                <p className="text-sm font-medium">Add To List</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailCard
