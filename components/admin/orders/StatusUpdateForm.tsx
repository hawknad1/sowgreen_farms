"use client"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Order, OrderStatus } from "@/types"
import { UpdateStatusSchema } from "@/schemas"
import {
  sendOrderConfirmation,
  sendOrderConfirmationGroup,
} from "@/lib/actions/sendWhatsappMessage"
import { useDispatchRidersStore } from "@/store"
import { status } from "@/constants"
import { deductBalance } from "@/lib/actions/deductBalance"
import { getUser } from "@/lib/actions/getUser"

interface StatusUpdateFormProps {
  orders: Order
  closeModal: () => void
}

interface UserData {
  user: {
    id: string
    name?: string
    email?: string
    balance?: number
    role: string
    image?: string | null
    createdAt: string
    updatedAt: string
    emailVerified?: string | null
    phone?: string | null
  }
}

const StatusUpdateForm: React.FC<StatusUpdateFormProps> = ({
  orders,
  closeModal,
}) => {
  const [orderStatus, setOrderStatus] = useState(orders.status)
  const [isSaving, setIsSaving] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(false)

  const { dispatchRiders, fetchDispatchRiders } = useDispatchRidersStore()

  const filteredDispatchRider = dispatchRiders.filter(
    (user) => user.jobTitle === "dispatch rider"
  )

  const email = orders?.shippingAddress?.email

  useEffect(() => {
    const fetchUser = async () => {
      if (!email) return

      setLoading(true) // Start loading

      const data = await getUser(email)
      if (data) setUserData(data)

      setLoading(false) // Done loading
    }

    fetchUser()
  }, [email])

  const balance = userData?.user?.balance

  const { updatedBalance } = deductBalance(
    balance,
    orders?.total + orders?.deliveryFee
  )

  const form = useForm<z.infer<typeof UpdateStatusSchema>>({
    resolver: zodResolver(UpdateStatusSchema),
    defaultValues: {
      ...orders,
      dispatchRider: orders.dispatchRider
        ? `${orders.dispatchRider.fullName}` // Join first name and last name
        : "",
    },
  })

  useEffect(() => {
    fetchDispatchRiders()
  }, [fetchDispatchRiders])

  // const updateOrder = async (values: z.infer<typeof UpdateStatusSchema>) => {
  //   setIsSaving(true)
  //   try {
  //     // Map the dispatch rider's name to their ID before sending the request
  //     const dispatchRider = dispatchRiders.find(
  //       (rider) => `${rider.fullName}` === values.dispatchRider
  //     )

  //     const dispatchRiderId = dispatchRider?.id // Extract ID
  //     const dispatchRiderData = dispatchRider
  //       ? {
  //           id: dispatchRider.id, // Pass ID
  //           fullName: dispatchRider.fullName,
  //           phone: dispatchRider.phone,
  //         }
  //       : undefined

  //     const isAutoPay =
  //       values.status === "confirmed" &&
  //       orders.updatedOrderTotal === 0 &&
  //       orders.paymentAction !== "paid" // Only update if not already 'paid'

  //     const paymentAction = isAutoPay ? "paid" : orders.paymentAction // Use existing paymentAction if not auto-pay

  //     const response = await fetch(`/api/orders/${orders.id}`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         ...values,
  //         dispatchRider: dispatchRiderData, // Pass the full dispatch rider object
  //         updatedBalance,
  //         dispatchRiderId, // Pass the ID if needed
  //         ...(paymentAction !== orders.paymentAction && { paymentAction }), // Only include if changed
  //       }),
  //     })

  //     if (!response.ok) {
  //       const error = await response.json()
  //       throw new Error(error.message || "Failed to update order")
  //     }

  //     const updatedOrder = await response.json()
  //     setOrderStatus(updatedOrder.status)

  //     if (updatedOrder.status === "confirmed") {
  //       await sendOrderConfirmation(orders)
  //       await sendOrderConfirmationGroup(orders)
  //     }

  //     // Use updated order data for operations
  //     if (isAutoPay) {
  //       // await updateBalance(orders)

  //       const balanceResponse = await fetch("/api/balance", {
  //         method: "PUT",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           email: orders?.shippingAddress.email,
  //           updatedBalance,
  //           phone: orders.shippingAddress.phone,
  //         }),
  //       })

  //       if (!balanceResponse.ok) {
  //         const error = await balanceResponse.json()
  //         throw new Error(error.message || "Failed to update balance")
  //       }
  //     }

  //     closeModal()
  //     toast.success("Order status updated successfully!")
  //     window.location.reload()
  //   } catch (error: any) {
  //     toast.error(`Error: ${error.message || "Failed to update order"}`)
  //   } finally {
  //     setIsSaving(false)
  //   }
  // }

  const updateOrder = async (values: z.infer<typeof UpdateStatusSchema>) => {
    setIsSaving(true)
    try {
      // 1. Prepare dispatch rider data
      const dispatchRider = dispatchRiders.find(
        (rider) => `${rider.fullName}` === values.dispatchRider
      )

      const dispatchRiderId = dispatchRider?.id
      const dispatchRiderData = dispatchRider
        ? {
            id: dispatchRider.id,
            fullName: dispatchRider.fullName,
            phone: dispatchRider.phone,
          }
        : undefined

      const isAutoPay =
        values.status === "confirmed" &&
        orders.updatedOrderTotal === 0 &&
        orders.paymentAction !== "paid"

      const paymentAction = isAutoPay ? "paid" : orders.paymentAction

      // 2. Update the order
      const response = await fetch(`/api/orders/${orders.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          dispatchRider: dispatchRiderData,
          updatedBalance,
          dispatchRiderId,
          ...(paymentAction !== orders.paymentAction && { paymentAction }),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to update order")
      }

      // 3. Wait for database commit
      await new Promise((resolve) => setTimeout(resolve, 500))

      // 4. Refetch the updated order to ensure data consistency
      const updatedOrderResponse = await fetch(`/api/orders/${orders.id}`)
      if (!updatedOrderResponse.ok) {
        throw new Error("Failed to fetch updated order")
      }
      const updatedOrder = await updatedOrderResponse.json()

      console.log("Order update verification:", {
        originalDispatchRider: orders.dispatchRider,
        updatedDispatchRider: updatedOrder.dispatchRider,
      })

      // 5. Send notifications only after confirming update
      if (updatedOrder.status === "confirmed") {
        await Promise.all([
          sendOrderConfirmation(updatedOrder),
          sendOrderConfirmationGroup(updatedOrder),
        ]).catch((error) => {
          console.error("Failed to send notifications:", error)
          throw new Error("Notifications failed to send")
        })
      }

      // 6. Handle balance updates if needed
      if (isAutoPay) {
        const balanceResponse = await fetch("/api/balance", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: orders?.shippingAddress.email,
            updatedBalance,
            phone: orders.shippingAddress.phone,
          }),
        })

        if (!balanceResponse.ok) {
          const error = await balanceResponse.json()
          throw new Error(error.message || "Failed to update balance")
        }
      }

      closeModal()
      toast.success("Order status updated successfully!")
      window.location.reload()
    } catch (error: any) {
      console.error("Order update error:", error)
      toast.error(`Error: ${error.message || "Failed to update order"}`)
    } finally {
      setIsSaving(false)
    }
  }

  const onSubmit = (values: z.infer<typeof UpdateStatusSchema>) => {
    updateOrder(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex w-full gap-2">
          {/* Order Status Field */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Order Status</FormLabel>
                <Select
                  onValueChange={(value: OrderStatus) => {
                    field.onChange(value)
                    setOrderStatus(value)
                  }}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {status.map(({ title, value }) => (
                      <SelectItem key={value} value={value}>
                        {title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Dispatch Rider Field */}
          <FormField
            control={form.control}
            name="dispatchRider"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Dispatch Rider</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={
                    typeof field.value === "string" ? field.value : ""
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Rider" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredDispatchRider.map((rider) => (
                      <SelectItem key={rider.id} value={`${rider.fullName}`}>
                        {rider.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          variant="sowgreen"
          type="submit"
          className="w-full"
          disabled={isSaving}
        >
          {isSaving ? (
            <span className="loading loading-infinity loading-md"></span>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </Form>
  )
}

export default StatusUpdateForm
