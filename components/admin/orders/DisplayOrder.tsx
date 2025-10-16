import Image from "next/image"
import { useRouter } from "next/navigation"
import React from "react"

// const DisplayOrder = ({ orders }: { orders: Order }) => {
//   const products = orders?.products
//   const router = useRouter()

//   if (!products?.length) {
//     return <p>No products available in this order.</p>
//   }

//   return (
//     <div>
//       {products?.map((ord: ProductOrder) => {
//         return (
//           <div
//             key={ord.productId}
//             className={`flex items-center w-full mb-4 ${
//               ord.available === false ? "opacity-50" : ""
//             }`}
//           >
//             <div
//               className="bg-gray-50 rounded-md p-2 cursor-pointer"
//               onClick={() => router.push(`/products/${ord.product.id}`)}
//             >
//               <Image
//                 src={ord.product.imageUrl || ord?.product?.images[0]?.url}
//                 alt={ord.product.title}
//                 width={80}
//                 height={80}
//                 className={`h-16 w-16 object-contain rounded-md ${
//                   ord.available === false ? "grayscale" : ""
//                 }`}
//               />
//             </div>
//             <div className="flex justify-between items-center w-full ml-4">
//               <div
//                 className="flex flex-col flex-grow cursor-pointer"
//                 onClick={() => router.push(`/products/${ord.product.id}`)}
//               >
//                 <p
//                   className={`text-sm font-semibold line-clamp-2 ${
//                     ord.available === false ? "text-gray-500" : ""
//                   }`}
//                 >
//                   {ord.product?.title}
//                 </p>

//                 <p className="font-medium text-gray-600/65 text-sm">
//                   {formatCurrency(ord.price, "GHS")}
//                   {ord?.weight === null ? (
//                     ""
//                   ) : (
//                     <span className="text-sm text-neutral-400">
//                       {` / ${ord?.weight}${ord?.unit}`}
//                     </span>
//                   )}
//                 </p>
//               </div>
//               <div className="text-right space-y-1">
//                 <div className="text-sm text-neutral-600 space-x-2 flex flex-col">
//                   <span className="font-semibold">{`QTY : ${ord.quantity}`}</span>
//                   <span>{`Subtotal:  ${formatCurrency(
//                     parseFloat(ord?.quantityTotal),
//                     "GHS"
//                   )}`}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )
//       })}
//     </div>
//   )
// }

import { Store, Package } from "lucide-react"
import { Product, ProductOrder } from "@/types"
import { PartnerType } from "@/app/(auth)/admin/(same-layout)/management/partners/PartnerForm"

// interface Product {
//   id: string
//   title: string
//   imageUrl: string
//   images: Array<{ url: string }>
// }

// interface Partner {
//   id: string
//   brand: string
//   owner: string
//   phone: string
// }

// interface ProductOrder {
//   productId: string
//   product: Product
//   price: number
//   weight: number | null
//   unit: string | null
//   quantity: number
//   quantityTotal: string
//   available?: boolean
//   partner?: PartnerType
// }

interface Order {
  products: ProductOrder[]
}

// Helper function to format currency
const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

const DisplayOrder = ({ orders }: { orders: Order }) => {
  const products = orders?.products
  const router = useRouter()

  if (!products?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <Package className="w-12 h-12 mb-3 opacity-50" />
        <p>No products available in this order.</p>
      </div>
    )
  }

  // Group products by partner brand
  const groupedProducts = products.reduce(
    (acc, product) => {
      const partnerBrand = product.product?.partner?.brand || "Unknown Vendor"
      if (!acc[partnerBrand]) {
        acc[partnerBrand] = {
          partner: product.product?.partner,
          products: [],
        }
      }
      acc[partnerBrand].products.push(product)
      return acc
    },
    {} as Record<string, { partner?: PartnerType; products: ProductOrder[] }>
  )

  return (
    <div className="space-y-6">
      {Object.entries(groupedProducts).map(([brand, { partner, products }]) => (
        <div
          key={brand}
          className="border border-gray-200 rounded-lg overflow-hidden"
        >
          {/* Partner Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-gray-600" />
              <span className="font-semibold text-gray-800">{brand}</span>
              <span className="text-xs text-gray-500 ml-auto">
                {products.length} {products.length === 1 ? "item" : "items"}
              </span>
            </div>
          </div>

          {/* Products List */}
          <div className="divide-y divide-gray-100">
            {products.map((ord: ProductOrder) => (
              <div
                key={ord.productId}
                className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                  ord.available === false ? "opacity-50" : ""
                }`}
              >
                {/* Product Image */}
                <div
                  className="relative flex-shrink-0 bg-white rounded-lg border border-gray-200 p-2 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => router.push(`/products/${ord.product.id}`)}
                >
                  <Image
                    src={ord.product.imageUrl || ord?.product?.images[0]?.url}
                    alt={ord.product.title}
                    width={80}
                    height={80}
                    className={`h-20 w-20 object-contain rounded ${
                      ord.available === false ? "grayscale" : ""
                    }`}
                  />
                  {ord.available === false && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded">
                      <span className="text-xs font-semibold text-white bg-red-500 px-2 py-1 rounded">
                        Unavailable
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-grow min-w-0">
                  <div
                    className="cursor-pointer"
                    onClick={() => router.push(`/products/${ord.product.id}`)}
                  >
                    <h4
                      className={`font-medium text-sm mb-1 line-clamp-2 ${
                        ord.available === false
                          ? "text-gray-500"
                          : "text-gray-900"
                      }`}
                    >
                      {ord.product?.title}
                    </h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold text-gray-700">
                        {formatCurrency(ord.price, "GHS")}
                      </span>
                      {ord?.weight !== null && (
                        <span className="text-xs text-gray-400">
                          per {ord?.weight}
                          {ord?.unit}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity & Subtotal */}
                <div className="flex-shrink-0 text-right space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-md">
                    <span className="text-xs text-gray-600">Qty</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {ord.quantity}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {formatCurrency(parseFloat(ord?.quantityTotal), "GHS")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default DisplayOrder

// export default DisplayOrder
