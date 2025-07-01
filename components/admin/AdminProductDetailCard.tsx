// "use client"

// import Image from "next/image"
// import EditProduct from "./products/EditProduct"
// import DeleteProductDialog from "./products/DeleteProductDialog"
// import AddImage from "./AddImage"
// import { Product } from "@/types"
// import { useRouter } from "next/navigation"
// import { Separator } from "../ui/separator"
// import { formatCurrency } from "@/lib/utils"
// import { Badge } from "../ui/badge"
// import { useState } from "react"
// import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid"
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "../ui/breadcrumb"

// interface Props {
//   product: Product
// }

// const AdminProductDetailCard = ({ product }: Props) => {
//   const [index, setIndex] = useState(0)
//   const [isExpanded, setIsExpanded] = useState(false)

//   const router = useRouter()

//   const handleImageManagerRedirect = () => {
//     router.push(`/admin/products/add-image/${product.id}`)
//   }

//   // Ensure product exists before rendering or performing calculations
//   if (!product) {
//     return (
//       <div className="w-full h-screen flex justify-center items-center">
//         <span className="loading loading-dots loading-lg"></span>
//       </div>
//     )
//   }

//   const amount = product.variants[0]?.price * product.quantity
//   const formattedAmount = formatCurrency(amount, "GHS")
//   const formattedPrice = formatCurrency(product.variants[0]?.price, "GHS")

//   return (
//     <div className="grid grid-cols-1 px-6 lg:grid-cols-2 gap-x-8 ">
//       <div>
//         <Breadcrumb className="mb-4 sm:mb-6">
//           <BreadcrumbList>
//             <BreadcrumbItem>
//               <BreadcrumbLink href="/">Home</BreadcrumbLink>
//             </BreadcrumbItem>
//             <BreadcrumbSeparator />
//             <BreadcrumbItem>
//               <BreadcrumbLink href="/products">Products</BreadcrumbLink>
//             </BreadcrumbItem>
//             <BreadcrumbSeparator />
//             <BreadcrumbItem>
//               <BreadcrumbPage className="line-clamp-1">
//                 {product.title}
//               </BreadcrumbPage>
//             </BreadcrumbItem>
//           </BreadcrumbList>
//         </Breadcrumb>
//         <div>
//           <div className="h-[500px] relative">
//             <Image
//               src={product?.images[index]?.url}
//               alt=""
//               fill
//               sizes="50vw"
//               className="object-contain rounded-md bg-gray-100"
//             />
//             <div className="absolute right-5 top-3">
//               {product?.isInStock === "out-of-stock" ? (
//                 <Badge className="bg-gray-500/25 text-gray-500 hover:disabled:pointer-events-none">
//                   Out of stock
//                 </Badge>
//               ) : product?.discount ? (
//                 <Badge className="bg-red-500/85">
//                   <p className="text-[10px] text-white tracking-wide">
//                     {product?.discount}% OFF
//                   </p>
//                 </Badge>
//               ) : null}
//             </div>
//           </div>
//           <div className="flex justify-between gap-4">
//             {product?.images.map((img, i) => (
//               <div
//                 className="w-1/4 h-32 relative gap-4 mt-8 cursor-pointer bg-gray-100 rounded-md"
//                 key={img.publicId}
//                 onClick={() => setIndex(i)}
//               >
//                 <Image
//                   src={img.url}
//                   alt=""
//                   fill
//                   sizes="30vw"
//                   className="object-contain rounded-md"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="mt-12 lg:mt-0">
//         {/* Product Details Section */}
//         <div className="w-full">
//           <div className="space-y-4">
//             <h3 className="text-3xl font-bold">{product.title}</h3>

//             <div className="flex items-center space-x-2">
//               <p className="text-2xl font-bold text-black">{formattedPrice}</p>
//               {product.discount > 0 && (
//                 <p className="bg-black text-white text-xs font-medium px-2 py-1 rounded-full">
//                   {product.discount}% Off
//                 </p>
//               )}
//               <p
//                 className={`${
//                   product.isInStock === "in-stock"
//                     ? "bg-emerald-500/15 text-emerald-500"
//                     : "bg-gray-500/15 text-gray-500"
//                 } px-3.5 py-0.5 rounded-full font-medium text-sm`}
//               >
//                 {product.isInStock === "in-stock" ? "In Stock" : "Out of Stock"}
//               </p>
//             </div>

//             <div className="border border-slate-200 rounded-lg p-2">
//               <div className="flex justify-between py-2">
//                 <p className="font-semibold">Quantity</p>
//                 <p className="font-bold">{product.quantity}</p>
//               </div>
//               <Separator />

//               <div className="mt-1">
//                 {/* Header with chevron for toggling */}
//                 <div
//                   className="flex items-center justify-between cursor-pointer"
//                   onClick={() => setIsExpanded(!isExpanded)}
//                 >
//                   <h3 className="text-lg font-semibold">Variants</h3>
//                   {isExpanded ? (
//                     <ChevronUpIcon className="h-5 w-5" />
//                   ) : (
//                     <ChevronDownIcon className="h-5 w-5" />
//                   )}
//                 </div>

//                 {/* Variants list (conditionally rendered) */}
//                 {isExpanded && (
//                   <div className="mt-4 flex flex-col gap-4">
//                     {product?.variants?.map((v, index) => (
//                       <div
//                         key={index}
//                         className="flex gap-x-16 justify-between border-b pb-2"
//                       >
//                         <div className="flex justify-between w-full">
//                           <p className="font-medium">Price:</p>
//                           <p>{formatCurrency(v.price, "GHS")}</p>
//                         </div>
//                         -
//                         <div className="flex justify-between w-full">
//                           <p className="font-medium">Weight:</p>
//                           <div className="flex items-center">
//                             <p>{v.weight}</p>
//                             <p>{v.unit}</p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//               <Separator />
//               <div className="flex justify-between py-2">
//                 <p className="font-semibold">Total Amount</p>
//                 <p className="font-bold">{formattedAmount}</p>
//               </div>
//             </div>

//             <div className="border border-slate-200 rounded-lg p-2">
//               <p className="font-semibold text-sm py-2">Description</p>
//               <p className="text-sm text-neutral-600">{product.description}</p>
//             </div>

//             <div className="flex justify-between gap-x-4">
//               <EditProduct product={product} />
//               <AddImage product={product} />
//               <DeleteProductDialog product={product} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AdminProductDetailCard

"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid"
import { Product } from "@/types"
import { formatCurrency } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { Button } from "../ui/button"
import EditProduct from "./products/EditProduct"
import DeleteProductDialog from "./products/DeleteProductDialog"
import AddImage from "./AddImage"

interface Props {
  product: Product
}

const AdminProductDetailCard = ({ product }: Props) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isVariantsExpanded, setIsVariantsExpanded] = useState(false)
  const router = useRouter()

  if (!product) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    )
  }

  const totalValue = product.variants[0]?.price * product.quantity
  const formattedTotalValue = formatCurrency(totalValue, "GHS")
  const formattedPrice = formatCurrency(product.variants[0]?.price, "GHS")

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      {/* <div className="mb-6 sm:mb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="hover:text-primary">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/admin/products"
                className="hover:text-primary"
              >
                Products
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-primary line-clamp-1">
                {product.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div> */}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Product Images Section */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-50 shadow-sm">
            <Image
              src={product?.images[activeImageIndex]?.url}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
            />

            {/* Stock/Discount Badge */}
            <div className="absolute right-3 top-3">
              {product?.isInStock === "out-of-stock" ? (
                <Badge variant="outline" className="bg-gray-100 text-gray-600">
                  Out of stock
                </Badge>
              ) : product?.discount ? (
                <Badge className="bg-red-500 hover:bg-red-600">
                  {product?.discount}% OFF
                </Badge>
              ) : null}
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {/* <div className="grid grid-cols-4 gap-3">
            {product?.images.map((img, index) => (
              <button
                key={img.publicId}
                onClick={() => setActiveImageIndex(index)}
                className={`relative aspect-square overflow-hidden rounded-md transition-all ${
                  activeImageIndex === index
                    ? "ring-2 ring-primary"
                    : "opacity-90 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 25vw, 12.5vw"
                  className="object-cover"
                />
              </button>
            ))}
          </div> */}
          <div className="grid grid-cols-4 gap-3">
            {Array.isArray(product?.images) && product.images.length > 0 ? (
              product.images.map((img, index) => (
                <button
                  key={img.publicId}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative aspect-square overflow-hidden rounded-md transition-all ${
                    activeImageIndex === index
                      ? "ring-2 ring-primary"
                      : "opacity-90 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 25vw, 12.5vw"
                    className="object-cover"
                  />
                </button>
              ))
            ) : (
              <p>No images available</p>
            )}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="space-y-6">
          {/* Title and Pricing */}
          <div className="space-y-3">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {product.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3">
              <p className="md:text-2xl text-xl font-semibold text-gray-900">
                {formattedPrice}
              </p>

              {product.discount > 0 && (
                <Badge className="bg-green-600 hover:bg-green-700">
                  {product.discount}% Off
                </Badge>
              )}

              <Badge
                variant={
                  product.isInStock === "in-stock" ? "default" : "secondary"
                }
                className={
                  product.isInStock === "in-stock"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                }
              >
                {product.isInStock === "in-stock" ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>
          </div>

          {/* Product Summary Card */}
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Quantity
                </p>
                <p className="text-lg font-semibold">{product.quantity}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Value
                </p>
                <p className="text-lg font-semibold">{formattedTotalValue}</p>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Variants Section */}
            <div className="space-y-3">
              <button
                onClick={() => setIsVariantsExpanded(!isVariantsExpanded)}
                className="flex w-full items-center justify-between"
              >
                <h3 className="text-lg font-semibold">Product Variants</h3>
                {isVariantsExpanded ? (
                  <ChevronUpIcon className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />
                )}
              </button>

              {isVariantsExpanded && (
                <div className="space-y-4">
                  {product?.variants?.map((variant, index) => (
                    <div key={index} className="rounded-md border p-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Price
                          </p>
                          <p>{formatCurrency(variant.price, "GHS")}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Weight
                          </p>
                          <p>
                            {variant.weight} {variant.unit}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold">Description</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <EditProduct product={product} />
            <div className="flex justify-between gap-x-6 w-full">
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
