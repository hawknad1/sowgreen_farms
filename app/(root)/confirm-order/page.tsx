"use client"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { useCartStore, useDeliveryStore, useOrderDataStore } from "@/store"
import CartDisplay from "./CartDisplay"
import { formatCurrency } from "@/lib/utils"
import { PaymentInfo, VariantCartItem } from "@/types"
import { generateOrderNumber } from "@/lib/actions/whatsAppMessages/generateOrderNumber"
import { DeliveryMethod } from "./InfoCard"
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

// const ConfirmOrderPage = () => {
//   const [activeUser, setActiveUser] = useState<User | null>(null)
//   const setOrdersData = useOrderDataStore((state) => state.setOrdersData)
//   const { cartTotal, cart } = useCartStore()
//   const clearCart = useCartStore((state) => state.clearCart)
//   const [result, setResult] = useState<PaymentInfo>(null)
//   const deliveryFee = useDeliveryStore((state) => state.deliveryFee)
//   const [isConfirming, setIsConfirming] = useState(false)
//   const [isLoadingUser, setIsLoadingUser] = useState(true)
//   const [formData, setFormData] = useState<any>(null)
//   const router = useRouter()
//   const session = useSession()
//   const user = session?.data?.user

//   useEffect(() => {
//     // Retrieve data from sessionStorage
//     const checkoutData = sessionStorage.getItem("checkoutData")
//     if (!checkoutData) {
//       router.push("/checkout")
//       return
//     }

//     try {
//       const parsedData = JSON.parse(checkoutData)
//       setFormData(parsedData)
//     } catch (error) {
//       console.error("Error parsing checkout data:", error)
//       router.push("/checkout")
//     }
//   }, [router])

//   useEffect(() => {
//     if (!user?.email) {
//       setIsLoadingUser(false)
//       return
//     }

//     const fetchUser = async () => {
//       try {
//         const res = await fetch(`/api/user/${user.email}`, {
//           method: "GET",
//           cache: "no-store",
//         })
//         if (!res.ok) {
//           throw new Error("Failed to fetch user data")
//         }
//         const userData = await res.json()
//         setActiveUser(userData)
//       } catch (error) {
//         console.error("Error fetching user:", error)
//         toast.error("Failed to load user information")
//       } finally {
//         setIsLoadingUser(false)
//       }
//     }

//     fetchUser()
//   }, [user?.email])

//   if (!formData || isLoadingUser) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <Loader2 className="h-12 w-12 animate-spin text-primary" />
//           <p className="text-lg font-medium">Confirming your order...</p>
//         </div>
//       </div>
//     )
//   }

//   let total = cartTotal
//   let conbinedTotal = total + deliveryFee
//   const balance = activeUser?.user?.balance

//   const formattedSubtotal = formatCurrency(cartTotal, "GHS")
//   const formattedDelivery = formatCurrency(deliveryFee, "GHS")
//   const formattedTotal = formatCurrency(total, "GHS")

//   const { deliveryDate, ...newFormData } = formData
//   const whatsappOptIn = formData.whatsappOptIn

//   console.log(formData, "FORM DATA")

//   const shippingInfo = {
//     deliveryDate,
//     ...formData,
//     whatsappOptIn,
//     deliveryMethod: formData.deliveryMethod.split("-")[0],
//   }

//   const { deliveryMethod, ...addressData } = formData
//   const cleanDeliveryMethod = deliveryMethod.split("-")[0].trim()

//   const addressPayload = {
//     ...addressData,
//     deliveryDate,
//     whatsappOptIn,
//     deliveryMethod: cleanDeliveryMethod,
//   }

//   const userWhatsappOptIn = {
//     customerPhone: `+233${formData.phone.substring(1)}`,
//     whatsappOptIn: whatsappOptIn,
//     timestamp: new Date(),
//     method: "checkbox",
//   }

//   const orderNumber = generateOrderNumber()

//   const transformCart = (cart: any[]) => {
//     return cart.map((item: VariantCartItem) => ({
//       item: {
//         price: item.price,
//         weight: item.weight,
//         productId: item.productId,
//         quantity: item.quantity,
//         unit: item.unit,
//         variantId: item.variantId,
//         product: item.product,
//       },
//       quantity: item.quantity,
//       total: (item.price * item.quantity).toFixed(2),
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
//     amount: Math.round(remainingAmount * 100),
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

//   // async function handlePaystackSuccessAction(reference?: any) {
//   //   setIsConfirming(true)
//   //   const toastId = toast.loading("Processing your order...")

//   //   try {
//   //     let verifyData: PaymentInfo = null

//   //     if (
//   //       reference?.status === "success" &&
//   //       reference?.reference !== "cash-on-delivery"
//   //     ) {
//   //       const verifyTransaction = await fetch("/api/verify-transaction", {
//   //         method: "POST",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //         },
//   //         body: JSON.stringify({ reference: reference?.reference }),
//   //       })

//   //       if (!verifyTransaction.ok) {
//   //         throw new Error("Failed to verify transaction")
//   //       }

//   //       const verifiedResponse = await verifyTransaction.json()
//   //       verifyData = {
//   //         ...verifiedResponse,
//   //         paymentAction: "paid",
//   //       }
//   //       setResult(verifyData)
//   //     } else if (reference?.reference === "cash-on-delivery") {
//   //       verifyData = {
//   //         status: "success",
//   //         paymentMode: "cash",
//   //         paymentAction: "pending",
//   //         cardType: null,
//   //         last4Digits: null,
//   //       }
//   //       setResult(verifyData)
//   //     } else {
//   //       throw new Error("Invalid payment reference or status")
//   //     }

//   //     const ordersData = {
//   //       products: transformedCart,
//   //       shippingAddress: shippingInfo,
//   //       orderNumber,
//   //       deliveryDate,
//   //       deliveryFee: deliveryFee,
//   //       specialNotes: shippingInfo.specialNotes,
//   //       referenceNumber: reference?.reference || "cash-on-delivery",
//   //       cardType: verifyData?.cardType,
//   //       last4Digits: verifyData?.last4Digits,
//   //       paymentMode: verifyData?.paymentMode,
//   //       paymentAction: verifyData?.paymentAction,
//   //       total: total,
//   //       subtotal: cartTotal,
//   //       creditAppliedTotal: balance,
//   //       balanceDeducted: deductedBalance,
//   //       userWhatsappOptIn,
//   //       updatedOrderTotal,
//   //       remainingAmount,
//   //     }

//   //     setOrdersData(ordersData)

//   //     // API Calls
//   //     const shippingResponse = await fetch("/api/address", {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify(addressPayload),
//   //     })
//   //     if (!shippingResponse.ok)
//   //       throw new Error("Failed to save shipping address.")

//   //     const ordersResponse = await fetch("/api/orders", {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify(ordersData),
//   //     })
//   //     if (!ordersResponse.ok) throw new Error("Failed to save order.")

//   //     await fetch("/api/products/updatePurchaseCount", {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify({ products: transformedCart }),
//   //     })

//   //     const quantityResponse = await fetch("/api/products/updateQuantity", {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify({ products: ordersData.products }),
//   //     })
//   //     if (!quantityResponse.ok)
//   //       throw new Error("Failed to update product quantities.")

//   //     const email = await fetch("/api/send-order-email", {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify({ order: ordersData }),
//   //     })
//   //     if (!email.ok) throw new Error("Failed to send order confirmation email.")

//   //     // Clear the session storage after successful order
//   //     sessionStorage.removeItem("checkoutData")
//   //     clearCart()
//   //     toast.success("Order placed successfully!", { id: toastId })
//   //     router.push("/success/thank-you")
//   //   } catch (error) {
//   //     console.error("Order processing error:", error)
//   //     toast.error(`Order failed: ${error || "Please try again."}`, {
//   //       id: toastId,
//   //     })
//   //   } finally {
//   //     setIsConfirming(false)
//   //   }
//   // }

//   async function handlePaystackSuccessAction(reference?: any) {
//     setIsConfirming(true)
//     const toastId = toast.loading("Processing your order...")

//     try {
//       let verifyData: PaymentInfo = null

//       if (
//         reference?.status === "success" &&
//         reference?.reference !== "cash-on-delivery"
//       ) {
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
//         verifyData = {
//           status: "success",
//           paymentMode: "cash",
//           paymentAction: "pending",
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
//         specialNotes: shippingInfo.specialNotes,
//         referenceNumber: reference?.reference || "cash-on-delivery",
//         cardType: verifyData?.cardType,
//         last4Digits: verifyData?.last4Digits,
//         paymentMode: verifyData?.paymentMode,
//         paymentAction: verifyData?.paymentAction,
//         total: total,
//         subtotal: cartTotal,
//         creditAppliedTotal: balance,
//         balanceDeducted: deductedBalance,
//         userWhatsappOptIn,
//         updatedOrderTotal,
//         remainingAmount,
//       }

//       setOrdersData(ordersData)

//       console.log("=== Starting Order Processing ===")
//       console.log("Order Number:", orderNumber)
//       console.log(
//         "Products to update:",
//         JSON.stringify(ordersData.products, null, 2)
//       )

//       // Step 1: Save shipping address
//       console.log("\n[1/5] Saving shipping address...")
//       try {
//         const shippingResponse = await fetch("/api/address", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(addressPayload),
//         })

//         if (!shippingResponse.ok) {
//           const errorData = await shippingResponse.json().catch(() => ({}))
//           console.error("Shipping address error:", errorData)
//           throw new Error(errorData.error || "Failed to save shipping address")
//         }

//         const shippingResult = await shippingResponse.json()
//         console.log("✅ Shipping address saved:", shippingResult)
//       } catch (error: any) {
//         console.error("❌ Shipping address failed:", error.message)
//         throw new Error(`Failed to save shipping address: ${error.message}`)
//       }

//       // Step 2: Save order
//       console.log("\n[2/5] Saving order...")
//       try {
//         const ordersResponse = await fetch("/api/orders", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(ordersData),
//         })

//         if (!ordersResponse.ok) {
//           const errorData = await ordersResponse.json().catch(() => ({}))
//           console.error("Orders error:", errorData)
//           throw new Error(errorData.error || "Failed to save order")
//         }

//         const orderResult = await ordersResponse.json()
//         console.log("✅ Order saved:", orderResult)
//       } catch (error: any) {
//         console.error("❌ Order save failed:", error.message)
//         throw new Error(`Failed to save order: ${error.message}`)
//       }

//       // Step 3: Update purchase count (non-critical)
//       console.log("\n[3/5] Updating purchase count...")
//       try {
//         const purchaseResponse = await fetch(
//           "/api/products/updatePurchaseCount",
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ products: transformedCart }),
//           }
//         )

//         if (purchaseResponse.ok) {
//           console.log("✅ Purchase count updated")
//         } else {
//           console.warn("⚠️ Purchase count update failed (non-critical)")
//         }
//       } catch (error: any) {
//         console.warn(
//           "⚠️ Purchase count update error (non-critical):",
//           error.message
//         )
//       }

//       // Step 4: Update product quantities (CRITICAL)
//       console.log("\n[4/5] Updating product quantities...")
//       console.log(
//         "Payload being sent:",
//         JSON.stringify({ products: ordersData.products }, null, 2)
//       )

//       try {
//         const quantityResponse = await fetch("/api/products/updateQuantity", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ products: ordersData.products }),
//         })

//         const quantityData = await quantityResponse.json()

//         if (!quantityResponse.ok) {
//           console.error("❌ Quantity update error response:", quantityData)
//           throw new Error(
//             quantityData.details ||
//               quantityData.error ||
//               "Failed to update product quantities"
//           )
//         }

//         console.log("✅ Product quantities updated:", quantityData)
//       } catch (error: any) {
//         console.error("❌ Quantity update failed:", error.message)
//         throw new Error(`Failed to update product quantities: ${error.message}`)
//       }

//       // Step 5: Send confirmation email (non-critical)
//       console.log("\n[5/5] Sending confirmation email...")
//       try {
//         const emailResponse = await fetch("/api/send-order-email", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ order: ordersData }),
//         })

//         if (emailResponse.ok) {
//           console.log("✅ Confirmation email sent")
//         } else {
//           console.warn("⚠️ Email send failed (non-critical)")
//         }
//       } catch (error: any) {
//         console.warn("⚠️ Email error (non-critical):", error.message)
//       }

//       // Success! Clean up and redirect
//       console.log("\n=== Order Processing Complete ===")
//       sessionStorage.removeItem("checkoutData")
//       clearCart()

//       toast.success("Order placed successfully!", { id: toastId })

//       // Small delay to ensure everything is saved
//       await new Promise((resolve) => setTimeout(resolve, 300))

//       console.log("Redirecting to success page...")
//       router.push("/success/thank-you")
//     } catch (error: any) {
//       console.error("\n=== ORDER PROCESSING FAILED ===")
//       console.error("Error:", error)
//       console.error("Error message:", error?.message)
//       console.error("Error stack:", error?.stack)

//       toast.error(`Order failed: ${error?.message || "Please try again"}`, {
//         id: toastId,
//       })
//     } finally {
//       setIsConfirming(false)
//     }
//   }

//   const handlePaystackCloseAction = () => {
//     toast.info("Payment was cancelled")
//   }

//   const componentProps = {
//     ...config,
//     text: "Pay with card",
//     onSuccess: (reference: any) => handlePaystackSuccessAction(reference),
//     onClose: handlePaystackCloseAction,
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
//       <div className="w-full max-w-6xl bg-white rounded-xl overflow-hidden animate-fade-in border border-gray-200">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-primary to-green-600 p-6 sm:p-8 text-white">
//           <div className="max-w-4xl mx-auto text-center">
//             <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2">
//               Confirm Your Order
//             </h1>
//             <p className="text-sm sm:text-base opacity-90">
//               Review your items and delivery information before placing your
//               order.
//             </p>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="p-4 sm:p-6 md:p-8">
//           {/* Mobile Layout: Delivery Info -> Cart -> Payment */}
//           <div className="lg:hidden space-y-6">
//             {/* Delivery Information Card (Mobile) */}
//             <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
//               <h2 className="text-xl sm:text-2xl font-bold text-gray-800 border-b-2 border-primary pb-2 mb-4 flex items-center">
//                 <span className="text-primary pr-2">1.</span> Delivery
//                 Information
//               </h2>
//               <div className="bg-blue-50/50 p-4 sm:p-6 rounded-lg border border-blue-100 mb-4">
//                 <div className="space-y-3">
//                   <p className="text-sm md:text-base text-gray-700">
//                     {formData?.name || "N/A"}
//                   </p>
//                   <p className="text-sm md:text-base text-gray-700">
//                     {formData?.address || "N/A"},{" "}
//                     {formData?.city.includes("Unknown Location")
//                       ? formData?.unknownCity
//                       : formData?.city}
//                   </p>
//                   <p className="text-sm md:text-base text-gray-700">
//                     {formData?.region || "N/A"}
//                   </p>
//                   <p className="text-sm md:text-base text-gray-700">
//                     {formData?.phone || "N/A"}
//                   </p>
//                   <p className="text-sm md:text-base text-gray-700">
//                     {formData?.email || "N/A"}
//                   </p>
//                 </div>
//                 {/* <p className="text-xs mt-5 italic md:text-sm font-medium text-gray-700">
//                   NOTES: <br />
//                   <span className="line-clamp-2">{formData.specialNotes}</span>
//                 </p> */}
//                 {formData.specialNotes && (
//                   <p className="text-xs mt-5 italic md:text-sm font-medium text-gray-700">
//                     NOTES: <br />
//                     <span className="line-clamp-2">
//                       {formData.specialNotes}
//                     </span>
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <h2 className="text-xl sm:text-2xl font-bold text-gray-800 border-b-2 border-primary pb-2 mb-4 flex items-center">
//                   <span className="text-primary pr-2">
//                     <FaTruck className="text-green-500 text-lg" />
//                   </span>
//                   Delivery Method
//                 </h2>
//                 <DeliveryMethod data={dataProps} />
//               </div>
//             </div>

//             {/* Cart Display (Mobile) - Full Width */}
//             <div className="bg-white rounded-lg p-4 sm:p-6 ">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                 Items in Your Basket
//               </h3>
//               <CartDisplay />
//             </div>

//             {/* Payment & Confirmation Card (Mobile) */}
//             <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
//               <h2 className="text-xl sm:text-2xl font-bold text-gray-800 border-b-2 border-primary pb-2 mb-4 flex items-center">
//                 <span className="text-primary pr-2">2.</span> Payment &
//                 Confirmation
//               </h2>
//               <PaymentConfirmationSection
//                 formattedSubtotal={formattedSubtotal}
//                 formattedDelivery={formattedDelivery}
//                 deliveryFee={deliveryFee}
//                 deductedBalance={deductedBalance}
//                 formattedTotal={formattedTotal}
//                 updatedOrderTotal={updatedOrderTotal}
//                 balance={balance}
//                 total={total}
//                 isConfirming={isConfirming}
//                 router={router}
//                 handlePaystackSuccessAction={handlePaystackSuccessAction}
//                 remainingAmount={remainingAmount}
//               />
//             </div>
//           </div>

//           {/* Desktop Layout: Side-by-side cards with cart below */}
//           <div className="hidden lg:block">
//             {/* Top Row: Delivery Info and Payment Cards */}
//             <div className="grid grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
//               {/* Delivery Information Card (Desktop) */}
//               <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 h-full flex flex-col">
//                 <h2 className="text-xl sm:text-2xl font-bold text-gray-800 border-b-2 border-primary pb-2 mb-4 flex items-center">
//                   <span className="text-primary pr-2">1.</span> Delivery
//                   Information
//                 </h2>
//                 <div className="bg-blue-50/50 p-4 sm:p-6 rounded-lg border border-blue-100 h-fit mb-4 flex-grow">
//                   <div className="space-y-1.5">
//                     <p className="text-sm md:text-base text-gray-700">
//                       {formData?.name || "N/A"}
//                     </p>
//                     <p className="text-sm md:text-base text-gray-700">
//                       {formData?.address || "N/A"},{" "}
//                       {formData?.city.includes("Unknown Location")
//                         ? formData?.unknownCity
//                         : formData?.city}
//                     </p>
//                     <p className="text-sm md:text-base text-gray-700">
//                       {formData?.region || "N/A"}
//                     </p>
//                     <p className="text-sm md:text-base text-gray-700">
//                       {formData?.phone || "N/A"}
//                     </p>
//                     <p className="text-sm md:text-base text-gray-700">
//                       {formData?.email || "N/A"}
//                     </p>
//                   </div>
//                   {formData.specialNotes && (
//                     <p className="text-xs mt-5 italic md:text-sm font-medium text-gray-700">
//                       NOTES: <br />
//                       <span className="line-clamp-2">
//                         {formData.specialNotes}
//                       </span>
//                     </p>
//                   )}
//                 </div>
//                 <div className="mt-auto">
//                   <h2 className="text-xl sm:text-2xl font-bold text-gray-800 border-b-2 border-primary pb-2 mb-4 flex items-center">
//                     <span className="text-primary pr-2">
//                       <FaTruck className="text-green-500 text-lg" />
//                     </span>
//                     Delivery Method
//                   </h2>
//                   <DeliveryMethod data={dataProps} />
//                 </div>
//               </div>

//               {/* Payment & Confirmation Card (Desktop) */}
//               <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 h-full">
//                 <h2 className="text-xl sm:text-2xl font-bold text-gray-800 border-b-2 border-primary pb-2 mb-4 flex items-center">
//                   <span className="text-primary pr-2">2.</span> Payment &
//                   Confirmation
//                 </h2>
//                 <PaymentConfirmationSection
//                   formattedSubtotal={formattedSubtotal}
//                   formattedDelivery={formattedDelivery}
//                   deductedBalance={deductedBalance}
//                   deliveryFee={deliveryFee}
//                   formattedTotal={formattedTotal}
//                   updatedOrderTotal={updatedOrderTotal}
//                   balance={balance}
//                   total={total}
//                   isConfirming={isConfirming}
//                   router={router}
//                   handlePaystackSuccessAction={handlePaystackSuccessAction}
//                   remainingAmount={remainingAmount}
//                 />
//               </div>
//             </div>

//             {/* Full Width Cart Display (Desktop) */}
//             <div className="bg-white rounded-lg py-4 sm:py-6 w-full">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                 Items in Your Basket
//               </h3>
//               <CartDisplay />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
const ConfirmOrderPage = () => {
  const [activeUser, setActiveUser] = useState<User | null>(null)
  const setOrdersData = useOrderDataStore((state) => state.setOrdersData)
  const { cartTotal, cart } = useCartStore()
  const clearCart = useCartStore((state) => state.clearCart)
  const [result, setResult] = useState<PaymentInfo>(null)
  const deliveryFee = useDeliveryStore((state) => state.deliveryFee)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [formData, setFormData] = useState<any>(null)
  const router = useRouter()
  const session = useSession()
  const user = session?.data?.user

  useEffect(() => {
    // Retrieve data from sessionStorage
    const checkoutData = sessionStorage.getItem("checkoutData")
    if (!checkoutData) {
      router.push("/checkout")
      return
    }

    try {
      const parsedData = JSON.parse(checkoutData)
      setFormData(parsedData)
    } catch (error) {
      console.error("Error parsing checkout data:", error)
      router.push("/checkout")
    }
  }, [router])

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

  if (!formData || isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Confirming your order...</p>
        </div>
      </div>
    )
  }

  let total = cartTotal
  let conbinedTotal = total + deliveryFee
  const balance = activeUser?.user?.balance

  const formattedSubtotal = formatCurrency(cartTotal, "GHS")
  const formattedDelivery = formatCurrency(deliveryFee, "GHS")
  const formattedTotal = formatCurrency(total, "GHS")

  const { deliveryDate, ...newFormData } = formData
  const whatsappOptIn = formData.whatsappOptIn

  // Helper function to get the correct city value
  const getActualCity = () => {
    if (
      formData.city === "Unknown Location" ||
      formData.city?.includes("Unknown Location")
    ) {
      return formData.unknownCity || formData.city
    }
    return formData.city
  }

  const actualCity = getActualCity()

  const shippingInfo = {
    deliveryDate,
    ...formData,
    city: actualCity, // Use the actual city
    whatsappOptIn,
    deliveryMethod: formData.deliveryMethod.split("-")[0],
  }

  const { deliveryMethod, unknownCity, ...addressData } = formData
  const cleanDeliveryMethod = deliveryMethod.split("-")[0].trim()

  const addressPayload = {
    ...addressData,
    city: actualCity, // Use the actual city here too
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
        specialNotes: shippingInfo.specialNotes,
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

      // Step 1: Save shipping address
      try {
        const shippingResponse = await fetch("/api/address", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addressPayload),
        })

        if (!shippingResponse.ok) {
          const errorData = await shippingResponse.json().catch(() => ({}))
          console.error("Shipping address error:", errorData)
          console.error("Failed payload was:", addressPayload)
          throw new Error(
            errorData.error ||
              errorData.errors?.[0]?.message ||
              "Failed to save shipping address"
          )
        }

        const shippingResult = await shippingResponse.json()
      } catch (error: any) {
        console.error("❌ Shipping address failed:", error.message)
        throw new Error(`Failed to save shipping address: ${error.message}`)
      }

      // Step 2: Save order
      try {
        const ordersResponse = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ordersData),
        })

        if (!ordersResponse.ok) {
          const errorData = await ordersResponse.json().catch(() => ({}))
          console.error("Orders error:", errorData)
          throw new Error(errorData.error || "Failed to save order")
        }

        const orderResult = await ordersResponse.json()
        // console.log("✅ Order saved:", orderResult)
      } catch (error: any) {
        // console.error("❌ Order save failed:", error.message)
        throw new Error(`Failed to save order: ${error.message}`)
      }

      // Step 3: Send confirmation email (non-critical)
      try {
        const emailResponse = await fetch("/api/send-order-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: ordersData }),
        })

        if (emailResponse.ok) {
          console.log("✅ Confirmation email sent")
        } else {
          console.warn("⚠️ Email send failed (non-critical)")
        }
      } catch (error: any) {
        console.warn("⚠️ Email error (non-critical):", error.message)
      }

      // Success! Clean up and redirect
      sessionStorage.removeItem("checkoutData")
      clearCart()

      toast.success("Order placed successfully!", { id: toastId })

      // Small delay to ensure everything is saved
      await new Promise((resolve) => setTimeout(resolve, 300))

      // console.log("Redirecting to success page...")
      router.push("/success/thank-you")
    } catch (error: any) {
      console.error("\n=== ORDER PROCESSING FAILED ===")
      console.error("Error:", error)
      console.error("Error message:", error?.message)
      console.error("Error stack:", error?.stack)

      toast.error(`Order failed: ${error?.message || "Please try again"}`, {
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
                    {formData?.address || "N/A"}, {actualCity || "N/A"}
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
                {formData.specialNotes && (
                  <p className="text-xs mt-5 italic md:text-sm font-medium text-gray-700">
                    NOTES: <br />
                    <span className="line-clamp-2">
                      {formData.specialNotes}
                    </span>
                  </p>
                )}
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
                <div className="bg-blue-50/50 p-4 sm:p-6 rounded-lg border border-blue-100 h-fit mb-4 flex-grow">
                  <div className="space-y-1.5">
                    <p className="text-sm md:text-base text-gray-700">
                      {formData?.name || "N/A"}
                    </p>
                    <p className="text-sm md:text-base text-gray-700">
                      {formData?.address || "N/A"}, {actualCity || "N/A"}
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
                  {formData.specialNotes && (
                    <p className="text-xs mt-5 italic md:text-sm font-medium text-gray-700">
                      NOTES: <br />
                      <span className="line-clamp-2">
                        {formData.specialNotes}
                      </span>
                    </p>
                  )}
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
