"use client"

import Image from "next/image"
import EditProduct from "./products/EditProduct"
import { Product } from "@/types"
import { useRouter } from "next/navigation"
import { Separator } from "../ui/separator"
import { Button } from "../ui/button"
import { formatCurrency } from "@/lib/utils"
import toast from "react-hot-toast"
import DeleteProductDialog from "./products/DeleteProductDialog"
import AddImage from "./AddImage"

interface Props {
  product: Product
}

const AdminProductDetailCard = ({ product }: Props) => {
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

  const amount = product.price * product.quantity
  const formattedAmount = formatCurrency(amount, "GHS")
  const formattedPrice = formatCurrency(product.price, "GHS")

  return (
    <div className="container mx-auto py-8 h-screen overflow-scroll scrollbar-hide">
      <h3 className="text-2xl font-bold text-center lg:text-start mb-4">
        {product.categoryName} / {product.title}
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image Section */}
        <div className="flex flex-col w-full">
          <Image
            src={product.imageUrl}
            alt={product.title}
            width={400}
            height={400}
            className="bg-gray-100 object-contain w-[400px] h-[400px] p-2 rounded-2xl mx-auto"
          />
          <div>
            {Array.isArray(product.images) &&
              product.images.map((img) => (
                <Image
                  key={img.publicId}
                  src={img.url}
                  alt={img.publicId}
                  width={80}
                  height={80}
                  className="bg-gray-100 object-contain w-20 h-20 p-2 rounded-2xl mx-auto"
                />
              ))}
          </div>
        </div>

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
              <div className="flex justify-between py-2">
                <p className="font-semibold">Weight</p>
                <div className="flex items-center">
                  <p className="font-bold">{product.weight}</p>
                  <p className="font-bold">{product.unit}</p>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between py-2">
                <p className="font-semibold">Total Amount</p>
                <p className="font-bold">{formattedAmount}</p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-2">
              <p className="font-semibold text-sm">Description</p>
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
