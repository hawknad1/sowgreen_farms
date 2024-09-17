"use client"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import {
  useCartStore,
  useDeliveryStore,
  useOrdersStore,
  usePaymentStore,
} from "@/store"
import { getCartTotal } from "@/lib/getCartTotal"
import { Separator } from "@/components/ui/separator"
import Card from "./Card"
import CartDisplay from "./CartDisplay"
import { Button } from "@/components/ui/button"
import { PaystackButton } from "react-paystack"
import { date, formatCurrency, time } from "@/lib/utils"
import groupById from "@/lib/groupById"
import { CartItem } from "@/types"
import { processCartItems } from "@/lib/processCartItems"
import { generateOrderNumber } from "@/lib/generateOrderNumber"
import { addTax } from "@/lib/addTax"
import InfoCard from "./InfoCard"

const ConfirmOrderPage = () => {
  const [referenceNumber, setReferenceNumber] = useState("")
  const { deliveryFee, setDeliveryFee } = useDeliveryStore()
  const setOrdersData = useOrdersStore((state) => state.setOrdersData)
  const cart = useCartStore((state) => state.cart)
  const clearCart = useCartStore((state) => state.clearCart)
  const [orders, setOrders] = useState<CartItem[]>([])

  const router = useRouter()
  const searchParams = useSearchParams()
  const formData = Object.fromEntries(searchParams.entries())

  const cartWithTax = cart.map((product) => ({
    ...product,
    price: addTax(product.price),
  }))

  const basketTotal = getCartTotal(cartWithTax)
  const total = parseFloat(basketTotal) + parseFloat(deliveryFee.toFixed(2))

  const formattedSubtotal = formatCurrency(parseFloat(basketTotal), "GHC")
  const formattedDelivery = formatCurrency(deliveryFee, "GHC")
  const formattedTotal = formatCurrency(total, "GHC")

  const dataProps = {
    formData,
    formattedDelivery,
    cart,
    formattedSubtotal,
    formattedTotal,
  }

  const taxedOrders = orders.map((order) => ({
    ...order, // Spread the existing order object
    item: {
      ...order.item,
      price: addTax(order.item.price),
    },
    total: (addTax(order.item.price) * order.quantity).toFixed(2),
  }))

  const { deliveryMethod, ...newFormData } = formData

  // Order number generator
  const orderNumber = generateOrderNumber()

  useEffect(() => {
    setOrders(processCartItems(cart)) // Using the helper function to set orders
  }, [cart])

  const config = {
    reference: new Date().getTime().toString(),
    email: formData.email,
    amount: total * 100,
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
    publicKey: process.env.PAYSTACK_PUBLIC_TEST_KEY as string,
  }

  async function handlePaystackSuccessAction(reference: any) {
    try {
      if (reference.status === "success") {
        setReferenceNumber(reference.reference)

        const ordersData = {
          products: taxedOrders,
          shippingAddress: newFormData,
          orderNumber,
          deliveryMethod: formData.deliveryMethod,
          referenceNumber: reference.reference,
          total: total,
        }

        const shippingResponse = await fetch("/api/address", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newFormData),
        })
        if (!shippingResponse.ok) throw new Error("Shipping API failed")

        const ordersResponse = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ordersData),
        })
        if (!ordersResponse.ok) throw new Error("Orders API failed")

        // Store ordersData in Zustand and navigate to ThankYouPage
        setOrdersData(ordersData)

        const email = await fetch("/api/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ordersData),
        })
        if (!email.ok) throw new Error("Email API failed")

        clearCart() // Clear cart after successful API calls

        router.push("/success/thank-you")
      }
    } catch (error) {
      console.error("Payment processing error:", error)
    }
  }

  const handlePaystackCloseAction = () => {
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
        <InfoCard data={dataProps} />

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
