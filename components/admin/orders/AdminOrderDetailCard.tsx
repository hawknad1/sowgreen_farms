// "use client"

// import React, { useEffect, useState } from "react"
// import DisplayOrder from "./DisplayOrder"
// import StatusPopup from "./StatusPopup"
// import DeleteOrderDialog from "./dialogs/DeleteOrderDialog"
// import ModifyOrderDialog from "./dialogs/ModifyOrderDialog"
// import CancelOrderDialog from "./dialogs/CancelOrderDialog"
// import AdminMiddleCards from "./AdminMiddleCards"
// import { motion } from "framer-motion"
// import { Order, User } from "@/types"
// import { formatCurrency } from "@/lib/utils"
// import { Separator } from "@/components/ui/separator"
// import { orderStatusCard } from "@/constants"
// import { useSession } from "next-auth/react"

// const AdminOrderDetailCard = ({ orders }: { orders: Order }) => {
//   const [isLoading, setIsLoading] = useState(true)
//   const [activeUser, setActiveUser] = useState<User>(null)
//   const { data: session } = useSession()
//   const user = session?.user

//   const deliveryFee = orders?.deliveryFee
//   const orderTotal = orders?.total + deliveryFee
//   const balance = activeUser?.user?.balance
//   const email = orders?.shippingAddress?.email
//   const rider = orders?.dispatchRider?.fullName || "Not Assigned"
//   const specialNotes = orders?.specialNotes

//   // Fetch user details if email is provided
//   useEffect(() => {
//     const getUser = async () => {
//       if (!user?.email) return
//       setIsLoading(true)
//       try {
//         const res = await fetch(`/api/user/${email}`, {
//           method: "GET",
//           cache: "no-store",
//         })
//         if (res.ok) {
//           const active = await res.json()
//           setActiveUser(active)
//           // setUser(active)
//         } else {
//           console.error("Failed to fetch user details:", res.statusText)
//         }
//       } catch (error) {
//         console.error("Failed to fetch user details:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     getUser()
//   }, [email])

//   if (!orders)
//     return (
//       <div className="w-full h-screen flex justify-center items-center">
//         <span className="loading loading-dots loading-lg"></span>
//       </div>
//     )

//   return (
//     <div className="p-4 w-full">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//         className="flex flex-col gap-6"
//       >
//         <div className="flex flex-col">
//           <div className="flex justify-between sticky top-0 z-10  h-16 items-center gap-2 bg-white px-4">
//             <div>
//               <h2 className="lg:text-xl text-xs md:text-base font-semibold">
//                 Order No. : {orders?.orderNumber}
//               </h2>
//               <p className="md:text-sm text-xs text-gray-500">
//                 Order details of {orders?.shippingAddress?.name}
//               </p>
//             </div>

//             <div className="flex items-center gap-x-3">
//               <CancelOrderDialog order={orders} className="" />

//               <DeleteOrderDialog
//                 order={orders}
//                 className="hidden lg:inline-flex"
//               />
//             </div>
//           </div>

//           <div className="h-screen overflow-scroll scrollbar-none py-4">
//             <div className="border border-neutral-300 rounded-lg p-4 flex flex-col sm:flex-row gap-4">
//               <div className="w-full flex flex-col gap-2">
//                 <div className="flex justify-between">
//                   <p className="font-semibold text-xs md:text-sm lg:text-base flex items-center gap-x-1">
//                     With courier en route
//                     <span className="relative flex h-3 w-3">
//                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
//                       <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
//                     </span>
//                   </p>
//                   <p className="font-semibold text-neutral-600 text-xs md:text-sm lg:text-base">
//                     Dispatch Rider: <span className="text-black">{rider}</span>
//                   </p>
//                 </div>

//                 {/* Order status */}
//                 <StatusPopup orderStatus={orderStatusCard} orders={orders} />

//                 <Separator className="my-4" />

//                 {/* Shipping and order details */}
//                 <AdminMiddleCards orders={orders} balance={balance} />

//                 <Separator className="my-4" />

//                 {/* Order Items */}
//                 <div>
//                   <div className="flex justify-between">
//                     <h3 className="text-lg font-bold mb-2">Order Item</h3>
//                     <ModifyOrderDialog order={orders} />
//                   </div>
//                   <DisplayOrder orders={orders} />
//                 </div>

//                 <Separator className="my-4" />

//                 {/* Order Summary */}
//                 <div>
//                   <h3 className="text-lg font-bold mb-2">Order Summary</h3>
//                   <div className="flex justify-between">
//                     <div>
//                       <p className="text-sm font-semibold">Subtotal</p>
//                       <p className="text-sm font-semibold">Delivery Fee</p>
//                       <p
//                         className={`font-semibold text-sm  ${
//                           orders?.creditAppliedTotal >= 0
//                             ? "text-emerald-500"
//                             : "text-red-500 "
//                         }`}
//                       >
//                         {orders?.creditAppliedTotal >= 0
//                           ? "Credit Balance"
//                           : "Balance Due"}
//                       </p>
//                       <p className="text-sm font-semibold">Total</p>

//                       <p className="text-sm font-semibold text-red-500">
//                         Total Due
//                       </p>
//                     </div>

//                     <div className="flex flex-col items-end">
//                       <div className="flex justify-between">
//                         <p className="font-semibold text-sm">
//                           {formatCurrency(orders?.total, "GHS")}
//                         </p>
//                       </div>
//                       <div className="flex justify-between">
//                         <p className="font-semibold text-sm ">
//                           {formatCurrency(orders?.deliveryFee, "GHS")}
//                         </p>
//                       </div>
//                       <div className={`flex justify-between `}>
//                         <p
//                           className={`font-semibold text-sm  ${
//                             orders?.creditAppliedTotal >= 0
//                               ? "text-emerald-500"
//                               : "text-red-500 "
//                           }`}
//                         >
//                           {formatCurrency(
//                             Math.abs(orders?.creditAppliedTotal),
//                             "GHS"
//                           )}
//                         </p>
//                       </div>
//                       <div className="flex justify-between">
//                         <p className="font-semibold text-sm">
//                           {formatCurrency(orderTotal, "GHS")}
//                         </p>
//                       </div>

//                       <div className="flex justify-between">
//                         <p className="font-semibold text-sm text-red-500">
//                           {formatCurrency(orders?.updatedOrderTotal, "GHS")}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   )
// }

// export default AdminOrderDetailCard

"use client"

import React, { useEffect, useState } from "react"
import DisplayOrder from "./DisplayOrder"
import StatusPopup from "./StatusPopup"
import DeleteOrderDialog from "./dialogs/DeleteOrderDialog"
import ModifyOrderDialog from "./dialogs/ModifyOrderDialog"
import CancelOrderDialog from "./dialogs/CancelOrderDialog"
import AdminMiddleCards from "./AdminMiddleCards"
import { motion } from "framer-motion"
import { Order, User } from "@/types"
import { formatCurrency } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { orderStatusCard } from "@/constants"
import { useSession } from "next-auth/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { sendWhatsappReply } from "@/lib/twilio/whatsapp/send-whatsapp-reply"
import { Loader2 } from "lucide-react"

const AdminOrderDetailCard = ({ orders }: { orders: Order }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [activeUser, setActiveUser] = useState<User>(null)
  const [replyMessage, setReplyMessage] = useState("")
  const [currentOrder, setCurrentOrder] = useState<Order>(orders)
  const [isNotesOpen, setIsNotesOpen] = useState(false)
  const repliedNotes = orders?.repliedNotes || []

  const [hasReadNotes, setHasReadNotes] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sendStatus, setSendStatus] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const { data: session } = useSession()
  const user = session?.user

  const deliveryFee = orders?.deliveryFee
  const orderTotal = orders?.total + deliveryFee
  const balance = activeUser?.user?.balance
  const email = orders?.shippingAddress?.email
  const rider = orders?.dispatchRider?.fullName || "Not Assigned"
  const specialNotes = orders?.specialNotes

  // Fetch user details if email is provided
  useEffect(() => {
    const getUser = async () => {
      if (!user?.email) return
      setIsLoading(true)
      try {
        const res = await fetch(`/api/user/${email}`, {
          method: "GET",
          cache: "no-store",
        })
        if (res.ok) {
          const active = await res.json()
          setActiveUser(active)
        } else {
          console.error("Failed to fetch user details:", res.statusText)
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error)
      } finally {
        setIsLoading(false)
      }
    }
    getUser()
  }, [email])

  // const handleReplySubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()

  //   // Add debug logs to check the values
  //   console.log("Reply message:", replyMessage)
  //   console.log("Current order:", orders)

  //   if (!replyMessage || !replyMessage.trim()) {
  //     console.error("Validation failed - empty message")
  //     setSendStatus({ success: false, message: "Message cannot be empty" })
  //     return
  //   }

  //   if (!orders?.id) {
  //     console.error("Validation failed - no order ID")
  //     setSendStatus({ success: false, message: "Order reference missing" })
  //     return
  //   }

  //   setIsSending(true)
  //   setSendStatus(null)

  //   try {
  //     console.log("Sending PATCH request...")
  //     const saveResponse = await fetch(`/api/orders/${orders?.id}`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         repliedNote: replyMessage.trim(), // Ensure trimmed message
  //       }),
  //     })

  //     console.log("Response status:", saveResponse.status)

  //     if (!saveResponse.ok) {
  //       const errorData = await saveResponse.json().catch(() => ({}))
  //       console.error("Server error:", errorData)
  //       throw new Error(
  //         errorData.error || "Failed to save reply to the database."
  //       )
  //     }

  //     const updatedOrderFromServer: Order = await saveResponse.json()
  //     console.log("Updated order:", updatedOrderFromServer)

  //     // 2. If saving was successful, send the WhatsApp message
  //     const phoneNumber = orders?.shippingAddress?.phone
  //     if (!phoneNumber) {
  //       throw new Error("Customer phone number not available")
  //     }
  //     const formattedPhone = phoneNumber.startsWith("0")
  //       ? `233${phoneNumber.substring(1)}`
  //       : phoneNumber

  //     await sendWhatsappReply(formattedPhone, orders)

  //     setCurrentOrder(updatedOrderFromServer)
  //     setReplyMessage("")

  //     setSendStatus({ success: true, message: "Reply sent successfully!" })
  //   } catch (error) {
  //     console.error("Full error:", error)
  //     setSendStatus({
  //       success: false,
  //       message:
  //         error instanceof Error ? error.message : "Failed to send reply",
  //     })
  //   } finally {
  //     setIsSending(false)
  //   }
  // }

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!replyMessage?.trim()) {
      setSendStatus({ success: false, message: "Message cannot be empty" })
      return
    }

    if (!orders?.id || !orders.shippingAddress?.phone) {
      setSendStatus({ success: false, message: "Order information incomplete" })
      return
    }

    setIsSending(true)
    setSendStatus(null)

    try {
      // 1. First save the reply to the database
      const saveResponse = await fetch(`/api/orders/${orders.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repliedNote: replyMessage.trim() }),
      })

      if (!saveResponse.ok) {
        throw new Error("Failed to save reply to database")
      }

      const updatedOrder = await saveResponse.json()
      setCurrentOrder(updatedOrder)
      setReplyMessage("")

      // 2. Send WhatsApp message directly
      const phoneNumber = orders.shippingAddress.phone
      const formattedPhone = phoneNumber.startsWith("0")
        ? `233${phoneNumber.substring(1)}`
        : phoneNumber

      const whatsappResponse = await fetch("/api/whatsapp/reply-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: formattedPhone,
          order: {
            id: orders.id,
            shippingAddress: orders.shippingAddress,
            orderNumber: orders.orderNumber,
          },
        }),
      })

      if (!whatsappResponse.ok) {
        const errorData = await whatsappResponse.json()
        console.error("WhatsApp API error:", errorData)
        throw new Error(errorData.error || "WhatsApp message failed")
      }

      const whatsappResult = await whatsappResponse.json()

      setSendStatus({ success: true, message: "Reply sent successfully!" })
    } catch (error) {
      console.error("Error:", error)
      setSendStatus({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to send reply",
      })
    } finally {
      setIsSending(false)
    }
  }
  useEffect(() => {
    if (specialNotes) {
      const readStatus = localStorage.getItem(`notesRead_${orders?.id}`)
      setHasReadNotes(readStatus === "true")
    }
  }, [orders?.id, specialNotes])

  const handleOpenNotes = () => {
    setIsNotesOpen(true)
    setHasReadNotes(true)
    localStorage.setItem(`notesRead_${orders?.id}`, "true")
  }

  // const handleReplySubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   if (!replyMessage.trim() || !currentOrder) return

  //   setIsSending(true)
  //   setSendStatus(null)
  //   try {
  //     const saveResponse = await fetch(`/api/orders/${currentOrder.id}`, {
  //       method: "PATCH",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ repliedNote: replyMessage }),
  //     })

  //     if (!saveResponse.ok) {
  //       const errorData = await saveResponse.json()
  //       throw new Error(
  //         errorData.error || "Failed to save reply to the database."
  //       )
  //     }

  //     const updatedOrderFromServer: Order = await saveResponse.json()
  //     setCurrentOrder(updatedOrderFromServer)

  //     const phoneNumber = currentOrder.shippingAddress?.phone
  //     if (!phoneNumber) throw new Error("Customer phone number not available")

  //     const formattedPhone = phoneNumber.startsWith("0")
  //       ? `233${phoneNumber.substring(1)}`
  //       : phoneNumber
  //     await sendWhatsappReply(formattedPhone, replyMessage, currentOrder)

  //     setSendStatus({ success: true, message: "Message sent successfully!" })
  //     setReplyMessage("")
  //   } catch (error) {
  //     console.error("Full error in handleReplySubmit:", error)
  //     const errorMessage =
  //       error instanceof Error ? error.message : "An unknown error occurred"
  //     setSendStatus({ success: false, message: errorMessage })
  //   } finally {
  //     setIsSending(false)
  //   }
  // }

  // useEffect(() => {
  //   if (specialNotes) {
  //     const readStatus = localStorage.getItem(`notesRead_${currentOrder?.id}`)
  //     setHasReadNotes(readStatus === "true")
  //   }
  // }, [currentOrder?.id, specialNotes])

  // useEffect(() => {
  //   if (specialNotes) {
  //     const readStatus = localStorage.getItem(`notesRead_${orders?.id}`)
  //     setHasReadNotes(readStatus === "true")
  //   }
  // }, [orders?.id, specialNotes])

  // const handleOpenNotes = () => {
  //   setIsNotesOpen(true)
  //   // Mark as read when opened
  //   setHasReadNotes(true)
  //   localStorage.setItem(`notesRead_${orders?.id}`, "true")
  // }

  if (!orders)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    )

  return (
    <div className="p-4 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col">
          <div className="flex justify-between sticky top-0 z-10 h-16 items-center gap-2 bg-white px-4">
            <div>
              <h2 className="lg:text-xl text-xs md:text-base font-semibold">
                Order No. : {orders?.orderNumber}
              </h2>
              <p className="md:text-sm text-xs text-gray-500">
                Order details of {orders?.shippingAddress?.name}
              </p>
            </div>

            <div className="flex items-center gap-x-3">
              {specialNotes && (
                <Dialog open={isNotesOpen} onOpenChange={setIsNotesOpen}>
                  <DialogTrigger asChild>
                    <div
                      className="relative cursor-pointer"
                      onClick={handleOpenNotes}
                    >
                      {!hasReadNotes && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
                        >
                          !
                        </Badge>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <span className="hidden sm:inline">Notes</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                      </Button>
                    </div>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-md rounded-lg md:max-w-2xl max-h-[90vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle>
                        Customer Special Notes & Replies
                      </DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 flex flex-col min-h-0 space-y-4">
                      {/* Status message - stays fixed at top */}
                      {sendStatus && (
                        <div
                          className={`p-3 rounded-md ${
                            sendStatus.success
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {sendStatus.message}
                        </div>
                      )}

                      {/* Scrollable chat area */}
                      <div className="flex-1 overflow-y-auto">
                        <div className="space-y-4 rounded-md border p-4">
                          {/* Customer note */}
                          {specialNotes && (
                            <div className="flex flex-col items-start">
                              <div className="rounded-lg bg-gray-100 p-3 max-w-[80%]">
                                <p className="text-sm font-semibold text-gray-800">
                                  Customer Note
                                </p>
                                <p className="text-sm text-gray-700">
                                  {specialNotes}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Admin replies */}
                          {/* {repliedNotes.map((note, index) => (
                            <div
                              key={index}
                              className="flex flex-col items-end"
                            >
                              <div className="rounded-lg bg-blue-500 text-white p-3 max-w-[80%]">
                                <p className="text-sm">{note.text}</p>
                                <p className="text-xs text-blue-100 text-right mt-1">
                                  {new Date(note.timestamp).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </p>
                              </div>
                            </div>
                          ))} */}
                          {repliedNotes.map((note, index) => (
                            <div
                              key={index}
                              className="flex flex-col items-end"
                            >
                              <div
                                className={`rounded-lg p-3 max-w-[80%] ${
                                  note.read ? "bg-blue-400" : "bg-blue-500"
                                } text-white`}
                              >
                                <p className="text-sm">{note.text}</p>
                                <div className="flex justify-between items-center mt-1">
                                  <p className="text-xs text-blue-100">
                                    {new Date(
                                      note.timestamp
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                  {note.read && (
                                    <span className="text-xs text-blue-100 ml-2">
                                      ✓ Read{" "}
                                      {note.readAt &&
                                        new Date(
                                          note.readAt
                                        ).toLocaleTimeString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Fixed form at bottom */}
                      <form onSubmit={handleReplySubmit} className="space-y-4">
                        <Textarea
                          id="replyMessage"
                          placeholder="Type your reply here..."
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          rows={3}
                          disabled={isSending}
                          className="min-h-[100px]"
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsNotesOpen(false)}
                            disabled={isSending}
                          >
                            Close
                          </Button>
                          <Button
                            type="submit"
                            disabled={isSending || !replyMessage.trim()}
                            className="min-w-[120px]"
                          >
                            {isSending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              "Send Reply"
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              <CancelOrderDialog order={orders} className="" />

              <DeleteOrderDialog
                order={orders}
                className="hidden lg:inline-flex"
              />
            </div>
          </div>

          <div className="h-screen overflow-scroll scrollbar-none py-4">
            <div className="border border-neutral-300 rounded-lg p-4 flex flex-col sm:flex-row gap-4">
              <div className="w-full flex flex-col gap-2">
                <div className="flex justify-between">
                  <p className="font-semibold text-xs md:text-sm lg:text-base flex items-center gap-x-1">
                    With courier en route
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  </p>
                  <p className="font-semibold text-neutral-600 text-xs md:text-sm lg:text-base">
                    Dispatch Rider: <span className="text-black">{rider}</span>
                  </p>
                </div>

                {/* Order status */}
                <StatusPopup orderStatus={orderStatusCard} orders={orders} />

                <Separator className="my-4" />

                {/* Shipping and order details */}
                <AdminMiddleCards orders={orders} balance={balance} />

                <Separator className="my-4" />

                {/* Order Items */}
                <div>
                  <div className="flex justify-between">
                    <h3 className="text-lg font-bold mb-2">Order Item</h3>
                    <ModifyOrderDialog order={orders} />
                  </div>
                  <DisplayOrder orders={orders} />
                </div>

                <Separator className="my-4" />

                {/* Order Summary */}
                <div>
                  <h3 className="text-lg font-bold mb-2">Order Summary</h3>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-semibold">Subtotal</p>
                      <p className="text-sm font-semibold">Delivery Fee</p>
                      <p
                        className={`font-semibold text-sm  ${
                          orders?.creditAppliedTotal >= 0
                            ? "text-emerald-500"
                            : "text-red-500 "
                        }`}
                      >
                        {orders?.creditAppliedTotal >= 0
                          ? "Credit Balance"
                          : "Balance Due"}
                      </p>
                      <p className="text-sm font-semibold">Total</p>

                      <p className="text-sm font-semibold text-red-500">
                        Total Due
                      </p>
                    </div>

                    <div className="flex flex-col items-end">
                      <div className="flex justify-between">
                        <p className="font-semibold text-sm">
                          {formatCurrency(orders?.total, "GHS")}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="font-semibold text-sm ">
                          {formatCurrency(orders?.deliveryFee, "GHS")}
                        </p>
                      </div>
                      <div className={`flex justify-between `}>
                        <p
                          className={`font-semibold text-sm  ${
                            orders?.creditAppliedTotal >= 0
                              ? "text-emerald-500"
                              : "text-red-500 "
                          }`}
                        >
                          {formatCurrency(
                            Math.abs(orders?.creditAppliedTotal),
                            "GHS"
                          )}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="font-semibold text-sm">
                          {formatCurrency(orderTotal, "GHS")}
                        </p>
                      </div>

                      <div className="flex justify-between">
                        <p className="font-semibold text-sm text-red-500">
                          {formatCurrency(orders?.updatedOrderTotal, "GHS")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminOrderDetailCard
