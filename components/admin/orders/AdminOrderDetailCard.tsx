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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { sendWhatsappReply } from "@/lib/twilio/whatsapp/send-whatsapp-reply"
import { Loader2 } from "lucide-react"
import { MessageBubble } from "@/components/MessageBubble"

const AdminOrderDetailCard = ({ orders }: { orders: Order }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [activeUser, setActiveUser] = useState<User>(null)
  const [replyMessage, setReplyMessage] = useState("")
  const [currentOrder, setCurrentOrder] = useState<Order>(orders)
  const [isNotesOpen, setIsNotesOpen] = useState(false)
  const repliedNotes = orders?.repliedNotes || []
  const [unreadCount, setUnreadCount] = useState(0)
  const [hasReadNotes, setHasReadNotes] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sendStatus, setSendStatus] = useState<{
    success: boolean
    message: string
  } | null>(null)
  const [messages, setMessages] = useState<
    Array<{
      content: string
      timestamp: Date
      sender: "customer" | "admin"
      read?: boolean
      readAt?: Date
    }>
  >([])

  const { data: session } = useSession()
  const user = session?.user

  const deliveryFee = orders?.deliveryFee
  const orderTotal = orders?.total + deliveryFee
  const balance = activeUser?.user?.balance
  const email = orders?.shippingAddress?.email
  const rider = orders?.dispatchRider?.fullName || "Not Assigned"
  const specialNotes = orders?.specialNotes

  // console.log(specialNotes, "special Note")

  const loadMessages = async () => {
    try {
      const res = await fetch(
        `/api/orders/${orders.id}/messages?timestamp=${new Date().getTime()}`,
        {
          cache: "no-store",
        }
      )
      if (res.ok) {
        const { messages: apiMessages } = await res.json()
        setMessages((prevMessages) => {
          // Only update if messages have changed
          if (JSON.stringify(apiMessages) !== JSON.stringify(prevMessages)) {
            return apiMessages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
              readAt: msg.readAt ? new Date(msg.readAt) : undefined,
            }))
          }
          return prevMessages
        })
      }
    } catch (error) {
      console.error("Failed to load messages:", error)
    }
  }

  // Add this useEffect hook to your component
  useEffect(() => {
    if (!isNotesOpen) return // Only poll when dialog is open

    const pollInterval = 5000 // Check every 5 seconds
    const pollMessages = async () => {
      try {
        await loadMessages()
      } catch (error) {
        console.error("Error polling messages:", error)
      }
    }

    const intervalId = setInterval(pollMessages, pollInterval)
    return () => clearInterval(intervalId) // Cleanup on unmount or when dialog closes
  }, [isNotesOpen, orders?.id]) // Re-run when dialog opens/closes or order changes

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

  // const loadMessages = async () => {
  //   try {
  //     const res = await fetch(`/api/orders/${orders.id}/messages`)
  //     if (res.ok) {
  //       const { messages: apiMessages } = await res.json()
  //       const formattedMessages = apiMessages.map((msg: any) => ({
  //         ...msg,
  //         timestamp: new Date(msg.timestamp),
  //         readAt: msg.readAt ? new Date(msg.readAt) : undefined,
  //       }))
  //       setMessages(formattedMessages)
  //     }
  //   } catch (error) {
  //     console.error("Failed to load messages:", error)
  //   }
  // }

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!replyMessage?.trim()) {
      setSendStatus({ success: false, message: "Message cannot be empty" })
      return
    }

    if (!orders.shippingAddress?.phone) {
      setSendStatus({ success: false, message: "Order information incomplete" })
      return
    }

    setIsSending(true)
    setSendStatus(null)

    try {
      // Check 24-hour window
      const windowCheck = await fetch(
        `/api/orders/${orders.id}/whatsapp-window`
      )
      if (!windowCheck.ok) throw new Error("Failed to check WhatsApp window")
      const { isWithin24Hours } = await windowCheck.json()

      // Save message to database
      const saveResponse = await fetch(`/api/orders/${orders.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: replyMessage.trim(),
          sender: "admin",
        }),
      })

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json()
        throw new Error(errorData.error || "Failed to save message")
      }

      const newMessage = await saveResponse.json()
      setMessages((prev) => [
        ...prev,
        {
          ...newMessage,
          timestamp: new Date(newMessage.timestamp),
          readAt: newMessage.readAt ? new Date(newMessage.readAt) : undefined,
        },
      ])
      setReplyMessage("")

      // Send via WhatsApp
      const phoneNumber = orders.shippingAddress.phone
      const formattedPhone = phoneNumber.startsWith("0")
        ? `233${phoneNumber.substring(1)}`
        : phoneNumber

      const endpoint = isWithin24Hours
        ? "/api/whatsapp/direct-message"
        : "/api/whatsapp/reply-note"

      const whatsappResponse = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: formattedPhone,
          message: replyMessage.trim(),
          // orderId: orders.id,
          order: {
            id: orders.id,
            shippingAddress: orders.shippingAddress,
            orderNumber: orders.orderNumber,
          },
        }),
      })

      if (!whatsappResponse.ok) {
        const errorData = await whatsappResponse.json()
        throw new Error(errorData.error || "WhatsApp message failed")
      }

      await loadMessages()

      setSendStatus({
        success: true,
        message: `Reply sent ${isWithin24Hours ? "directly" : "via template"}!`,
      })
    } catch (error) {
      console.error("Error in handleReplySubmit:", error)
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

  useEffect(() => {
    loadMessages()

    // Calculate unread messages when messages change
    setUnreadCount(
      messages.filter((msg) => msg.sender === "customer" && !msg.read).length
    )
  }, [orders?.id]) // Re-run if `orders.id` changes

  const handleOpenNotes = () => {
    setIsNotesOpen(true)
    setHasReadNotes(true)
    localStorage.setItem(`notesRead_${orders?.id}`, "true")
  }

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
              {/* {specialNotes && ( */}
              <Dialog open={isNotesOpen} onOpenChange={setIsNotesOpen}>
                {/* <DialogTrigger asChild>
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
                </DialogTrigger> */}

                <DialogTrigger asChild>
                  <div
                    className="relative cursor-pointer"
                    onClick={handleOpenNotes}
                  >
                    {!hasReadNotes ? (
                      <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
                      >
                        !
                      </Badge>
                    ) : unreadCount > 0 && !hasReadNotes ? (
                      <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
                      >
                        {unreadCount}
                      </Badge>
                    ) : null}

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
                      Chat with {orders.shippingAddress?.name}
                    </DialogTitle>
                    <DialogDescription>
                      {sendStatus?.success && (
                        <span
                          className={
                            sendStatus.success
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {sendStatus.message}
                        </span>
                      )}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {/* {specialNotes && (
                        <MessageBubble
                          message={{
                            content: specialNotes,
                            timestamp: orders.createdAt,
                            sender: "customer",
                            read: true,
                          }}
                          isCustomer={true}
                        />
                      )} */}

                      {messages.map((message, index) => (
                        <MessageBubble
                          key={index}
                          message={message}
                          isCustomer={message.sender === "customer"}
                        />
                      ))}
                    </div>

                    <form onSubmit={handleReplySubmit} className="p-4 border-t">
                      <Textarea
                        placeholder="Type your reply here..."
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        rows={3}
                        disabled={isSending}
                        className="min-h-[100px] mb-3"
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
              {/* )} */}

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
