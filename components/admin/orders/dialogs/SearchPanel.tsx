// "use client"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { formatCurrency } from "@/lib/utils"
// import { Product, ProductOrder } from "@/types"
// import { Loader2, SearchIcon } from "lucide-react"
// import Image from "next/image"
// import { useEffect, useState } from "react"

// // export const SearchPanel = ({
// //   onAddProduct,
// // }: {
// //   onAddProduct: (product: ProductOrder) => void
// // }) => {
// //   const [searchTerm, setSearchTerm] = useState("")
// //   const [products, setProducts] = useState<Product[]>([])
// //   const [isLoading, setIsLoading] = useState(false)

// //   useEffect(() => {
// //     const fetchProducts = async () => {
// //       if (searchTerm.trim().length < 2) {
// //         setProducts([])
// //         return
// //       }
// //       setIsLoading(true)
// //       try {
// //         const response = await fetch(`/api/products?query=${searchTerm}`)
// //         if (response.ok) {
// //           const data = await response.json()
// //           setProducts(
// //             data.products.filter((p: Product) => p.isInStock !== "out-of-stock")
// //           )
// //         }
// //       } catch (error) {
// //         console.error("Error fetching products:", error)
// //       } finally {
// //         setIsLoading(false)
// //       }
// //     }

// //     const debounceTimer = setTimeout(fetchProducts, 300)
// //     return () => clearTimeout(debounceTimer)
// //   }, [searchTerm])

// //   const handleAddProduct = (product: Product) => {
// //     if (!product.variants || product.variants.length === 0) return

// //     const variant = product.variants[0]
// //     const newProductOrder: ProductOrder = {
// //       id: `${product.id}-${Date.now()}`,
// //       productId: product.id,
// //       orderId: "",
// //       quantity: 1,
// //       price: variant.price,
// //       weight: variant.weight,
// //       unit: variant.unit,
// //       product: product,
// //       available: true,
// //     }

// //     onAddProduct(newProductOrder)
// //     setSearchTerm("")
// //     setProducts([])
// //   }

// //   return (
// //     <div className="space-y-3">
// //       <div className="relative">
// //         <Input
// //           placeholder="Search products..."
// //           value={searchTerm}
// //           onChange={(e) => setSearchTerm(e.target.value)}
// //           className="pl-9 h-9 sm:h-10"
// //         />
// //         <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
// //       </div>

// //       {isLoading ? (
// //         <div className="flex justify-center py-4">
// //           <Loader2 className="h-5 w-5 animate-spin" />
// //         </div>
// //       ) : (
// //         <div className="space-y-2">
// //           {products.map((product) => (
// //             <div
// //               key={product.id}
// //               className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border hover:bg-muted cursor-pointer"
// //               onClick={() => handleAddProduct(product)}
// //             >
// //               <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
// //                 <Image
// //                   src={
// //                     product.imageUrl ||
// //                     product.images?.[0]?.url ||
// //                     "/placeholder-image.png"
// //                   }
// //                   alt={product.title}
// //                   fill
// //                   className="object-contain bg-gray-100 rounded"
// //                 />
// //               </div>
// //               <div className="flex-1 min-w-0">
// //                 <p className="font-medium text-xs sm:text-sm truncate">
// //                   {product.title}
// //                 </p>
// //                 {product.variants && product.variants.length > 0 && (
// //                   <p className="text-xs text-muted-foreground">
// //                     {formatCurrency(product.variants[0].price, "GHS")}
// //                     {product.variants[0].weight > 0 && (
// //                       <span className="ml-1">
// //                         /{" "}
// //                         {product.variants[0].weight < 1
// //                           ? product.variants[0].weight * 1000
// //                           : product.variants[0].weight}
// //                         {product.variants[0].unit}
// //                       </span>
// //                     )}
// //                   </p>
// //                 )}
// //               </div>
// //               <Button
// //                 size="sm"
// //                 variant="outline"
// //                 className="h-7 sm:h-8 text-xs sm:text-sm"
// //               >
// //                 Add
// //               </Button>
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   )
// // }

// export const SearchPanel = ({
//   onAddProduct,
// }: {
//   onAddProduct: (product: ProductOrder) => void
// }) => {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [products, setProducts] = useState<Product[]>([])
//   const [isLoading, setIsLoading] = useState(false)
//   const [selectedVariant, setSelectedVariant] = useState<{
//     [key: string]: { price: number; weight: number; unit: string }
//   }>({})

//   useEffect(() => {
//     const fetchProducts = async () => {
//       if (searchTerm.trim().length < 2) {
//         setProducts([])
//         return
//       }
//       setIsLoading(true)
//       try {
//         const response = await fetch(`/api/products?query=${searchTerm}`)
//         if (response.ok) {
//           const data = await response.json()
//           setProducts(
//             data.products.filter((p: Product) => p.isInStock !== "out-of-stock")
//           )

//           // Initialize selected variants with first variant for each product
//           const variants: {
//             [key: string]: { price: number; weight: number; unit: string }
//           } = {}
//           data.products.forEach((product: Product) => {
//             if (product.variants && product.variants.length > 0) {
//               variants[product.id] = {
//                 price: product.variants[0].price,
//                 weight: product.variants[0].weight,
//                 unit: product.variants[0].unit,
//               }
//             }
//           })
//           setSelectedVariant(variants)
//         }
//       } catch (error) {
//         console.error("Error fetching products:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     const debounceTimer = setTimeout(fetchProducts, 300)
//     return () => clearTimeout(debounceTimer)
//   }, [searchTerm])

//   const handleVariantChange = (
//     productId: string,
//     variant: { price: number; weight: number; unit: string }
//   ) => {
//     setSelectedVariant((prev) => ({
//       ...prev,
//       [productId]: variant,
//     }))
//   }

//   const handleAddProduct = (product: Product) => {
//     if (!product.variants || product.variants.length === 0) return

//     const variant = selectedVariant[product.id] || product.variants[0]
//     const newProductOrder: ProductOrder = {
//       id: `${product.id}-${Date.now()}`,
//       productId: product.id,
//       orderId: "",
//       quantity: 1,
//       price: variant.price,
//       weight: variant.weight,
//       unit: variant.unit,
//       product: product,
//       available: true,
//     }

//     onAddProduct(newProductOrder)
//     setSearchTerm("")
//     setProducts([])
//   }

//   return (
//     <div className="space-y-3">
//       <div className="relative">
//         <Input
//           placeholder="Search products..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="pl-9 h-9 sm:h-10"
//         />
//         <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//       </div>

//       {isLoading ? (
//         <div className="flex justify-center py-4">
//           <Loader2 className="h-5 w-5 animate-spin" />
//         </div>
//       ) : (
//         <div className="space-y-2">
//           {products.map((product) => (
//             <div key={product.id} className="space-y-2">
//               <div
//                 className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border hover:bg-muted cursor-pointer"
//                 onClick={() => handleAddProduct(product)}
//               >
//                 <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
//                   <Image
//                     src={
//                       product.imageUrl ||
//                       product.images?.[0]?.url ||
//                       "/placeholder-image.png"
//                     }
//                     alt={product.title}
//                     fill
//                     className="object-contain bg-gray-100 rounded"
//                   />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="font-medium text-xs sm:text-sm truncate">
//                     {product.title}
//                   </p>
//                   {product.variants && product.variants.length > 0 && (
//                     <p className="text-xs text-muted-foreground">
//                       {formatCurrency(
//                         selectedVariant[product.id]?.price ||
//                           product.variants[0].price,
//                         "GHS"
//                       )}
//                       {(selectedVariant[product.id]?.weight ||
//                         product.variants[0].weight) > 0 && (
//                         <span className="ml-1">
//                           /{" "}
//                           {(selectedVariant[product.id]?.weight ||
//                             product.variants[0].weight) < 1
//                             ? (selectedVariant[product.id]?.weight ||
//                                 product.variants[0].weight) * 1000
//                             : selectedVariant[product.id]?.weight ||
//                               product.variants[0].weight}
//                           {selectedVariant[product.id]?.unit ||
//                             product.variants[0].unit}
//                         </span>
//                       )}
//                     </p>
//                   )}
//                 </div>
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   className="h-7 sm:h-8 text-xs sm:text-sm"
//                 >
//                   Add
//                 </Button>
//               </div>

//               {product.variants && product.variants.length > 1 && (
//                 <div className="pl-12 sm:pl-14 -mt-1">
//                   <Select
//                     value={`${
//                       selectedVariant[product.id]?.weight ||
//                       product.variants[0].weight
//                     }${
//                       selectedVariant[product.id]?.unit ||
//                       product.variants[0].unit
//                     }`}
//                     onValueChange={(value) => {
//                       const variant = product.variants.find(
//                         (v) => `${v.weight}${v.unit}` === value
//                       )
//                       if (variant) {
//                         handleVariantChange(product.id, {
//                           price: variant.price,
//                           weight: variant.weight,
//                           unit: variant.unit,
//                         })
//                       }
//                     }}
//                   >
//                     <SelectTrigger className="h-7 sm:h-8 w-full text-xs">
//                       <SelectValue placeholder="Select variant" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {product.variants.map((variant, index) => (
//                         <SelectItem
//                           key={index}
//                           value={`${variant.weight}${variant.unit}`}
//                           className="text-xs"
//                         >
//                           {formatCurrency(variant.price, "GHS")}
//                           {variant.weight > 0 && (
//                             <span className="text-muted-foreground ml-1">
//                               /{" "}
//                               {variant.weight < 1
//                                 ? variant.weight * 1000
//                                 : variant.weight}
//                               {variant.unit}
//                             </span>
//                           )}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"
import { Order, Product, Variant } from "@/types" // Ensure Variant is exported from your types
import { Loader2, SearchIcon } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

export type ProductOrder = {
  id: string
  productId: string
  orderId: string
  variantId: string // ✅ ADD THIS LINE
  quantity?: number
  available?: boolean
  quantityTotal?: string
  product: Product
  price: number
  weight: number | null // ✅ FIX: Allow null
  unit: string | null // ✅ FIX: Allow null
  order?: Order
}

export const SearchPanel = ({
  onAddProduct,
}: {
  onAddProduct: (product: ProductOrder) => void
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // 1. STATE CHANGE: Store the selected variant's ID for each product ID.
  const [selectedVariantIds, setSelectedVariantIds] = useState<{
    [productId: string]: string
  }>({})

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     if (searchTerm.trim().length < 2) {
  //       setProducts([])
  //       return
  //     }
  //     setIsLoading(true)
  //     try {
  //       const response = await fetch(`/api/products?query=${searchTerm}`)
  //       if (response.ok) {
  //         const data = await response.json()
  //         const fetchedProducts: Product[] = data.products.filter(
  //           (p: Product) => p.isInStock !== "out-of-stock"
  //         )
  //         setProducts(fetchedProducts)

  //         // Initialize selected variants with the first variant's ID for each product.
  //         const initialVariantIds: { [productId: string]: string } = {}
  //         fetchedProducts.forEach((product) => {
  //           if (product.variants && product.variants.length > 0) {
  //             initialVariantIds[product.id] = product.variants[0].id
  //           }
  //         })
  //         setSelectedVariantIds(initialVariantIds)
  //       }
  //     } catch (error) {
  //       console.error("Error fetching products:", error)
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }

  //   const debounceTimer = setTimeout(fetchProducts, 300)
  //   return () => clearTimeout(debounceTimer)
  // }, [searchTerm])

  useEffect(() => {
    const fetchProducts = async () => {
      if (searchTerm.trim().length < 2) {
        setProducts([])
        return
      }
      setIsLoading(true)
      try {
        const response = await fetch(`/api/products?query=${searchTerm}`)
        if (response.ok) {
          // ✅ FIX: Use the response directly, since it's now an array
          const fetchedProducts: Product[] = await response.json()

          const availableProducts = fetchedProducts.filter(
            (p: Product) => p.isInStock !== "out-of-stock"
          )
          setProducts(availableProducts)

          // (The rest of your logic for initializing variants stays the same)
          const initialVariantIds: { [productId: string]: string } = {}
          availableProducts.forEach((product) => {
            if (product.variants && product.variants.length > 0) {
              initialVariantIds[product.id] = product.variants[0].id
            }
          })
          setSelectedVariantIds(initialVariantIds)
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchProducts, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  // 2. HANDLER CHANGE: Update the state with the new variant ID.
  const handleVariantChange = (productId: string, variantId: string) => {
    setSelectedVariantIds((prev) => ({
      ...prev,
      [productId]: variantId,
    }))
  }

  const handleAddProduct = (product: Product) => {
    if (!product.variants || product.variants.length === 0) return

    const selectedVariantId = selectedVariantIds[product.id]
    const variant =
      product.variants.find((v) => v.id === selectedVariantId) ||
      product.variants[0]

    // This object now perfectly matches the corrected ProductOrder type
    const newProductOrder: ProductOrder = {
      id: `${product.id}-${variant.id}-${Date.now()}`,
      variantId: variant.id, // This is now a valid property
      productId: product.id,
      orderId: "", // This will be set later
      quantity: 1,
      price: variant.price,
      weight: variant.weight, // This correctly handles number or null
      unit: variant.unit, // This correctly handles string or null
      product: product,
      available: true,
    }

    onAddProduct(newProductOrder)
    setSearchTerm("")
    setProducts([])
  }

  const formatVariantLabel = (variant: Variant) => {
    let label = formatCurrency(variant.price, "GHS")
    if (variant.weight != null && variant.unit != null) {
      label += ` / ${variant.weight}${variant.unit}`
    }
    return label
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 h-9 sm:h-10"
        />
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : (
        <div className="space-y-2">
          {products.map((product) => {
            // Find the full variant object for the current product
            const currentVariant =
              product.variants.find(
                (v) => v.id === selectedVariantIds[product.id]
              ) || product.variants[0]

            return (
              <div key={product.id} className="space-y-2 p-2 border rounded-lg">
                <div
                  className="flex items-center gap-2 sm:gap-3 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation() // Prevents the select from triggering the add
                    handleAddProduct(product)
                  }}
                >
                  <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                    <Image
                      src={
                        product.imageUrl ||
                        product.images?.[0]?.url ||
                        "/placeholder-image.png"
                      }
                      alt={product.title}
                      fill
                      className="object-contain bg-gray-100 rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs sm:text-sm truncate">
                      {product.title}
                    </p>
                    {currentVariant && (
                      <p className="text-xs text-muted-foreground">
                        {formatVariantLabel(currentVariant)}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 sm:h-8 text-xs sm:text-sm"
                  >
                    Add
                  </Button>
                </div>

                {product.variants && product.variants.length > 1 && (
                  <div
                    className="pl-12 sm:pl-15 -mt-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Select
                      // 4. VALUE CHANGE: Use the unique variant ID from state.
                      value={selectedVariantIds[product.id]}
                      onValueChange={(variantId) => {
                        handleVariantChange(product.id, variantId)
                      }}
                    >
                      <SelectTrigger className="h-7 sm:h-8 w-full text-xs">
                        <SelectValue placeholder="Select variant" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.variants.map((variant) => (
                          // 5. ITEM CHANGE: Use the unique variant ID as the key and value.
                          <SelectItem
                            key={variant.id}
                            value={variant.id}
                            className="text-xs"
                          >
                            {formatVariantLabel(variant)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
