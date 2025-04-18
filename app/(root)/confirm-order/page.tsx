"use client"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useMemo, useState } from "react"
import {
  useCartStore,
  useDeliveryStore,
  useOrderDataStore,
  useOrdersStore,
  usePaymentStore,
  useUserListStore,
} from "@/store"

import CartDisplay from "./CartDisplay"
import { Button } from "@/components/ui/button"
import { date, formatCurrency, time } from "@/lib/utils"
import { CartItem, PaymentInfo, ProductOrder, VariantCartItem } from "@/types"
import { generateOrderNumber } from "@/lib/actions/whatsAppMessages/generateOrderNumber"
import InfoCard from "./InfoCard"
import { useSession } from "next-auth/react"
import { deductBalance } from "@/lib/actions/deductBalance"

export type User = {
  user: {
    id: string
    name: string
    role: string
    balance: number
    email: string
  }
}

const ConfirmOrderPage = () => {
  const [referenceNumber, setReferenceNumber] = useState("")
  const setDeliveryFee = useDeliveryStore((state) => state.setDeliveryFee)
  const [activeUser, setActiveUser] = useState<User | null>(null)
  const setOrdersData = useOrderDataStore((state) => state.setOrdersData)
  // const cart = useCartStore((state) => state.cart)
  const { cartTotal, cart } = useCartStore()
  const clearCart = useCartStore((state) => state.clearCart)
  const [orders, setOrders] = useState<CartItem[]>([])
  const [result, setResult] = useState<PaymentInfo>(null)
  // const [paymentAction, setPaymentAction] = useState<string | null>(null)
  const deliveryFee = useDeliveryStore((state) => state.deliveryFee)
  const setCartProducts = useCartStore((state) => state.setCartProducts)
  const [isConfirming, setIsConfirming] = useState(false)
  // const { balance } = useUserListStore()

  const session = useSession()
  const user = session?.data?.user
  // const balance = activeUser?.user?.balance

  const router = useRouter()
  const searchParams = useSearchParams()
  const formData = Object.fromEntries(searchParams.entries())

  useEffect(() => {
    if (!user?.email) return

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/${user.email}`, {
          method: "GET",
          cache: "no-store",
        })
        if (!res.ok) {
          console.error("Failed to fetch user:", res.statusText)
          return
        }
        const userData = await res.json()
        setActiveUser(userData)
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }

    fetchUser()
  }, [user?.email])

  let total = cartTotal
  let conbinedTotal = total + deliveryFee
  const balance = user?.balance

  const formattedSubtotal = formatCurrency(cartTotal, "GHS")
  const formattedDelivery = formatCurrency(deliveryFee, "GHS")
  const formattedTotal = formatCurrency(total, "GHS")

  const { deliveryDate, ...newFormData } = formData
  const whatsappOptIn = formData.whatsappOptIn === "true"

  const shippingInfo = {
    deliveryDate,
    ...formData,
    whatsappOptIn, // Convert string to boolean
    deliveryMethod: formData.deliveryMethod.split("-")[0],
  }

  const { deliveryMethod, ...addressData } = formData
  const cleanDeliveryMethod = deliveryMethod.split("-")[0].trim()

  const addressPayload = {
    ...addressData,
    deliveryDate,
    whatsappOptIn, // Convert string to boolean
    deliveryMethod: cleanDeliveryMethod,
  }

  const userWhatsappOptIn = {
    customerPhone: `+233${formData.phone.substring(1)}`,
    whatsappOptIn: whatsappOptIn,
    timestamp: new Date(),
    method: "checkbox",
  }

  // Order number generator
  const orderNumber = generateOrderNumber()

  const transformCart = (cart: any[]) => {
    return cart.map((item: VariantCartItem) => ({
      item: {
        price: item.price, // Include price
        weight: item.weight, // Include weight
        productId: item.productId,
        quantity: item.quantity,
        unit: item.unit,
        variantId: item.variantId,
        product: item.product,
      },
      quantity: item.quantity, // Top-level quantity
      total: (item.price * item.quantity).toFixed(2), // Total as a string
    }))
  }

  const transformedCart = transformCart(cart)

  const { updatedOrderTotal, remainingAmount, deductedBalance } = deductBalance(
    balance,
    conbinedTotal
  )

  const dataProps = {
    formData,
    formattedDelivery,
    cart,
    formattedSubtotal,
    formattedTotal,
    total,
    deliveryFee,
    deliveryDate,
    updatedOrderTotal,
  }

  const config = {
    reference: new Date().getTime().toString(),
    email: formData.email,
    amount: Math.round(remainingAmount * 100), // Ensure amount is an integer
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

  async function handlePaystackSuccessAction(reference?: any) {
    setIsConfirming(true)

    try {
      let verifyData: PaymentInfo = null

      if (
        reference.status === "success" &&
        reference.reference !== "cash-on-delivery"
      ) {
        // Paystack transaction: Verify with Paystack
        const verifyTransaction = await fetch("/api/verify-transaction", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reference: reference?.reference }),
        })

        if (!verifyTransaction.ok)
          throw new Error("Failed to verify transaction")

        const verifiedResponse = await verifyTransaction.json()
        verifyData = {
          ...verifiedResponse,
          paymentAction: "paid",
        }
        setResult(verifyData)
      } else if (reference.reference === "cash-on-delivery") {
        // Non-Paystack transaction

        verifyData = {
          status: "success",
          paymentMode: "cash",
          paymentAction: "pending",
          cardType: null,
          last4Digits: null,
        }
        setResult(verifyData)
      } else {
        throw new Error("Invalid payment reference")
      }

      const ordersData = {
        products: transformedCart,
        shippingAddress: shippingInfo,
        orderNumber,
        // deliveryMethod:,
        deliveryDate,
        deliveryFee: deliveryFee,
        referenceNumber: reference?.reference || "cash-on-delivery",
        cardType: verifyData?.cardType,
        last4Digits: verifyData?.last4Digits,
        paymentMode: verifyData?.paymentMode,
        paymentAction: verifyData?.paymentAction,
        total: total,
        creditAppliedTotal: balance,
        balanceDeducted: deductedBalance,
        // whatsappOptIn: whatsappOptIn,
        userWhatsappOptIn,
        updatedOrderTotal,
        remainingAmount,
      }

      setOrdersData(ordersData)

      // Save shipping address
      const shippingResponse = await fetch("/api/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressPayload),
      })
      if (!shippingResponse.ok) throw new Error("Shipping API failed")

      // Save order
      const ordersResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ordersData),
      })
      if (!ordersResponse.ok) throw new Error("Orders API failed")

      // Send order confirmation email
      const email = await fetch("/api/send-order-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: ordersData }),
      })
      if (!email.ok) throw new Error("Email API failed")

      const productIds = transformedCart.map(
        (product) => product.item.productId
      )
      const productQuantity = transformedCart.map(
        (product) => product.item.quantity
      )

      await fetch("/api/products/updatePurchaseCount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: transformedCart }),
      })

      // sendWhatsAppMessage(ordersData)
      // sendOrderReceived(ordersData)
      // sendOrderConfirmation(ordersData)

      // whatsapp -- send- api
      // await fetch("/api/sendWhatsapp", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     customerName: formData.name,
      //     orderNumber,
      //     customerPhone: formData.phone,
      //     deliveryDate: formData.deliveryDate,
      //     deliveryMethod: formData.deliveryMethod,
      //     address: formData.address,
      //     products: transformedCart, // Ensure this is an array of objects with product details
      //     deliveryFee,
      //     total,
      //   }),
      // })

      router.push("/success/thank-you")

      // Update product quantities
      const quantityResponse = await fetch("/api/products/updateQuantity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: ordersData.products }),
      })
      if (!quantityResponse.ok) throw new Error("Quantity update API failed")

      clearCart() // Clear the cart after successful order processing
    } catch (error) {
      console.error("Payment processing error:", error)
    } finally {
      setIsConfirming(false)
    }
  }

  const handlePaystackCloseAction = () => {
    console.log("closed")
  }

  const componentProps = {
    ...config,
    text: "Pay with card",
    onSuccess: (reference: any) => handlePaystackSuccessAction(reference),
    onClose: handlePaystackCloseAction,
  }

  return (
    <div className="container mx-auto min-h-screen p-8">
      <div className="mx-auto lg:max-w-5xl w-full bg-white">
        <h2 className="lg:text-3xl text-xl font-bold mb-4 lg:mb-8 text-center text-gray-800">
          Confirm Order
        </h2>
        <InfoCard data={dataProps} />

        <div className="mt-8">
          <CartDisplay />
        </div>

        <div className="w-full flex justify-between mt-8 gap-4">
          <Button
            disabled={isConfirming}
            onClick={() => router.push("/basket")}
            className="bg-blue-500 text-white text-sm px-6 py-3 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
          >
            Edit Order
          </Button>
          <Button
            onClick={() =>
              handlePaystackSuccessAction({
                status: "success",
                reference: "cash-on-delivery",
              })
            }
            disabled={isConfirming}
            className="bg-sowgren_Color text-white px-6 py-3 text-sm rounded-lg hover:bg-sowgren_Color/85 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all"
          >
            {isConfirming ? (
              <span className="flex items-center gap-2">
                <span className="loading loading-spinner loading-md"></span>
                Processing order...
              </span>
            ) : (
              "Place Order"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmOrderPage
