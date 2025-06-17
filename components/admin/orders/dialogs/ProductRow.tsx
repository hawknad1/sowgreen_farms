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
import { cn, formatCurrency } from "@/lib/utils"
import { ProductOrder } from "@/types"
import { Check, Trash2, X } from "lucide-react"
import Image from "next/image"

// export const ProductRow = ({
//   item,
//   compact = false,
//   onRemove,
//   onQuantityChange,
//   onVariantChange,
//   onAvailabilityChange,
//   isCustomer = false,
// }: {
//   item: ProductOrder
//   compact?: boolean
//   onRemove?: (id: string) => void
//   onQuantityChange?: (id: string, quantity: number) => void
//   onVariantChange?: (
//     id: string,
//     variant: { price: number; weight: number; unit: string }
//   ) => void
//   onAvailabilityChange?: (id: string, available: boolean) => void
//   isCustomer?: boolean
// }) => {
//   const outOfStock = item?.product?.isInStock === "out-of-stock"
//   const isAvailable = item.available && !outOfStock

//   return (
//     <div
//       className={cn(
//         "flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border",
//         !isAvailable && "bg-gray-50"
//       )}
//     >
//       <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
//         <Image
//           src={
//             item.product.imageUrl ||
//             item.product.images?.[0]?.url ||
//             "/placeholder-image.png"
//           }
//           alt={item.product.title || "Product Image"}
//           fill
//           className="object-contain bg-gray-100 rounded"
//         />
//         {!isAvailable && (
//           <div className="absolute inset-0 bg-black bg-opacity-20 rounded" />
//         )}
//       </div>

//       <div className="flex-1 min-w-0">
//         <p
//           className={cn(
//             "font-medium truncate text-xs sm:text-sm",
//             !isAvailable && "text-gray-400"
//           )}
//         >
//           {item.product.title || "Untitled Product"}
//         </p>
//         {!compact && (
//           <div className="mt-1">
//             {item.product.variants && item.product.variants.length > 1 ? (
//               <Select
//                 value={`${item.weight}${item.unit}`}
//                 onValueChange={(value) => {
//                   const selectedVariant = item.product.variants.find(
//                     (v) => `${v.weight}${v.unit}` === value
//                   )
//                   if (selectedVariant && onVariantChange) {
//                     onVariantChange(item.id, {
//                       price: selectedVariant.price,
//                       weight: selectedVariant.weight,
//                       unit: selectedVariant.unit,
//                     })
//                   }
//                 }}
//               >
//                 <SelectTrigger className="h-7 sm:h-8 w-full text-xs">
//                   <SelectValue placeholder="Select variant" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {item.product.variants.map((variant, index) => (
//                     <SelectItem
//                       key={index}
//                       value={`${variant.weight}${variant.unit}`}
//                       className="text-xs"
//                     >
//                       {formatCurrency(variant.price, "GHS")}
//                       {variant.weight > 0 && (
//                         <span className="text-muted-foreground ml-1">
//                           /{" "}
//                           {variant.weight < 1
//                             ? variant.weight * 1000
//                             : variant.weight}
//                           {variant.unit}
//                         </span>
//                       )}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             ) : (
//               <p className="text-xs text-muted-foreground">
//                 {formatCurrency(item.price, "GHS")}
//                 {item.weight > 0 && (
//                   <span className="ml-1">
//                     / {item.weight < 1 ? item.weight * 1000 : item.weight}
//                     {item.unit}
//                   </span>
//                 )}
//               </p>
//             )}
//           </div>
//         )}
//       </div>

//       {!compact && !isCustomer && onAvailabilityChange && (
//         <Select
//           value={isAvailable ? "instock" : "outofstock"}
//           onValueChange={(value) =>
//             onAvailabilityChange(item.id, value === "instock")
//           }
//           disabled={outOfStock}
//         >
//           <SelectTrigger className="h-7 sm:h-8 w-[100px] sm:w-[120px] text-xs">
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="instock" className="text-xs">
//               <div className="flex items-center gap-2">
//                 <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
//                 <span className="text-xs sm:text-sm">In Stock</span>
//               </div>
//             </SelectItem>
//             <SelectItem value="outofstock" className="text-xs">
//               <div className="flex items-center gap-2">
//                 <X className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
//                 <span className="text-xs sm:text-sm">Out of Stock</span>
//               </div>
//             </SelectItem>
//           </SelectContent>
//         </Select>
//       )}

//       {!compact && onQuantityChange && (
//         <div className="flex items-center gap-1">
//           <Button
//             variant="outline"
//             size="sm"
//             className="h-7 w-7 sm:h-8 sm:w-8 p-0"
//             onClick={() => onQuantityChange(item.id, item.quantity - 1)}
//             disabled={item.quantity <= 1}
//           >
//             -
//           </Button>
//           <Input
//             value={item.quantity}
//             onChange={(e) => onQuantityChange(item.id, Number(e.target.value))}
//             className="w-10 sm:w-12 h-7 sm:h-8 text-center text-xs sm:text-sm"
//             min="1"
//             disabled={!isAvailable && isCustomer}
//           />
//           <Button
//             variant="outline"
//             size="sm"
//             className="h-7 w-7 sm:h-8 sm:w-8 p-0"
//             onClick={() => onQuantityChange(item.id, item.quantity + 1)}
//           >
//             +
//           </Button>
//         </div>
//       )}

//       <div className="text-right min-w-[60px] sm:min-w-[80px]">
//         <p className="font-medium text-xs sm:text-sm">
//           {formatCurrency(item.price * item.quantity, "GHS")}
//         </p>
//       </div>

//       {onRemove && (
//         <Button
//           variant="ghost"
//           size="sm"
//           className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-red-500 hover:text-red-600"
//           onClick={() => onRemove(item.id)}
//         >
//           <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
//         </Button>
//       )}
//     </div>
//   )
// }

// export const ProductRow = ({
//   item,
//   compact = false,
//   onRemove,
//   onQuantityChange,
//   onVariantChange,
//   onAvailabilityChange,
//   isCustomer = false,
// }: {
//   item: ProductOrder
//   compact?: boolean
//   onRemove?: (id: string) => void
//   onQuantityChange?: (id: string, quantity: number) => void
//   onVariantChange?: (
//     id: string,
//     variant: { price: number; weight: number | null; unit: string | null }
//   ) => void
//   onAvailabilityChange?: (id: string, available: boolean) => void
//   isCustomer?: boolean
// }) => {
//   const outOfStock = item?.product?.isInStock === "out-of-stock"
//   const isAvailable = item.available && !outOfStock

//   // Create a guaranteed unique identifier for each variant
//   const getVariantKey = (variant: {
//     id: string
//     price: number
//     weight: number | null
//     unit: string | null
//   }) => {
//     // Always use the database ID first if available
//     if (variant.id) return variant.id

//     // Fallback to a composite key that includes price
//     const weightPart = variant.weight !== null ? variant.weight : "null"
//     const unitPart = variant.unit !== null ? variant.unit : "null"
//     return `${variant.price}-${weightPart}-${unitPart}`
//   }

//   // Find the currently selected variant using strict comparison
//   const currentVariant =
//     item.product.variants?.find((v) => {
//       const priceMatch = v.price === item.price
//       const weightMatch =
//         v.weight === item.weight || (v.weight === null && item.weight === null)
//       const unitMatch =
//         v.unit === item.unit || (v.unit === null && item.unit === null)
//       return priceMatch && weightMatch && unitMatch
//     }) || item.product.variants?.[0]

//   // Handle variant change with proper null checking
//   const handleVariantChange = (value: string) => {
//     if (!onVariantChange || !item.product.variants) return

//     const selectedVariant = item.product.variants.find(
//       (v) => getVariantKey(v) === value
//     )
//     if (selectedVariant) {
//       onVariantChange(item.id, {
//         price: selectedVariant.price,
//         weight: selectedVariant.weight,
//         unit: selectedVariant.unit,
//       })
//     }
//   }

//   return (
//     <div
//       className={cn(
//         "flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border",
//         !isAvailable && "bg-gray-50"
//       )}
//     >
//       {/* Image and title sections remain the same */}

//       {!compact &&
//         item.product.variants &&
//         item.product.variants.length > 1 && (
//           <Select
//             value={currentVariant ? getVariantKey(currentVariant) : ""}
//             onValueChange={handleVariantChange}
//           >
//             <SelectTrigger className="h-7 sm:h-8 w-full text-xs">
//               <SelectValue>
//                 {formatCurrency(currentVariant?.price || 0, "GHS")}
//                 {currentVariant?.weight && currentVariant.weight > 0 && (
//                   <span className="text-muted-foreground ml-1">
//                     /{" "}
//                     {currentVariant.weight < 1
//                       ? currentVariant.weight * 1000
//                       : currentVariant.weight}
//                     {currentVariant.unit}
//                   </span>
//                 )}
//               </SelectValue>
//             </SelectTrigger>
//             <SelectContent>
//               {item.product.variants.map((variant) => (
//                 <SelectItem
//                   key={getVariantKey(variant)}
//                   value={getVariantKey(variant)}
//                   className="text-xs"
//                 >
//                   {formatCurrency(variant.price, "GHS")}
//                   {variant.weight && variant.weight > 0 && (
//                     <span className="text-muted-foreground ml-1">
//                       /{" "}
//                       {variant.weight < 1
//                         ? variant.weight * 1000
//                         : variant.weight}
//                       {variant.unit}
//                     </span>
//                   )}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         )}

//       {/* Rest of the component remains the same */}
//     </div>
//   )
// }

export const ProductRow = ({
  item,
  compact = false,
  onRemove,
  onQuantityChange,
  onVariantChange,
  onAvailabilityChange,
  isCustomer = false,
}: {
  item: ProductOrder & { variantId?: string }
  compact?: boolean
  onRemove?: (id: string) => void
  onQuantityChange?: (id: string, quantity: number) => void
  onVariantChange?: (
    id: string,
    variant: { price: number; weight: number | null; unit: string | null }
  ) => void
  onAvailabilityChange?: (id: string, available: boolean) => void
  isCustomer?: boolean
}) => {
  const outOfStock = item?.product?.isInStock === "out-of-stock"
  const isAvailable = item.available && !outOfStock

  // Enhanced variant key generator
  const getVariantKey = (variant: {
    id: string
    price: number
    weight: number | null
    unit: string | null
  }) => {
    // Always use the database ID first if available
    if (variant.id) return variant.id

    // For variants without weight/unit, use price as the differentiator
    if (variant.weight === null && variant.unit === null) {
      return `price-${variant.price}`
    }

    // For variants with weight/unit
    const weightPart = variant.weight !== null ? variant.weight : "null"
    const unitPart = variant.unit !== null ? variant.unit : "null"
    return `${variant.price}-${weightPart}-${unitPart}`
  }

  // Find the currently selected variant
  const currentVariant =
    item.product.variants?.find((v) => {
      // First try to match by ID if available
      if (v.id && item.variantId && v.id === item.variantId) return true

      // Then match by price, weight, and unit
      const priceMatch = v.price === item.price
      const weightMatch =
        v.weight === item.weight || (v.weight === null && item.weight === null)
      const unitMatch =
        v.unit === item.unit || (v.unit === null && item.unit === null)

      return priceMatch && weightMatch && unitMatch
    }) || item.product.variants?.[0]

  const handleVariantChange = (value: string) => {
    if (!onVariantChange || !item.product.variants) return

    const selectedVariant = item.product.variants.find(
      (v) => getVariantKey(v) === value
    )
    if (selectedVariant) {
      onVariantChange(item.id, {
        price: selectedVariant.price,
        weight: selectedVariant.weight,
        unit: selectedVariant.unit,
      })
    }
  }

  // Format variant label for display
  const formatVariantLabel = (variant: {
    price: number
    weight: number | null
    unit: string | null
  }) => {
    let label = formatCurrency(variant.price, "GHS")

    // Special case for eggs which have null weight/unit
    if (variant.weight === null && variant.unit === null) {
      if (item.product.title.toLowerCase().includes("egg")) {
        if (variant.price === 108) return "GHS 108 (Tray)"
        if (variant.price === 4) return "GHS 4 (Single)"
      }
      return `${label} (each)`
    }

    // Only show weight/unit if they exist
    if (variant.weight !== null && variant.unit !== null) {
      const displayWeight =
        variant.weight < 1 ? variant.weight * 1000 : variant.weight
      const unit =
        variant.unit === "g" && variant.weight >= 1 ? "kg" : variant.unit
      label += ` / ${displayWeight}${unit}`
    }

    return label
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border",
        !isAvailable && "bg-gray-50"
      )}
    >
      <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
        <Image
          src={
            item.product.imageUrl ||
            item.product.images?.[0]?.url ||
            "/placeholder-image.png"
          }
          alt={item.product.title || "Product Image"}
          fill
          className="object-contain bg-gray-100 rounded"
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-20 rounded" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "font-medium truncate text-xs sm:text-sm",
            !isAvailable && "text-gray-400"
          )}
        >
          {item.product.title || "Untitled Product"}
        </p>
        {!compact &&
          item.product.variants &&
          item.product.variants.length > 1 && (
            <Select
              value={currentVariant ? getVariantKey(currentVariant) : ""}
              onValueChange={handleVariantChange}
            >
              <SelectTrigger className="h-7 sm:h-8 w-full text-xs">
                <SelectValue>
                  {currentVariant
                    ? formatVariantLabel(currentVariant)
                    : "Select variant"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {item.product.variants.map((variant) => (
                  <SelectItem
                    key={getVariantKey(variant)}
                    value={getVariantKey(variant)}
                    className="text-xs"
                  >
                    {formatVariantLabel(variant)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
      </div>

      {!compact && !isCustomer && onAvailabilityChange && (
        <Select
          value={isAvailable ? "instock" : "outofstock"}
          onValueChange={(value) =>
            onAvailabilityChange(item.id, value === "instock")
          }
          disabled={outOfStock}
        >
          <SelectTrigger className="h-7 sm:h-8 w-[100px] sm:w-[120px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="instock" className="text-xs">
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                <span className="text-xs sm:text-sm">In Stock</span>
              </div>
            </SelectItem>
            <SelectItem value="outofstock" className="text-xs">
              <div className="flex items-center gap-2">
                <X className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                <span className="text-xs ">Out of Stock</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      )}

      {!compact && onQuantityChange && (
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 sm:h-8 sm:w-8 p-0"
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            -
          </Button>
          <Input
            value={item.quantity}
            onChange={(e) => onQuantityChange(item.id, Number(e.target.value))}
            className="w-10 sm:w-12 h-7 sm:h-8 text-center text-xs sm:text-sm"
            min="1"
            disabled={!isAvailable && isCustomer}
          />
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 sm:h-8 sm:w-8 p-0"
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
          >
            +
          </Button>
        </div>
      )}

      <div className="text-right min-w-[60px] sm:min-w-[80px]">
        <p className="font-medium text-xs sm:text-sm">
          {formatCurrency(item.price * item.quantity, "GHS")}
        </p>
      </div>

      {onRemove && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-red-500 hover:text-red-600"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      )}
    </div>
  )
}

// export const ProductRow = ({
//   item,
//   compact = false,
//   onRemove,
//   onQuantityChange,
//   onVariantChange,
//   onAvailabilityChange,
//   isCustomer = false,
// }: {
//   item: ProductOrder
//   compact?: boolean
//   onRemove?: (id: string) => void
//   onQuantityChange?: (id: string, quantity: number) => void
//   onVariantChange?: (
//     id: string,
//     variant: { price: number; weight: number | null; unit: string | null }
//   ) => void
//   onAvailabilityChange?: (id: string, available: boolean) => void
//   isCustomer?: boolean
// }) => {
//   const outOfStock = item?.product?.isInStock === "out-of-stock"
//   const isAvailable = item.available && !outOfStock

//   // Enhanced variant key generator
//   const getVariantKey = (variant: {
//     id: string
//     price: number
//     weight: number | null
//     unit: string | null
//   }) => {
//     // Always use the database ID first if available
//     if (variant.id) return variant.id

//     // For variants without weight/unit, just use price
//     if (variant.weight === null && variant.unit === null) {
//       return `${variant.price}`
//     }

//     // For variants with weight/unit
//     const weightPart = variant.weight !== null ? variant.weight : "null"
//     const unitPart = variant.unit !== null ? variant.unit : "null"
//     return `${variant.price}-${weightPart}-${unitPart}`
//   }

//   // Find the currently selected variant with more flexible matching
//   const currentVariant =
//     item.product.variants?.find((v) => {
//       // First try to match by ID if available
//       if (v.id && item.variantId && v.id === item.variantId) return true

//       // Then match by price, weight, and unit
//       const priceMatch = v.price === item.price
//       const weightMatch =
//         v.weight === item.weight || (v.weight === null && item.weight === null)
//       const unitMatch =
//         v.unit === item.unit || (v.unit === null && item.unit === null)

//       return priceMatch && weightMatch && unitMatch
//     }) || item.product.variants?.[0]

//   const handleVariantChange = (value: string) => {
//     if (!onVariantChange || !item.product.variants) return

//     const selectedVariant = item.product.variants.find(
//       (v) => getVariantKey(v) === value
//     )
//     if (selectedVariant) {
//       onVariantChange(item.id, {
//         price: selectedVariant.price,
//         weight: selectedVariant.weight,
//         unit: selectedVariant.unit,
//       })
//     }
//   }

//   // Format variant label for display
//   const formatVariantLabel = (variant: {
//     price: number
//     weight: number | null
//     unit: string | null
//   }) => {
//     let label = formatCurrency(variant.price, "GHS")

//     // Only show weight/unit if they exist
//     if (variant.weight !== null && variant.unit !== null) {
//       const displayWeight =
//         variant.weight < 1 ? variant.weight * 1000 : variant.weight
//       label += ` / ${displayWeight}${variant.unit}`
//     }

//     return label
//   }

//   return (
//     <div
//       className={cn(
//         "flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border",
//         !isAvailable && "bg-gray-50"
//       )}
//     >
//       <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
//         <Image
//           src={
//             item.product.imageUrl ||
//             item.product.images?.[0]?.url ||
//             "/placeholder-image.png"
//           }
//           alt={item.product.title || "Product Image"}
//           fill
//           className="object-contain bg-gray-100 rounded"
//         />
//         {!isAvailable && (
//           <div className="absolute inset-0 bg-black bg-opacity-20 rounded" />
//         )}
//       </div>

//       <div className="flex-1 min-w-0">
//         <p
//           className={cn(
//             "font-medium truncate text-xs sm:text-sm",
//             !isAvailable && "text-gray-400"
//           )}
//         >
//           {item.product.title || "Untitled Product"}
//         </p>
//         {!compact &&
//           item.product.variants &&
//           item.product.variants.length > 1 && (
//             <Select
//               value={currentVariant ? getVariantKey(currentVariant) : ""}
//               onValueChange={handleVariantChange}
//             >
//               <SelectTrigger className="h-7 sm:h-8 w-full text-xs">
//                 <SelectValue>
//                   {currentVariant
//                     ? formatVariantLabel(currentVariant)
//                     : "Select variant"}
//                 </SelectValue>
//               </SelectTrigger>
//               <SelectContent>
//                 {item.product.variants.map((variant) => (
//                   <SelectItem
//                     key={getVariantKey(variant)}
//                     value={getVariantKey(variant)}
//                     className="text-xs"
//                   >
//                     {formatVariantLabel(variant)}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           )}
//       </div>

//       {!compact && !isCustomer && onAvailabilityChange && (
//         <Select
//           value={isAvailable ? "instock" : "outofstock"}
//           onValueChange={(value) =>
//             onAvailabilityChange(item.id, value === "instock")
//           }
//           disabled={outOfStock}
//         >
//           <SelectTrigger className="h-7 sm:h-8 w-[100px] sm:w-[120px] text-xs">
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="instock" className="text-xs">
//               <div className="flex items-center gap-2">
//                 <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
//                 <span className="text-xs sm:text-sm">In Stock</span>
//               </div>
//             </SelectItem>
//             <SelectItem value="outofstock" className="text-xs">
//               <div className="flex items-center gap-2">
//                 <X className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
//                 <span className="text-xs sm:text-sm">Out of Stock</span>
//               </div>
//             </SelectItem>
//           </SelectContent>
//         </Select>
//       )}

//       {!compact && onQuantityChange && (
//         <div className="flex items-center gap-1">
//           <Button
//             variant="outline"
//             size="sm"
//             className="h-7 w-7 sm:h-8 sm:w-8 p-0"
//             onClick={() => onQuantityChange(item.id, item.quantity - 1)}
//             disabled={item.quantity <= 1}
//           >
//             -
//           </Button>
//           <Input
//             value={item.quantity}
//             onChange={(e) => onQuantityChange(item.id, Number(e.target.value))}
//             className="w-10 sm:w-12 h-7 sm:h-8 text-center text-xs sm:text-sm"
//             min="1"
//             disabled={!isAvailable && isCustomer}
//           />
//           <Button
//             variant="outline"
//             size="sm"
//             className="h-7 w-7 sm:h-8 sm:w-8 p-0"
//             onClick={() => onQuantityChange(item.id, item.quantity + 1)}
//           >
//             +
//           </Button>
//         </div>
//       )}

//       <div className="text-right min-w-[60px] sm:min-w-[80px]">
//         <p className="font-medium text-xs sm:text-sm">
//           {formatCurrency(item.price * item.quantity, "GHS")}
//         </p>
//       </div>

//       {onRemove && (
//         <Button
//           variant="ghost"
//           size="sm"
//           className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-red-500 hover:text-red-600"
//           onClick={() => onRemove(item.id)}
//         >
//           <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
//         </Button>
//       )}
//     </div>
//   )
// }

// export const ProductRow = ({
//   item,
//   compact = false,
//   onRemove,
//   onQuantityChange,
//   onVariantChange,
//   onAvailabilityChange,
//   isCustomer = false,
// }: {
//   item: ProductOrder
//   compact?: boolean
//   onRemove?: (id: string) => void
//   onQuantityChange?: (id: string, quantity: number) => void
//   onVariantChange?: (
//     id: string,
//     variant: { price: number; weight: number | null; unit: string | null }
//   ) => void
//   onAvailabilityChange?: (id: string, available: boolean) => void
//   isCustomer?: boolean
// }) => {
//   const outOfStock = item?.product?.isInStock === "out-of-stock"
//   const isAvailable = item.available && !outOfStock

//   // Create a guaranteed unique identifier for each variant
//   const getVariantKey = (variant: {
//     id: string
//     price: number
//     weight: number | null
//     unit: string | null
//   }) => {
//     // Always use the database ID first if available
//     if (variant.id) return variant.id

//     // Fallback to a composite key that includes price
//     const weightPart = variant.weight !== null ? variant.weight : "null"
//     const unitPart = variant.unit !== null ? variant.unit : "null"
//     return `${variant.price}-${weightPart}-${unitPart}`
//   }

//   // Find the currently selected variant using strict comparison
//   const currentVariant =
//     item.product.variants?.find((v) => {
//       const priceMatch = v.price === item.price
//       const weightMatch =
//         v.weight === item.weight || (v.weight === null && item.weight === null)
//       const unitMatch =
//         v.unit === item.unit || (v.unit === null && item.unit === null)
//       return priceMatch && weightMatch && unitMatch
//     }) || item.product.variants?.[0]

//   // Handle variant change with proper null checking
//   const handleVariantChange = (value: string) => {
//     if (!onVariantChange || !item.product.variants) return

//     const selectedVariant = item.product.variants.find(
//       (v) => getVariantKey(v) === value
//     )
//     if (selectedVariant) {
//       onVariantChange(item.id, {
//         price: selectedVariant.price,
//         weight: selectedVariant.weight,
//         unit: selectedVariant.unit,
//       })
//     }
//   }

//   return (
//     <div
//       className={cn(
//         "flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border",
//         !isAvailable && "bg-gray-50"
//       )}
//     >
//       <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
//         <Image
//           src={
//             item.product.imageUrl ||
//             item.product.images?.[0]?.url ||
//             "/placeholder-image.png"
//           }
//           alt={item.product.title || "Product Image"}
//           fill
//           className="object-contain bg-gray-100 rounded"
//         />
//         {!isAvailable && (
//           <div className="absolute inset-0 bg-black bg-opacity-20 rounded" />
//         )}
//       </div>

//       <div className="flex-1 min-w-0">
//         <p
//           className={cn(
//             "font-medium truncate text-xs sm:text-sm",
//             !isAvailable && "text-gray-400"
//           )}
//         >
//           {item.product.title || "Untitled Product"}
//         </p>
//         {!compact &&
//           item.product.variants &&
//           item.product.variants.length > 1 && (
//             <Select
//               value={currentVariant ? getVariantKey(currentVariant) : ""}
//               onValueChange={handleVariantChange}
//             >
//               <SelectTrigger className="h-7 sm:h-8 w-full text-xs">
//                 <SelectValue>
//                   {formatCurrency(currentVariant?.price || 0, "GHS")}
//                   {currentVariant?.weight && currentVariant.weight > 0 && (
//                     <span className="text-muted-foreground ml-1">
//                       /{" "}
//                       {currentVariant.weight < 1
//                         ? currentVariant.weight * 1000
//                         : currentVariant.weight}
//                       {currentVariant.unit}
//                     </span>
//                   )}
//                 </SelectValue>
//               </SelectTrigger>
//               <SelectContent>
//                 {item.product.variants.map((variant) => (
//                   <SelectItem
//                     key={getVariantKey(variant)}
//                     value={getVariantKey(variant)}
//                     className="text-xs"
//                   >
//                     {formatCurrency(variant.price, "GHS")}
//                     {variant.weight && variant.weight > 0 && (
//                       <span className="text-muted-foreground ml-1">
//                         /{" "}
//                         {variant.weight < 1
//                           ? variant.weight * 1000
//                           : variant.weight}
//                         {variant.unit}
//                       </span>
//                     )}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           )}
//       </div>

//       {!compact && !isCustomer && onAvailabilityChange && (
//         <Select
//           value={isAvailable ? "instock" : "outofstock"}
//           onValueChange={(value) =>
//             onAvailabilityChange(item.id, value === "instock")
//           }
//           disabled={outOfStock}
//         >
//           <SelectTrigger className="h-7 sm:h-8 w-[100px] sm:w-[120px] text-xs">
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="instock" className="text-xs">
//               <div className="flex items-center gap-2">
//                 <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
//                 <span className="text-xs sm:text-sm">In Stock</span>
//               </div>
//             </SelectItem>
//             <SelectItem value="outofstock" className="text-xs">
//               <div className="flex items-center gap-2">
//                 <X className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
//                 <span className="text-xs sm:text-sm">Out of Stock</span>
//               </div>
//             </SelectItem>
//           </SelectContent>
//         </Select>
//       )}

//       {!compact && onQuantityChange && (
//         <div className="flex items-center gap-1">
//           <Button
//             variant="outline"
//             size="sm"
//             className="h-7 w-7 sm:h-8 sm:w-8 p-0"
//             onClick={() => onQuantityChange(item.id, item.quantity - 1)}
//             disabled={item.quantity <= 1}
//           >
//             -
//           </Button>
//           <Input
//             value={item.quantity}
//             onChange={(e) => onQuantityChange(item.id, Number(e.target.value))}
//             className="w-10 sm:w-12 h-7 sm:h-8 text-center text-xs sm:text-sm"
//             min="1"
//             disabled={!isAvailable && isCustomer}
//           />
//           <Button
//             variant="outline"
//             size="sm"
//             className="h-7 w-7 sm:h-8 sm:w-8 p-0"
//             onClick={() => onQuantityChange(item.id, item.quantity + 1)}
//           >
//             +
//           </Button>
//         </div>
//       )}

//       <div className="text-right min-w-[60px] sm:min-w-[80px]">
//         <p className="font-medium text-xs sm:text-sm">
//           {formatCurrency(item.price * item.quantity, "GHS")}
//         </p>
//       </div>

//       {onRemove && (
//         <Button
//           variant="ghost"
//           size="sm"
//           className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-red-500 hover:text-red-600"
//           onClick={() => onRemove(item.id)}
//         >
//           <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
//         </Button>
//       )}
//     </div>
//   )
// }
