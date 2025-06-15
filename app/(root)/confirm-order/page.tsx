// "use client"
// import { useRouter, useSearchParams } from "next/navigation"
// import React, { useEffect, useState } from "react"
// import { useCartStore, useDeliveryStore, useOrderDataStore } from "@/store"

// import CartDisplay from "./CartDisplay"
// import { Button } from "@/components/ui/button"
// import { formatCurrency } from "@/lib/utils"
// import { PaymentInfo, VariantCartItem } from "@/types"
// import { generateOrderNumber } from "@/lib/actions/whatsAppMessages/generateOrderNumber"
// import InfoCard from "./InfoCard"
// import { useSession } from "next-auth/react"
// import { deductBalance } from "@/lib/actions/deductBalance"

// export type User = {
//   user: {
//     id: string
//     name: string
//     role: string
//     balance: number
//     email: string
//   }
// }

// const ConfirmOrderPage = () => {
//   const [activeUser, setActiveUser] = useState<User | null>(null)
//   const setOrdersData = useOrderDataStore((state) => state.setOrdersData)
//   const { cartTotal, cart } = useCartStore()
//   const clearCart = useCartStore((state) => state.clearCart)
//   const [result, setResult] = useState<PaymentInfo>(null)
//   const deliveryFee = useDeliveryStore((state) => state.deliveryFee)
//   const [isConfirming, setIsConfirming] = useState(false)

//   const session = useSession()
//   const user = session?.data?.user

//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const formData = Object.fromEntries(searchParams.entries())

//   useEffect(() => {
//     if (!user?.email) return

//     const fetchUser = async () => {
//       try {
//         const res = await fetch(`/api/user/${user.email}`, {
//           method: "GET",
//           cache: "no-store",
//         })
//         if (!res.ok) {
//           console.error("Failed to fetch user:", res.statusText)
//           return
//         }
//         const userData = await res.json()
//         setActiveUser(userData)
//       } catch (error) {
//         console.error("Error fetching user:", error)
//       }
//     }

//     fetchUser()
//   }, [user?.email])

//   let total = cartTotal
//   let conbinedTotal = total + deliveryFee
//   const balance = activeUser?.user?.balance

//   const formattedSubtotal = formatCurrency(cartTotal, "GHS")
//   const formattedDelivery = formatCurrency(deliveryFee, "GHS")
//   const formattedTotal = formatCurrency(total, "GHS")

//   const { deliveryDate, ...newFormData } = formData
//   const whatsappOptIn = formData.whatsappOptIn === "true"

//   const shippingInfo = {
//     deliveryDate,
//     ...formData,
//     whatsappOptIn, // Convert string to boolean
//     deliveryMethod: formData.deliveryMethod.split("-")[0],
//   }

//   const { deliveryMethod, ...addressData } = formData
//   const cleanDeliveryMethod = deliveryMethod.split("-")[0].trim()

//   const addressPayload = {
//     ...addressData,
//     deliveryDate,
//     whatsappOptIn, // Convert string to boolean
//     deliveryMethod: cleanDeliveryMethod,
//   }

//   const userWhatsappOptIn = {
//     customerPhone: `+233${formData.phone.substring(1)}`,
//     whatsappOptIn: whatsappOptIn,
//     timestamp: new Date(),
//     method: "checkbox",
//   }

//   // Order number generator
//   const orderNumber = generateOrderNumber()

//   const transformCart = (cart: any[]) => {
//     return cart.map((item: VariantCartItem) => ({
//       item: {
//         price: item.price, // Include price
//         weight: item.weight, // Include weight
//         productId: item.productId,
//         quantity: item.quantity,
//         unit: item.unit,
//         variantId: item.variantId,
//         product: item.product,
//       },
//       quantity: item.quantity, // Top-level quantity
//       total: (item.price * item.quantity).toFixed(2), // Total as a string
//     }))
//   }

//   const transformedCart = transformCart(cart)

//   const { updatedOrderTotal, remainingAmount, deductedBalance } = deductBalance(
//     balance,
//     conbinedTotal
//   )

//   const dataProps = {
//     formData,
//     formattedDelivery,
//     cart,
//     formattedSubtotal,
//     formattedTotal,
//     total,
//     deliveryFee,
//     deliveryDate,
//     updatedOrderTotal,
//   }

//   const config = {
//     reference: new Date().getTime().toString(),
//     email: formData.email,
//     amount: Math.round(remainingAmount * 100), // Ensure amount is an integer
//     currency: "GHS",
//     metadata: {
//       custom_fields: [
//         {
//           display_name: "Name",
//           variable_name: "name",
//           value: formData.name,
//         },
//         {
//           display_name: "Phone",
//           variable_name: "phone",
//           value: formData.phone,
//         },
//       ],
//     },
//     publicKey: process.env.PAYSTACK_PUBLIC_TEST_KEY as string,
//   }

//   async function handlePaystackSuccessAction(reference?: any) {
//     setIsConfirming(true)

//     try {
//       let verifyData: PaymentInfo = null

//       if (
//         reference.status === "success" &&
//         reference.reference !== "cash-on-delivery"
//       ) {
//         // Paystack transaction: Verify with Paystack
//         const verifyTransaction = await fetch("/api/verify-transaction", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ reference: reference?.reference }),
//         })

//         if (!verifyTransaction.ok)
//           throw new Error("Failed to verify transaction")

//         const verifiedResponse = await verifyTransaction.json()
//         verifyData = {
//           ...verifiedResponse,
//           paymentAction: "paid",
//         }
//         setResult(verifyData)
//       } else if (reference.reference === "cash-on-delivery") {
//         // Non-Paystack transaction

//         verifyData = {
//           status: "success",
//           paymentMode: "cash",
//           paymentAction: "pending",
//           cardType: null,
//           last4Digits: null,
//         }
//         setResult(verifyData)
//       } else {
//         throw new Error("Invalid payment reference")
//       }

//       const ordersData = {
//         products: transformedCart,
//         shippingAddress: shippingInfo,
//         orderNumber,
//         // deliveryMethod:,
//         deliveryDate,
//         deliveryFee: deliveryFee,
//         referenceNumber: reference?.reference || "cash-on-delivery",
//         cardType: verifyData?.cardType,
//         last4Digits: verifyData?.last4Digits,
//         paymentMode: verifyData?.paymentMode,
//         paymentAction: verifyData?.paymentAction,
//         total: total,
//         creditAppliedTotal: balance,
//         balanceDeducted: deductedBalance,
//         userWhatsappOptIn,
//         updatedOrderTotal,
//         remainingAmount,
//       }

//       setOrdersData(ordersData)

//       // Save shipping address
//       const shippingResponse = await fetch("/api/address", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(addressPayload),
//       })
//       if (!shippingResponse.ok) throw new Error("Shipping API failed")

//       // Save order
//       const ordersResponse = await fetch("/api/orders", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(ordersData),
//       })
//       if (!ordersResponse.ok) throw new Error("Orders API failed")

//       // Send order confirmation email
//       const email = await fetch("/api/send-order-email", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ order: ordersData }),
//       })
//       if (!email.ok) throw new Error("Email API failed")

//       const productIds = transformedCart.map(
//         (product) => product.item.productId
//       )
//       const productQuantity = transformedCart.map(
//         (product) => product.item.quantity
//       )

//       await fetch("/api/products/updatePurchaseCount", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ products: transformedCart }),
//       })

//       router.push("/success/thank-you")
//       clearCart() // Clear the cart after successful order processing

//       // Update product quantities
//       const quantityResponse = await fetch("/api/products/updateQuantity", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ products: ordersData.products }),
//       })
//       if (!quantityResponse.ok) throw new Error("Quantity update API failed")
//     } catch (error) {
//       console.error("Payment processing error:", error)
//     } finally {
//       setIsConfirming(false)
//     }
//   }

//   const handlePaystackCloseAction = () => {
//     console.log("closed")
//   }

//   const componentProps = {
//     ...config,
//     text: "Pay with card",
//     onSuccess: (reference: any) => handlePaystackSuccessAction(reference),
//     onClose: handlePaystackCloseAction,
//   }

//   return (
//     <div className="container mx-auto min-h-screen p-8">
//       <div className="mx-auto lg:max-w-5xl w-full bg-white">
//         <h2 className="lg:text-3xl text-xl font-bold mb-4 lg:mb-8 text-center text-gray-800">
//           Confirm Order
//         </h2>
//         <InfoCard data={dataProps} />

//         <div className="mt-8">
//           <CartDisplay />
//         </div>

//         <div className="w-full flex justify-between mt-8 gap-4">
//           <Button
//             disabled={isConfirming}
//             onClick={() => router.push("/basket")}
//             className="bg-blue-500 text-white text-sm px-6 py-3 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
//           >
//             Edit Order
//           </Button>
//           <Button
//             onClick={() =>
//               handlePaystackSuccessAction({
//                 status: "success",
//                 reference: "cash-on-delivery",
//               })
//             }
//             disabled={isConfirming}
//             className="bg-sowgren_Color text-white px-6 py-3 text-sm rounded-lg hover:bg-sowgren_Color/85 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all"
//           >
//             {isConfirming ? (
//               <span className="flex items-center gap-2">
//                 <span className="loading loading-spinner loading-md"></span>
//                 Processing order...
//               </span>
//             ) : (
//               "Place Order"
//             )}
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ConfirmOrderPage

"use client"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import { useCartStore, useDeliveryStore, useOrderDataStore } from "@/store"
import CartDisplay from "./CartDisplay"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { PaymentInfo, VariantCartItem } from "@/types"
import { generateOrderNumber } from "@/lib/actions/whatsAppMessages/generateOrderNumber"
import InfoCard, { DeliveryMethod } from "./InfoCard"
import { useSession } from "next-auth/react"
import { deductBalance } from "@/lib/actions/deductBalance"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { FaTruck } from "react-icons/fa"
import PaymentConfirmationSection from "./PaymentConfirmationSection "

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
  const [activeUser, setActiveUser] = useState<User | null>(null)
  const setOrdersData = useOrderDataStore((state) => state.setOrdersData)
  const { cartTotal, cart } = useCartStore()
  const clearCart = useCartStore((state) => state.clearCart)
  const [result, setResult] = useState<PaymentInfo>(null)
  const deliveryFee = useDeliveryStore((state) => state.deliveryFee)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isLoadingUser, setIsLoadingUser] = useState(true)

  const session = useSession()
  const user = session?.data?.user

  const router = useRouter()
  const searchParams = useSearchParams()
  const formData = Object.fromEntries(searchParams.entries())

  useEffect(() => {
    if (!user?.email) {
      setIsLoadingUser(false)
      return
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/${user.email}`, {
          method: "GET",
          cache: "no-store",
        })
        if (!res.ok) {
          throw new Error("Failed to fetch user data")
        }
        const userData = await res.json()
        setActiveUser(userData)
      } catch (error) {
        console.error("Error fetching user:", error)
        toast.error("Failed to load user information")
      } finally {
        setIsLoadingUser(false)
      }
    }

    fetchUser()
  }, [user?.email])

  // let total = cartTotal
  // let combinedTotal = cartTotal + deliveryFee
  // const balance = activeUser?.user?.balance

  let total = cartTotal
  let conbinedTotal = total + deliveryFee
  const balance = activeUser?.user?.balance

  const formattedSubtotal = formatCurrency(cartTotal, "GHS")
  const formattedDelivery = formatCurrency(deliveryFee, "GHS")
  const formattedTotal = formatCurrency(total, "GHS")

  const { deliveryDate, ...newFormData } = formData
  const whatsappOptIn = formData.whatsappOptIn === "true"

  const shippingInfo = {
    deliveryDate,
    ...formData,
    whatsappOptIn,
    deliveryMethod: formData.deliveryMethod.split("-")[0],
  }

  const { deliveryMethod, ...addressData } = formData
  const cleanDeliveryMethod = deliveryMethod.split("-")[0].trim()

  const addressPayload = {
    ...addressData,
    deliveryDate,
    whatsappOptIn,
    deliveryMethod: cleanDeliveryMethod,
  }

  const userWhatsappOptIn = {
    customerPhone: `+233${formData.phone.substring(1)}`,
    whatsappOptIn: whatsappOptIn,
    timestamp: new Date(),
    method: "checkbox",
  }

  const orderNumber = generateOrderNumber()

  const transformCart = (cart: any[]) => {
    return cart.map((item: VariantCartItem) => ({
      item: {
        price: item.price,
        weight: item.weight,
        productId: item.productId,
        quantity: item.quantity,
        unit: item.unit,
        variantId: item.variantId,
        product: item.product,
      },
      quantity: item.quantity,
      total: (item.price * item.quantity).toFixed(2),
    }))
  }

  const transformedCart = transformCart(cart)

  const { updatedOrderTotal, remainingAmount, deductedBalance } = deductBalance(
    balance,
    conbinedTotal
  )

  // const dataProps = {
  //   formData,
  //   formattedDelivery,
  //   cart,
  //   formattedSubtotal,
  //   formattedTotal,
  //   total: combinedTotal,
  //   deliveryFee,
  //   deliveryDate,
  //   updatedOrderTotal,
  // }

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
    amount: Math.round(remainingAmount * 100),
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
    const toastId = toast.loading("Processing your order...")

    try {
      let verifyData: PaymentInfo = null

      if (
        reference?.status === "success" &&
        reference?.reference !== "cash-on-delivery"
      ) {
        const verifyTransaction = await fetch("/api/verify-transaction", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reference: reference?.reference }),
        })

        if (!verifyTransaction.ok) {
          throw new Error("Failed to verify transaction")
        }

        const verifiedResponse = await verifyTransaction.json()
        verifyData = {
          ...verifiedResponse,
          paymentAction: "paid",
        }
        setResult(verifyData)
      } else if (reference?.reference === "cash-on-delivery") {
        verifyData = {
          status: "success",
          paymentMode: "cash",
          paymentAction: "pending",
          cardType: null,
          last4Digits: null,
        }
        setResult(verifyData)
      } else {
        throw new Error("Invalid payment reference or status")
      }

      const ordersData = {
        products: transformedCart,
        shippingAddress: shippingInfo,
        orderNumber,
        deliveryDate,
        deliveryFee: deliveryFee,
        referenceNumber: reference?.reference || "cash-on-delivery",
        cardType: verifyData?.cardType,
        last4Digits: verifyData?.last4Digits,
        paymentMode: verifyData?.paymentMode,
        paymentAction: verifyData?.paymentAction,
        total: total,
        subtotal: cartTotal,
        creditAppliedTotal: balance,
        balanceDeducted: deductedBalance,
        userWhatsappOptIn,
        updatedOrderTotal,
        remainingAmount,
      }

      setOrdersData(ordersData)

      // API Calls
      const shippingResponse = await fetch("/api/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressPayload),
      })
      if (!shippingResponse.ok)
        throw new Error("Failed to save shipping address.")

      const ordersResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ordersData),
      })
      if (!ordersResponse.ok) throw new Error("Failed to save order.")

      await fetch("/api/products/updatePurchaseCount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: transformedCart }),
      })

      const quantityResponse = await fetch("/api/products/updateQuantity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: ordersData.products }),
      })
      if (!quantityResponse.ok)
        throw new Error("Failed to update product quantities.")

      const email = await fetch("/api/send-order-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: ordersData }),
      })
      if (!email.ok) throw new Error("Failed to send order confirmation email.")

      clearCart()
      toast.success("Order placed successfully!", { id: toastId })
      router.push("/success/thank-you")
    } catch (error) {
      console.error("Order processing error:", error)
      toast.error(`Order failed: ${error || "Please try again."}`, {
        id: toastId,
      })
    } finally {
      setIsConfirming(false)
    }
  }

  const handlePaystackCloseAction = () => {
    toast.info("Payment was cancelled")
  }

  const componentProps = {
    ...config,
    text: "Pay with card",
    onSuccess: (reference: any) => handlePaystackSuccessAction(reference),
    onClose: handlePaystackCloseAction,
  }

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Loading your information...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
      <div className="w-full max-w-6xl bg-white rounded-xl overflow-hidden animate-fade-in border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-green-600 p-6 sm:p-8 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Confirm Your Order
            </h1>
            <p className="text-sm sm:text-base opacity-90">
              Review your items and delivery information before placing your
              order.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-6 md:p-8">
          {/* Mobile Layout: Delivery Info -> Cart -> Payment */}
          <div className="lg:hidden space-y-6">
            {/* Delivery Information Card (Mobile) */}
            <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 border-b-2 border-primary pb-2 mb-4 flex items-center">
                <span className="text-primary pr-2">1.</span> Delivery
                Information
              </h2>
              <div className="bg-blue-50/50 p-4 sm:p-6 rounded-lg border border-blue-100 mb-4">
                <div className="space-y-3">
                  <p className="text-sm md:text-base text-gray-700">
                    {formData?.name || "N/A"}
                  </p>
                  <p className="text-sm md:text-base text-gray-700">
                    {formData?.address || "N/A"}, {formData?.city || "N/A"}
                  </p>
                  <p className="text-sm md:text-base text-gray-700">
                    {formData?.region || "N/A"}
                  </p>
                  <p className="text-sm md:text-base text-gray-700">
                    {formData?.phone || "N/A"}
                  </p>
                  <p className="text-sm md:text-base text-gray-700">
                    {formData?.email || "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 border-b-2 border-primary pb-2 mb-4 flex items-center">
                  <span className="text-primary pr-2">
                    <FaTruck className="text-green-500 text-lg" />
                  </span>
                  Delivery Method
                </h2>
                <DeliveryMethod data={dataProps} />
              </div>
            </div>

            {/* Cart Display (Mobile) - Full Width */}
            <div className="bg-white rounded-lg p-4 sm:p-6 ">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Items in Your Basket
              </h3>
              <CartDisplay />
            </div>

            {/* Payment & Confirmation Card (Mobile) */}
            <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 border-b-2 border-primary pb-2 mb-4 flex items-center">
                <span className="text-primary pr-2">2.</span> Payment &
                Confirmation
              </h2>
              <PaymentConfirmationSection
                formattedSubtotal={formattedSubtotal}
                formattedDelivery={formattedDelivery}
                deliveryFee={deliveryFee}
                deductedBalance={deductedBalance}
                formattedTotal={formattedTotal}
                updatedOrderTotal={updatedOrderTotal}
                balance={balance}
                total={total}
                isConfirming={isConfirming}
                router={router}
                handlePaystackSuccessAction={handlePaystackSuccessAction}
                remainingAmount={remainingAmount}
              />
            </div>
          </div>

          {/* Desktop Layout: Side-by-side cards with cart below */}
          <div className="hidden lg:block">
            {/* Top Row: Delivery Info and Payment Cards */}
            <div className="grid grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
              {/* Delivery Information Card (Desktop) */}
              <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 h-full flex flex-col">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 border-b-2 border-primary pb-2 mb-4 flex items-center">
                  <span className="text-primary pr-2">1.</span> Delivery
                  Information
                </h2>
                <div className="bg-blue-50/50 p-4 sm:p-6 rounded-lg border border-blue-100 mb-4 flex-grow">
                  <div className="space-y-3">
                    <p className="text-sm md:text-base text-gray-700">
                      {formData?.name || "N/A"}
                    </p>
                    <p className="text-sm md:text-base text-gray-700">
                      {formData?.address || "N/A"}, {formData?.city || "N/A"}
                    </p>
                    <p className="text-sm md:text-base text-gray-700">
                      {formData?.region || "N/A"}
                    </p>
                    <p className="text-sm md:text-base text-gray-700">
                      {formData?.phone || "N/A"}
                    </p>
                    <p className="text-sm md:text-base text-gray-700">
                      {formData?.email || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="mt-auto">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 border-b-2 border-primary pb-2 mb-4 flex items-center">
                    <span className="text-primary pr-2">
                      <FaTruck className="text-green-500 text-lg" />
                    </span>
                    Delivery Method
                  </h2>
                  <DeliveryMethod data={dataProps} />
                </div>
              </div>

              {/* Payment & Confirmation Card (Desktop) */}
              <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 h-full">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 border-b-2 border-primary pb-2 mb-4 flex items-center">
                  <span className="text-primary pr-2">2.</span> Payment &
                  Confirmation
                </h2>
                <PaymentConfirmationSection
                  formattedSubtotal={formattedSubtotal}
                  formattedDelivery={formattedDelivery}
                  deductedBalance={deductedBalance}
                  deliveryFee={deliveryFee}
                  formattedTotal={formattedTotal}
                  updatedOrderTotal={updatedOrderTotal}
                  balance={balance}
                  total={total}
                  isConfirming={isConfirming}
                  router={router}
                  handlePaystackSuccessAction={handlePaystackSuccessAction}
                  remainingAmount={remainingAmount}
                />
              </div>
            </div>

            {/* Full Width Cart Display (Desktop) */}
            <div className="bg-white rounded-lg py-4 sm:py-6 w-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Items in Your Basket
              </h3>
              <CartDisplay />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmOrderPage

// // ConfirmOrderPage.tsx
// "use client"
// import { useRouter, useSearchParams } from "next/navigation"
// import React, { useEffect, useState } from "react"
// import { useCartStore, useDeliveryStore, useOrderDataStore } from "@/store"
// import CartDisplay from "./CartDisplay"
// import { Button } from "@/components/ui/button"
// import { formatCurrency } from "@/lib/utils"
// import { PaymentInfo, VariantCartItem } from "@/types"
// import { generateOrderNumber } from "@/lib/actions/whatsAppMessages/generateOrderNumber"
// import InfoCard from "./InfoCard" // Assuming InfoCard is also enhanced
// import { useSession } from "next-auth/react"
// import { deductBalance } from "@/lib/actions/deductBalance"

// export type User = {
//   user: {
//     id: string
//     name: string
//     role: string
//     balance: number
//     email: string
//   }
// }

// const ConfirmOrderPage = () => {
//   const [activeUser, setActiveUser] = useState<User | null>(null)
//   const setOrdersData = useOrderDataStore((state) => state.setOrdersData)
//   const { cartTotal, cart } = useCartStore()
//   const clearCart = useCartStore((state) => state.clearCart)
//   const [result, setResult] = useState<PaymentInfo>(null) // result seems unused, consider removing if not needed for UI
//   const deliveryFee = useDeliveryStore((state) => state.deliveryFee)
//   const [isConfirming, setIsConfirming] = useState(false)

//   const session = useSession()
//   const user = session?.data?.user

//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const formData = Object.fromEntries(searchParams.entries())

//   useEffect(() => {
//     if (!user?.email) {
//       // Potentially redirect or show an error if user email is missing
//       // router.push('/login');
//       return
//     }

//     const fetchUser = async () => {
//       try {
//         const res = await fetch(`/api/user/${user.email}`, {
//           method: "GET",
//           cache: "no-store",
//         })
//         if (!res.ok) {
//           console.error("Failed to fetch user:", res.statusText)
//           // Handle error gracefully, maybe show a message to the user
//           return
//         }
//         const userData = await res.json()
//         setActiveUser(userData)
//       } catch (error) {
//         console.error("Error fetching user:", error)
//         // Handle error gracefully
//       }
//     }

//     fetchUser()
//   }, [user?.email])

//   let total = cartTotal
//   let conbinedTotal = total + deliveryFee
//   const balance = activeUser?.user?.balance

//   const formattedSubtotal = formatCurrency(cartTotal, "GHS")
//   const formattedDelivery = formatCurrency(deliveryFee, "GHS")
//   const formattedTotal = formatCurrency(conbinedTotal, "GHS") // Use combined total for the final display

//   const { deliveryDate, ...newFormData } = formData
//   const whatsappOptIn = formData.whatsappOptIn === "true"

//   const shippingInfo = {
//     deliveryDate,
//     ...formData,
//     whatsappOptIn, // Convert string to boolean
//     deliveryMethod: formData.deliveryMethod.split("-")[0],
//   }

//   const { deliveryMethod, ...addressData } = formData
//   const cleanDeliveryMethod = deliveryMethod.split("-")[0].trim()

//   const addressPayload = {
//     ...addressData,
//     deliveryDate,
//     whatsappOptIn, // Convert string to boolean
//     deliveryMethod: cleanDeliveryMethod,
//   }

//   const userWhatsappOptIn = {
//     customerPhone: `+233${formData.phone.substring(1)}`,
//     whatsappOptIn: whatsappOptIn,
//     timestamp: new Date(),
//     method: "checkbox",
//   }

//   // Order number generator
//   const orderNumber = generateOrderNumber()

//   const transformCart = (cart: any[]) => {
//     return cart.map((item: VariantCartItem) => ({
//       item: {
//         price: item.price, // Include price
//         weight: item.weight, // Include weight
//         productId: item.productId,
//         quantity: item.quantity,
//         unit: item.unit,
//         variantId: item.variantId,
//         product: item.product,
//       },
//       quantity: item.quantity, // Top-level quantity
//       total: (item.price * item.quantity).toFixed(2), // Total as a string
//     }))
//   }

//   const transformedCart = transformCart(cart)

//   const { updatedOrderTotal, remainingAmount, deductedBalance } = deductBalance(
//     balance,
//     conbinedTotal
//   )

//   const dataProps = {
//     formData,
//     formattedDelivery,
//     cart,
//     formattedSubtotal,
//     formattedTotal,
//     total: conbinedTotal, // Pass the combined total for clarity in InfoCard
//     deliveryFee,
//     deliveryDate,
//     updatedOrderTotal,
//   }

//   const config = {
//     reference: new Date().getTime().toString(),
//     email: formData.email,
//     amount: Math.round(remainingAmount * 100), // Ensure amount is an integer
//     currency: "GHS",
//     metadata: {
//       custom_fields: [
//         {
//           display_name: "Name",
//           variable_name: "name",
//           value: formData.name,
//         },
//         {
//           display_name: "Phone",
//           variable_name: "phone",
//           value: formData.phone,
//         },
//       ],
//     },
//     publicKey: process.env.PAYSTACK_PUBLIC_TEST_KEY as string,
//   }

//   async function handlePaystackSuccessAction(reference?: any) {
//     setIsConfirming(true)

//     try {
//       let verifyData: PaymentInfo = null

//       if (
//         reference?.status === "success" &&
//         reference?.reference !== "cash-on-delivery"
//       ) {
//         // Paystack transaction: Verify with Paystack
//         const verifyTransaction = await fetch("/api/verify-transaction", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ reference: reference?.reference }),
//         })

//         if (!verifyTransaction.ok) {
//           throw new Error("Failed to verify transaction")
//         }

//         const verifiedResponse = await verifyTransaction.json()
//         verifyData = {
//           ...verifiedResponse,
//           paymentAction: "paid",
//         }
//         setResult(verifyData)
//       } else if (reference?.reference === "cash-on-delivery") {
//         // Non-Paystack transaction - Cash on Delivery
//         verifyData = {
//           status: "success",
//           paymentMode: "cash",
//           paymentAction: "pending", // Payment is pending for COD
//           cardType: null,
//           last4Digits: null,
//         }
//         setResult(verifyData)
//       } else {
//         throw new Error("Invalid payment reference or status")
//       }

//       const ordersData = {
//         products: transformedCart,
//         shippingAddress: shippingInfo,
//         orderNumber,
//         deliveryDate,
//         deliveryFee: deliveryFee,
//         referenceNumber: reference?.reference || "cash-on-delivery",
//         cardType: verifyData?.cardType,
//         last4Digits: verifyData?.last4Digits,
//         paymentMode: verifyData?.paymentMode,
//         paymentAction: verifyData?.paymentAction,
//         total: conbinedTotal, // Ensure this reflects the true total paid by user
//         creditAppliedTotal: balance,
//         balanceDeducted: deductedBalance,
//         userWhatsappOptIn,
//         updatedOrderTotal, // This is the total AFTER balance deduction, if any
//         remainingAmount, // This is the amount still due if balance wasn't enough
//       }

//       setOrdersData(ordersData)

//       // --- API Calls (Sequential for clarity, consider Promise.all for speed) ---

//       // 1. Save shipping address
//       const shippingResponse = await fetch("/api/address", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(addressPayload),
//       })
//       if (!shippingResponse.ok)
//         throw new Error("Failed to save shipping address.")

//       // 2. Save order
//       const ordersResponse = await fetch("/api/orders", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(ordersData),
//       })
//       if (!ordersResponse.ok) throw new Error("Failed to save order.")

//       // 3. Update product purchase count
//       await fetch("/api/products/updatePurchaseCount", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ products: transformedCart }),
//       })

//       // 4. Update product quantities
//       const quantityResponse = await fetch("/api/products/updateQuantity", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ products: ordersData.products }),
//       })
//       if (!quantityResponse.ok)
//         throw new Error("Failed to update product quantities.")

//       // 5. Send order confirmation email
//       const email = await fetch("/api/send-order-email", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ order: ordersData }),
//       })
//       if (!email.ok) throw new Error("Failed to send order confirmation email.")

//       // --- Success ---
//       clearCart() // Clear the cart after successful order processing
//       router.push("/success/thank-you") // Redirect to a success page
//     } catch (error) {
//       console.error("Order processing error:", error)
//       // Implement user-friendly error display (e.g., toast notification)
//       alert(
//         `There was an issue processing your order: ${
//           error || "Please try again."
//         }`
//       )
//     } finally {
//       setIsConfirming(false)
//     }
//   }

//   const handlePaystackCloseAction = () => {
//     console.log("Paystack modal closed.")
//     // Optionally, show a message to the user that payment was cancelled
//   }

//   const componentProps = {
//     ...config,
//     text: "Pay with card",
//     onSuccess: (reference: any) => handlePaystackSuccessAction(reference),
//     onClose: handlePaystackCloseAction,
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
//       <div className="w-full max-w-6xl bg-white rounded-xl shadow-xl overflow-hidden animate-fade-in border border-gray-100">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-sowgren_Color to-green-600 p-6 sm:p-8 text-white text-center">
//           <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
//             Confirm Your Order
//           </h1>
//           <p className="text-sm sm:text-base opacity-90 max-w-lg mx-auto">
//             Review your items and delivery information before placing your
//             order.
//           </p>
//         </div>

//         {/* Main Content Grid */}
//         <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
//           {/* Left Column: Order Details & Items */}
//           <div className="order-details space-y-8">
//             {" "}
//             {/* Increased space-y */}
//             <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-sowgren_Color pb-3 mb-4">
//               <span className="text-sowgren_Color pr-2">1.</span> Your Order
//               Summary
//             </h2>
//             {/* InfoCard handles its own internal padding now */}
//             <InfoCard data={dataProps} />
//             <div className="border-t pt-8 mt-8">
//               {" "}
//               {/* Increased top padding/margin */}
//               {/* <h3 className="text-xl font-bold text-gray-800 mb-6">
//                 Items in Your Basket
//               </h3> */}
//               <CartDisplay />
//             </div>
//           </div>

//           {/* Right Column: Payment & Actions */}
//           <div className="payment-actions space-y-8 max-w-md h-fit w-full">
//             <h2 className="text-2xl font-bold  text-gray-800 border-b-2 border-sowgren_Color pb-3 mb-4">
//               <span className="text-sowgren_Color pr-2">2.</span> Payment &
//               Confirmation
//             </h2>
//             {/* Price Breakdown */}
//             <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-200">
//               <h3 className="text-lg font-semibold text-blue-800 mb-5">
//                 Order Total
//               </h3>
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center text-gray-700">
//                   <span>Subtotal:</span>
//                   <span className="font-medium">{formattedSubtotal}</span>
//                 </div>
//                 <div className="flex justify-between items-center text-gray-700">
//                   <span>Delivery Fee:</span>
//                   <span className="font-medium">{formattedDelivery}</span>
//                 </div>
//                 {deductedBalance > 0 && (
//                   <div className="flex justify-between items-center text-green-700 font-semibold">
//                     <span>Balance Used:</span>
//                     <span>-{formatCurrency(deductedBalance, "GHS")}</span>
//                   </div>
//                 )}
//                 <div className="border-t border-gray-300 pt-4 mt-4 flex justify-between items-center text-2xl font-bold text-sowgren_Color">
//                   <span>Grand Total:</span>
//                   <span>{formattedTotal}</span>
//                 </div>
//               </div>
//               {balance !== undefined &&
//                 balance !== null &&
//                 balance < conbinedTotal && (
//                   <p className="text-sm text-red-600 mt-5 bg-red-50 p-4 rounded-md border border-red-200">
//                     <span className="font-semibold">Heads up!</span> Your
//                     account balance is insufficient for the full order. Please
//                     choose an alternative payment method.
//                   </p>
//                 )}
//             </div>
//             {/* Action Buttons */}
//             <div className="flex flex-col gap-4 pt-4">
//               <Button
//                 disabled={isConfirming}
//                 onClick={() => router.push("/basket")}
//                 className="w-full text-sowgren_Color border border-sowgren_Color bg-white hover:bg-sowgren_Color/5 transition-all py-3 rounded-md font-semibold text-base"
//               >
//                 Edit Order
//               </Button>

//               <Button
//                 onClick={() =>
//                   handlePaystackSuccessAction({
//                     status: "success",
//                     reference: "cash-on-delivery",
//                   })
//                 }
//                 disabled={
//                   isConfirming ||
//                   (balance !== undefined &&
//                     balance !== null &&
//                     balance < conbinedTotal)
//                 }
//                 className={`w-full bg-sowgren_Color text-white py-3 rounded-md font-semibold text-base shadow-lg hover:bg-green-700 transition-all ${
//                   isConfirming ||
//                   (balance !== undefined &&
//                     balance !== null &&
//                     balance < conbinedTotal)
//                     ? "opacity-60 cursor-not-allowed"
//                     : ""
//                 }`}
//               >
//                 {isConfirming ? (
//                   <span className="flex items-center justify-center gap-3">
//                     <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
//                     Processing Order...
//                   </span>
//                 ) : (
//                   "Place Order (Pay on Delivery)"
//                 )}
//               </Button>

//               {remainingAmount > 0 && (
//                 <Button
//                   disabled={isConfirming}
//                   onClick={() => alert("Paystack Integration Here!")} // Placeholder
//                   className={`w-full bg-blue-600 text-white py-3 rounded-md font-semibold text-base shadow-lg hover:bg-blue-700 transition-all ${
//                     isConfirming ? "opacity-60 cursor-not-allowed" : ""
//                   }`}
//                 >
//                   Pay Now with Card ({formatCurrency(remainingAmount, "GHS")})
//                 </Button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ConfirmOrderPage
