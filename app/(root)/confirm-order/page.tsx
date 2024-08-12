"use client"
import { useRouter, useSearchParams } from "next/navigation"
import React from "react"
import { useCartStore, usePaymentStore } from "@/store"
import { getCartTotal } from "@/lib/getCartTotal"
import { Separator } from "@/components/ui/separator"
import Card from "./Card"
import CartDisplay from "./CartDisplay"
import { Button } from "@/components/ui/button"
import { PaystackButton } from "react-paystack"
import { date, time } from "@/lib/utils"

const ConfirmOrderPage = () => {
  const setReference = usePaymentStore((state) => state.setReference)

  const searchParams = useSearchParams()
  const router = useRouter()
  const cart = useCartStore((state) => state.cart)
  const basketTotal = getCartTotal(cart)

  const formData = Object.fromEntries(searchParams.entries())

  const config = {
    reference: new Date().getTime().toString(),
    email: formData.email,
    amount: parseInt(basketTotal) * 100,
    currency: "GHS",
    metadata: {
      custom_fields: [
        {
          display_name: "Name",
          variable_name: "name",
          value: formData.name,
        },
        {
          display_name: "Phone",
          variable_name: "phone",
          value: formData.phone,
        },
      ],
    },
    publicKey: process.env.PAYSTACK_PUBLIC_KEY,
  }

  const handlePaystackSuccessAction = (reference: any) => {
    // Implementation for whatever you want to do with reference and after success call.
    try {
      if (reference.status === "success") {
        setReference(reference)
        router.push("/success/thank-you")
      }
    } catch (error) {
      console.log(error)
    }
  }

  // you can call this function anything
  const handlePaystackCloseAction = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    console.log("closed")
  }

  const componentProps = {
    ...config,
    text: "Pay Now",
    onSuccess: (reference: any) => handlePaystackSuccessAction(reference),
    onClose: handlePaystackCloseAction,
  }

  return (
    <div className="container mx-auto min-h-screen p-8 bg-gray-100">
      <div className="mx-auto bg-white shadow-md rounded-lg p-6 max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Confirm Order & Pay
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6 ">
          <Card>
            <div className="flex flex-col gap-2 lg:gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">
                  Delivery Address
                </h3>
                <div className="flex flex-col items-end md:items-start">
                  <p className="text-gray-600">{formData.name}</p>
                  <p className="text-gray-600">{formData.address}</p>
                  <p className="text-gray-600">{formData.city}</p>
                  <p className="text-gray-600">{formData.region}</p>
                  <p className="text-gray-600">{formData.phone}</p>
                  <p className="text-gray-600">{formData.email}</p>
                </div>
              </div>
              <Separator className="my-2" />
              <div className="w-full">
                <h3 className="text-lg font-semibold text-gray-700">
                  Billing Address
                </h3>
                <p className="text-gray-600 flex justify-end md:justify-start ">
                  Same as Delivery Address
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex flex-col gap-2 lg:gap-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Order Summary
              </h3>
              <div className="flex justify-between">
                <p className="text-gray-600 text-sm font-medium">
                  Order Created:
                </p>
                <span className="font-medium">
                  {date} <span className="hidden lg:inline">at {time}</span>
                </span>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600 text-sm font-medium">
                  Quantity of Items:
                </p>
                <span className="font-medium">{cart.length}</span>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600 text-sm font-medium">
                  Delivery Fee:
                </p>
                <span className="font-medium">GHC 15.00</span>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600 text-sm font-medium">
                  Estimated Delivery:
                </p>
                <span className="font-medium">Same Day</span>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600 text-sm font-medium">Taxes:</p>
                <span className="font-medium">GHC 9.00</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <p>Total:</p>
                <span>GHC {basketTotal}</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-8">
          <CartDisplay />
        </div>

        <div className="flex flex-col md:flex-row justify-between mt-8 gap-4">
          <Button
            onClick={() => router.push("/basket")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Edit Order
          </Button>
          <PaystackButton
            {...componentProps}
            className="bg-green-700 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-600 transition"
          />
        </div>
      </div>
    </div>
  )
}

export default ConfirmOrderPage
