"use client"

import Image from "next/image"
import EditProduct from "./products/EditProduct"
import DeleteProductDialog from "./products/DeleteProductDialog"
import AddImage from "./AddImage"
import { Product } from "@/types"
import { useRouter } from "next/navigation"
import { Separator } from "../ui/separator"
import { formatCurrency } from "@/lib/utils"
import { Badge } from "../ui/badge"
import { useState } from "react"
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid"

interface Props {
  product: Product
}

const AdminProductDetailCard = ({ product }: Props) => {
  const [index, setIndex] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)

  const router = useRouter()

  const handleImageManagerRedirect = () => {
    router.push(`/admin/products/add-image/${product.id}`)
  }

  // Ensure product exists before rendering or performing calculations
  if (!product) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    )
  }

  const amount = product.variants[0]?.price * product.quantity
  const formattedAmount = formatCurrency(amount, "GHS")
  const formattedPrice = formatCurrency(product.variants[0]?.price, "GHS")

  return (
    <div className="grid grid-cols-1 px-6 lg:grid-cols-2 gap-x-8 ">
      <div>
        <h3 className="text-2xl font-bold text-center lg:text-start mb-4">
          {product.title}
        </h3>
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
      </div>

      <div className="mt-12">
        {/* Product Details Section */}
        <div className="w-full">
          <div className="space-y-4">
            <p className="text-sm text-neutral-400">
              {`Category -> ${product.categoryName}`}
            </p>
            <h3 className="text-3xl font-bold">{product.title}</h3>

            <div className="flex items-center space-x-2">
              <p className="text-2xl font-bold text-black">{formattedPrice}</p>
              {product.discount > 0 && (
                <p className="bg-black text-white text-xs font-medium px-2 py-1 rounded-full">
                  {product.discount}% Off
                </p>
              )}
              <p
                className={`${
                  product.isInStock === "in-stock"
                    ? "bg-emerald-500/15 text-emerald-500"
                    : "bg-gray-500/15 text-gray-500"
                } px-3.5 py-0.5 rounded-full font-medium text-sm`}
              >
                {product.isInStock === "in-stock" ? "In Stock" : "Out of Stock"}
              </p>
            </div>

            <div className="border border-slate-200 rounded-lg p-2">
              <div className="flex justify-between py-2">
                <p className="font-semibold">Quantity</p>
                <p className="font-bold">{product.quantity}</p>
              </div>
              <Separator />

              <div className="mt-1">
                {/* Header with chevron for toggling */}
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  <h3 className="text-lg font-semibold">Variants</h3>
                  {isExpanded ? (
                    <ChevronUpIcon className="h-5 w-5" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5" />
                  )}
                </div>

                {/* Variants list (conditionally rendered) */}
                {isExpanded && (
                  <div className="mt-4 flex flex-col gap-4">
                    {product?.variants?.map((v, index) => (
                      <div
                        key={index}
                        className="flex gap-x-16 justify-between border-b pb-2"
                      >
                        <div className="flex justify-between w-full">
                          <p className="font-medium">Price:</p>
                          <p>{formatCurrency(v.price, "GHS")}</p>
                        </div>
                        -
                        <div className="flex justify-between w-full">
                          <p className="font-medium">Weight:</p>
                          <div className="flex items-center">
                            <p>{v.weight}</p>
                            <p>{v.unit}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Separator />
              <div className="flex justify-between py-2">
                <p className="font-semibold">Total Amount</p>
                <p className="font-bold">{formattedAmount}</p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-2">
              <p className="font-semibold text-sm py-2">Description</p>
              <p className="text-sm text-neutral-600">{product.description}</p>
            </div>

            <div className="flex justify-between gap-x-4">
              <EditProduct product={product} />
              <AddImage product={product} />
              <DeleteProductDialog product={product} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminProductDetailCard
