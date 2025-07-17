"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "react-hot-toast"
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
  Loader2,
  Check,
  X,
} from "lucide-react"
import { Order, Product, ProductOrder } from "@/types"
import { cn, formatCurrency } from "@/lib/utils"
import { deductBalance } from "@/lib/actions/deductBalance"
import { useSession } from "next-auth/react"
import { SearchPanel } from "./SearchPanel"
import { ProductRow } from "./ProductRow"
import { AlertDestructive } from "@/components/alerts/AlertDestructive"

const ModifyOrderDialog = ({ order }: { order: Order }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [orderItems, setOrderItems] = useState<ProductOrder[]>(
    order?.products || []
  )
  const [deliveryFee, setDeliveryFee] = useState(order?.deliveryFee || 0)
  const [isSaving, setIsSaving] = useState(false)
  const [activeUser, setActiveUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = useSession()
  const customerEmail = order?.shippingAddress?.email
  // const balance = activeUser?.user?.balance || 0
  const balance = order?.creditAppliedTotal || 0
  const checkTotal = order?.paymentAction !== "paid" && balance > 0

  const isReadOnly = ["confirmed", "in-transit", "delivered"].includes(
    order?.status
  )

  // Calculate order totals
  const subtotal = orderItems.reduce((sum, item) => {
    if (item.available && item?.product?.isInStock !== "out-of-stock") {
      return sum + item.price * item.quantity
    }
    return sum
  }, 0)
  const total = subtotal + deliveryFee
  const { updatedOrderTotal } = deductBalance(balance, total)

  useEffect(() => {
    const getUser = async () => {
      if (!customerEmail) return
      setIsLoading(true)
      try {
        const res = await fetch(`/api/user/${customerEmail}`)
        if (res.ok) {
          const active = await res.json()
          setActiveUser(active)
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error)
      } finally {
        setIsLoading(false)
      }
    }
    getUser()
  }, [customerEmail])

  const handleAddProduct = (newProduct: ProductOrder) => {
    if (orderItems.some((item) => item.productId === newProduct.productId)) {
      toast.error("Product already in order")
      return
    }
    setOrderItems((prev) => [...prev, newProduct])
    toast.success("Product added")
  }

  const handleRemoveItem = (id: string) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== id))
    toast.success("Product removed")
  }

  const handleQuantityChange = (id: string, quantity: number) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    )
  }

  const handleVariantChange = (
    id: string,
    variant: { price: number; weight: number; unit: string }
  ) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              price: variant.price,
              weight: variant.weight,
              unit: variant.unit,
            }
          : item
      )
    )
  }

  const handleAvailabilityChange = (id: string, available: boolean) => {
    setOrderItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, available } : item))
    )
  }

  const saveChanges = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: orderItems,
          total: subtotal,
          deliveryFee,
          updatedOrderTotal,
        }),
      })

      if (response.ok) {
        toast.success("Order updated successfully")
        setIsOpen(false)
        window.location.reload()
      } else {
        const { message } = await response.json()
        toast.error(message || "Failed to update order")
      }
    } catch (error) {
      toast.error("An error occurred while updating the order")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          // disabled={isReadOnly}
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only md:not-sr-only">Edit</span>
        </Button>
      </DialogTrigger>

      <DialogContent
        className={`max-w-4xl max-h-[90dvh] sm:max-h-[80vh] flex flex-col p-0`}
      >
        {isReadOnly ? (
          // <div className="p-6">
          //   <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          //     <h3 className="font-medium text-red-800">
          //       Order cannot be modified
          //     </h3>
          //     <p className="text-sm text-red-600 mt-1">
          //       This order is already being processed. Please contact support
          //       for assistance.
          //     </p>
          //   </div>
          // </div>
          <AlertDestructive
            admin={true}
            message="Order status is 'Confirmed'. Switch back to 'Processing' to make changes."
          />
        ) : (
          <>
            <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2 sm:pb-4 border-b sticky top-0 rounded-lg bg-white z-10">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg sm:text-xl font-semibold">
                  {currentStep === 1 ? (
                    <>Edit Order #{order?.orderNumber}</>
                  ) : (
                    <>Add Products</>
                  )}
                </DialogTitle>
                <div className="flex gap-2">
                  {currentStep === 1 ? (
                    <Button
                      onClick={() => setCurrentStep(2)}
                      variant="outline"
                      className="gap-1 sm:gap-2 h-8 sm:h-9"
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">Add Products</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrentStep(1)}
                      variant="outline"
                      className="gap-1 sm:gap-2 h-8 sm:h-9"
                    >
                      <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">Back to Order</span>
                    </Button>
                  )}
                </div>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto flex flex-col sm:grid sm:grid-cols-1 lg:grid-cols-5">
              {currentStep === 1 ? (
                <div className="lg:col-span-5 flex flex-col h-full">
                  <div className="flex-1 p-2 sm:p-4">
                    <div className="space-y-2 sm:space-y-3">
                      {orderItems?.length > 0 ? (
                        orderItems?.map((item) => (
                          <ProductRow
                            key={item.id}
                            item={item}
                            onRemove={handleRemoveItem}
                            onQuantityChange={handleQuantityChange}
                            onVariantChange={handleVariantChange}
                            onAvailabilityChange={handleAvailabilityChange}
                            isCustomer={false}
                          />
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No products in this order
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t p-3 sm:p-4 bg-white rounded-lg sticky bottom-0">
                    <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-between sm:gap-4 mb-3">
                      <div className="text-center sm:text-left">
                        <p className="text-xs text-muted-foreground">
                          Subtotal:
                        </p>
                        <p className="text-sm font-medium">
                          {formatCurrency(subtotal, "GHS")}
                        </p>
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="text-xs text-muted-foreground">
                          Delivery:
                        </p>
                        <p className="text-sm font-medium">
                          {formatCurrency(order?.deliveryFee, "GHS")}
                        </p>
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="text-xs text-muted-foreground">Total:</p>
                        <p className="text-sm font-medium">
                          {formatCurrency(total, "GHS")}
                        </p>
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="text-xs text-muted-foreground">Due:</p>
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                        ) : (
                          <p className="text-sm font-medium text-red-500">
                            {formatCurrency(updatedOrderTotal, "GHS")}
                          </p>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={saveChanges}
                      disabled={isSaving || isLoading}
                      className="w-full bg-sowgren_Color hover:bg-sowgren_Color/85 h-9 sm:h-10"
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Update Order"
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="lg:col-span-3 border-r p-2 sm:p-4 overflow-y-auto">
                    <SearchPanel onAddProduct={handleAddProduct} />
                  </div>
                  <div className="lg:col-span-2 p-2 sm:p-4 overflow-y-auto border-t lg:border-t-0">
                    <h3 className="font-medium mb-2 sm:mb-4 text-sm sm:text-base">
                      Current Order ({orderItems?.length})
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      {orderItems?.length > 0 ? (
                        orderItems?.map((item) => (
                          <ProductRow
                            key={item.id}
                            item={item}
                            compact
                            onRemove={handleRemoveItem}
                          />
                        ))
                      ) : (
                        <div className="text-center py-4 text-muted-foreground text-xs sm:text-sm">
                          No products added yet
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

// const ProductRow = ({
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

// const SearchPanel = ({
//   onAddProduct,
// }: {
//   onAddProduct: (product: ProductOrder) => void
// }) => {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [products, setProducts] = useState<Product[]>([])
//   const [isLoading, setIsLoading] = useState(false)

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

//   const handleAddProduct = (product: Product) => {
//     if (!product.variants || product.variants.length === 0) return

//     const variant = product.variants[0]
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
//             <div
//               key={product.id}
//               className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border hover:bg-muted cursor-pointer"
//               onClick={() => handleAddProduct(product)}
//             >
//               <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
//                 <Image
//                   src={
//                     product.imageUrl ||
//                     product.images?.[0]?.url ||
//                     "/placeholder-image.png"
//                   }
//                   alt={product.title}
//                   fill
//                   className="object-contain bg-gray-100 rounded"
//                 />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="font-medium text-xs sm:text-sm truncate">
//                   {product.title}
//                 </p>
//                 {product.variants && product.variants.length > 0 && (
//                   <p className="text-xs text-muted-foreground">
//                     {formatCurrency(product.variants[0].price, "GHS")}
//                     {product.variants[0].weight > 0 && (
//                       <span className="ml-1">
//                         /{" "}
//                         {product.variants[0].weight < 1
//                           ? product.variants[0].weight * 1000
//                           : product.variants[0].weight}
//                         {product.variants[0].unit}
//                       </span>
//                     )}
//                   </p>
//                 )}
//               </div>
//               <Button
//                 size="sm"
//                 variant="outline"
//                 className="h-7 sm:h-8 text-xs sm:text-sm"
//               >
//                 Add
//               </Button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

export default ModifyOrderDialog
