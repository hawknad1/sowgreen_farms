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
import { ProductRow } from "@/components/admin/orders/dialogs/ProductRow"
import { SearchPanel } from "@/components/admin/orders/dialogs/SearchPanel"

const EditCustomerOrderDialog = ({ order }: { order: Order }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [orderItems, setOrderItems] = useState<ProductOrder[]>(
    order?.products || []
  )

  const [isSaving, setIsSaving] = useState(false)
  const [activeUser, setActiveUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingOrderItems, setIsLoadingOrderItems] = useState(false) // Add this

  const customerEmail = order?.shippingAddress?.email
  const balance = activeUser?.user?.balance || 0
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

  const deliveryFee = order?.deliveryFee
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

  useEffect(() => {
    if (order?.products) {
      setOrderItems(order.products)
      setIsLoadingOrderItems(false) // Set loading to false when data arrives
    }
  }, [order])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={isReadOnly}
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only md:not-sr-only">Edit</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl h-[90dvh] sm:h-[80vh] flex flex-col p-0 rounded-lg">
        {isReadOnly ? (
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-medium text-red-800">
                Order cannot be modified
              </h3>
              <p className="text-sm text-red-600 mt-1">
                This order is already being processed. Please contact support
                for assistance.
              </p>
            </div>
          </div>
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
                      {/* {orderItems?.length > 0 ? (
                        orderItems?.map((item) => (
                          <ProductRow
                            key={item.id}
                            item={item}
                            onRemove={handleRemoveItem}
                            onQuantityChange={handleQuantityChange}
                            onVariantChange={handleVariantChange}
                            onAvailabilityChange={handleAvailabilityChange}
                            isCustomer={true}
                          />
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No products in this order
                        </div>
                      )} */}
                      {isLoadingOrderItems ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                      ) : orderItems?.length > 0 ? (
                        orderItems?.map((item) => {
                          // console.log("Item passed to ProductRow:", item) // <--- Add this
                          return (
                            <ProductRow
                              key={item.id}
                              item={item}
                              onRemove={handleRemoveItem}
                              onQuantityChange={handleQuantityChange}
                              onVariantChange={handleVariantChange}
                              onAvailabilityChange={handleAvailabilityChange}
                              isCustomer={true}
                            />
                          )
                        })
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

export default EditCustomerOrderDialog
