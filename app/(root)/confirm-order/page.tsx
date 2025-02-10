"use client"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useMemo, useState } from "react"
import {
  useCartStore,
  useDeliveryStore,
  useOrderDataStore,
  useOrdersStore,
  usePaymentStore,
} from "@/store"

import CartDisplay from "./CartDisplay"
import { Button } from "@/components/ui/button"
import { PaystackButton } from "react-paystack"
import { date, formatCurrency, time } from "@/lib/utils"
import { CartItem, PaymentInfo, ProductOrder, VariantCartItem } from "@/types"
import { generateOrderNumber } from "@/lib/actions/whatsAppMessages/generateOrderNumber"
import { addTax } from "@/lib/addTax"
import InfoCard from "./InfoCard"
import { updatePurchaseCounts } from "@/lib/actions/updatePurchaseCount"
import { updateProductQuantities } from "@/lib/actions/updateProductQuantity"
import { useSession } from "next-auth/react"
import { deductBalance } from "@/lib/actions/deductBalance"
import { verifyTransaction } from "@/lib/actions/verifyTransaction"
import { generateOrderReceivedMessage } from "@/lib/actions/whatsAppMessages/generateOrderReceivedMessage"
import {
  sendOrderConfirmation,
  sendOrderReceived,
} from "@/lib/actions/sendWhatsappMessage"

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

  const session = useSession()
  const user = session?.data?.user
  const balance = activeUser?.user?.balance

  const router = useRouter()
  const searchParams = useSearchParams()
  const formData = Object.fromEntries(searchParams.entries())

  console.log(formData, "FORMDATA")

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

  const total = cartTotal

  const {
    updatedBalance,
    updatedOrderTotal,
    remainingAmount,
    proceedToPaystack,
  } = deductBalance(balance, total)

  const formattedSubtotal = formatCurrency(cartTotal, "GHS")
  const formattedDelivery = formatCurrency(deliveryFee, "GHS")
  const formattedTotal = formatCurrency(total, "GHS")

  const taxedOrders = orders.map((order) => ({
    ...order, // Spread the existing order object
    item: {
      ...order.item,
      price: order.item.price,
    },
    total: (order.item.price * order.quantity).toFixed(2),
  }))

  const { deliveryDate, ...newFormData } = formData
  const shippingInfo = {
    deliveryDate,
    ...formData,
    deliveryMethod: formData.deliveryMethod.split("-")[0],
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

  console.log(transformedCart, "transformedCart")

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
  const dataProps = {
    formData,
    formattedDelivery,
    cart,
    formattedSubtotal,
    formattedTotal,
    total,
    deliveryFee,
    deliveryDate,
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
          // paymentAction: "cash-on-delivery",
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
      }

      setOrdersData(ordersData)

      // Save shipping address
      const shippingResponse = await fetch("/api/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFormData),
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

      // Update purchase counts for products
      // const productIds = taxedOrders.map((product) => product.item?.id)
      // const productIds = transformedCart.map(
      //   (product) => product.item?.productId
      // )

      // const productQuantity = transformedCart.map(
      //   (product) => product.item?.quantity
      // )

      // await fetch("/api/products/updatePurchaseCount", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ productIds, productQuantity }),
      // })

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

      console.log(productIds, "productIdsIDDD")
      // console.log(newProductIds, "newProductIds")

      // sendWhatsAppMessage(ordersData)
      sendOrderReceived(ordersData)
      // sendOrderConfirmation(ordersData)
      console.log(ordersData, "ordersData----ordersData")

      clearCart() // Clear the cart after successful order processing
      router.push("/success/thank-you")

      // Update user balance (if applicable)
      // await fetch("/api/balance", {
      //   method: "PUT",
      //   headers: { "Content-type": "application/json" },
      //   body: JSON.stringify({
      //     email: user?.email,
      //     updatedBalance,
      //     phone: ordersData?.shippingAddress?.phone,
      //   }),
      // })

      // Update product quantities
      console.log(ordersData.products, "ORDERS DATA PRODUCTS")
      const quantityResponse = await fetch("/api/products/updateQuantity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: ordersData.products }),
      })
      if (!quantityResponse.ok) throw new Error("Quantity update API failed")
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
      <div className="mx-auto bg-white border border-neutral-500/25 rounded-xl p-6 max-w-5xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Confirm Order
        </h2>
        <InfoCard data={dataProps} />

        <div className="mt-8">
          <CartDisplay />
        </div>

        <div className="flex flex-col md:flex-row justify-between mt-8 gap-4">
          <Button
            disabled={isConfirming}
            onClick={() => router.push("/basket")}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
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
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all"
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

{
  /* {proceedToPaystack ? (
            <PaystackButton
              {...componentProps}
              className="bg-green-700 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-600 transition"
            />
          ) : (
            <Button
              onClick={() =>
                handlePaystackSuccessAction({
                  status: "success",
                  reference: "balance-only",
                })
              }
              className="bg-green-700 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Pay with Balance
            </Button>
          )} */
}
