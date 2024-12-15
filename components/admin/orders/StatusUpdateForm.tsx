import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

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
import { dispatchRider } from "@/constants"
import { UpdateStatusSchema } from "@/schemas"
import { sendOrderConfirmation } from "@/lib/actions/sendWhatsappMessage"

interface StatusUpdateFormProps {
  orders: Order
  closeModal: () => void
}

const StatusUpdateForm: React.FC<StatusUpdateFormProps> = ({
  orders,
  closeModal,
}) => {
  const router = useRouter()
  const [orderStatus, setOrderStatus] = useState(orders.status)
  const [isSaving, setIsSaving] = useState(false)

  const [isMessageSent, setIsMessageSent] = useState(
    orders.status === "confirmed"
  ) // Track if the message was sent

  const form = useForm<z.infer<typeof UpdateStatusSchema>>({
    resolver: zodResolver(UpdateStatusSchema),
    defaultValues: {
      ...orders,
      dispatchRider: "",
    },
  })

  // API Call to Update Order
  const updateOrder = async (values: z.infer<typeof UpdateStatusSchema>) => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/orders/${orders.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to update order")
      }

      toast.success("Order status updated successfully!")
      closeModal()
      window.location.reload()
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to update order"}`)
    } finally {
      setIsSaving(false)
    }
  }

  // Trigger WhatsApp message when order status is confirmed
  useEffect(() => {
    if (orderStatus === "confirmed" && !isMessageSent) {
      sendOrderConfirmation(orders)
      setIsMessageSent(true) // Prevent further triggering
    }
  }, [orderStatus, isMessageSent, orders])

  // Handle form submission
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
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="in-transit">In Transit</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
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
                  defaultValue={field.value || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Rider" />
                  </SelectTrigger>
                  <SelectContent>
                    {dispatchRider.map(({ name, value }) => (
                      <SelectItem key={value} value={value}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSaving}>
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
