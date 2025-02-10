"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"
import { ChevronLeft, ChevronRight } from "lucide-react"
import EditCustomerOrder from "./EditCustomerOrder"
import SearchProduct from "@/components/admin/orders/SearchProduct"
import { Order, ProductOrder } from "@/types"
import { AlertDestructive } from "@/components/alerts/AlertDestructive"
import AddedProducts from "./AddedProducts"

interface Props {
  order: Order
  className?: string
}

const EditCustomerOrderDialog = ({ order, className }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [orderItems, setOrderItems] = useState<ProductOrder[]>(
    order.products || []
  )

  const handleNextStep = () => setCurrentStep((prev) => prev + 1)
  const handlePrevStep = () => setCurrentStep((prev) => prev - 1)

  const handleAddProduct = (newProductOrder: ProductOrder) => {
    // console.log("Current Order Items:", orderItems)
    if (
      orderItems.some((item) => item.productId === newProductOrder.productId)
    ) {
      toast.error("Product already exists in the order!")
      return
    }
    setOrderItems((prev) => {
      console.log("Updated Order Items:", [...prev, newProductOrder])
      return [...prev, newProductOrder]
    })
  }

  const buttonDisabled =
    order?.status === "cancelled" || order?.paymentAction === "paid"

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className={`w-fit lg:w-full border border-x-slate-200 text-xs lg:text-sm tracking-wide disabled:cursor-not-allowed ${className}`}
          disabled={buttonDisabled}
        >
          Edit Order
        </Button>
      </DialogTrigger>

      <DialogContent
        className={` ${
          order?.status === "confirmed"
            ? "max-w-2xl h-fit p-1"
            : "max-w-3xl h-[500px] flex flex-col py-3 rounded-lg"
        }`}
      >
        {order?.status === "confirmed" ? (
          <AlertDestructive
            message="Your order is being confirmed and cannot be modified at this moment. 
            Kindly call Sowgreen Organic on 0546729407 / 0544437775 for assistance. 
            Thank you!"
          />
        ) : (
          <>
            <DialogHeader className="px-6 py-2">
              <DialogTitle className="flex items-center justify-between">
                {currentStep === 1 ? "Edit Order" : "Add New Product"}
                {/* Add Product Button (Step 1 Only) */}
                {currentStep === 1 && (
                  <Button variant="outline" onClick={handleNextStep}>
                    Add Product <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </DialogTitle>
            </DialogHeader>

            <DialogDescription className="flex-grow">
              {currentStep === 1 && (
                <EditCustomerOrder
                  orders={{ ...order, products: orderItems }}
                  setOrderItems={setOrderItems}
                  customer={true}
                />
              )}
              {currentStep === 2 && (
                <>
                  <div className="">
                    <SearchProduct
                      orders={order}
                      onAddProduct={handleAddProduct}
                    />
                    <AddedProducts
                      orders={{ ...order, products: orderItems }}
                      setOrderItems={setOrderItems}
                    />
                  </div>
                </>
              )}
            </DialogDescription>

            {/* Done Button (Step 2 Only) */}
            {currentStep === 2 && (
              <div className="mt-auto">
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  className="ml-auto"
                >
                  <ChevronLeft className="h-4 w-4" /> Done
                </Button>
              </div>
            )}

            <DialogFooter />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default EditCustomerOrderDialog
