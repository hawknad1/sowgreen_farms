// "use client"
// import React, { useEffect, useState } from "react"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { toast } from "react-hot-toast"
// import { Button } from "@/components/ui/button"
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Order, OrderStatus } from "@/types"
// import { UpdateStatusSchema } from "@/schemas"
// import { sendOrderConfirmation } from "@/lib/actions/sendWhatsappMessage"
// import { useDispatchRidersStore } from "@/store"
// import { status } from "@/constants"

// interface StatusUpdateFormProps {
//   orders: Order
//   closeModal: () => void
// }

// const StatusUpdateForm: React.FC<StatusUpdateFormProps> = ({
//   orders,
//   closeModal,
// }) => {
//   const [orderStatus, setOrderStatus] = useState(orders.status)
//   const [isSaving, setIsSaving] = useState(false)
//   const { dispatchRiders, fetchDispatchRiders } = useDispatchRidersStore()

//   const [isMessageSent, setIsMessageSent] = useState(
//     orders.status === "confirmed"
//   ) // Track if the message was sent

//   const form = useForm<z.infer<typeof UpdateStatusSchema>>({
//     resolver: zodResolver(UpdateStatusSchema),
//     defaultValues: {
//       ...orders,
//       dispatchRider: orders.dispatchRider,
//     },
//   })

//   useEffect(() => {
//     fetchDispatchRiders()
//   }, [fetchDispatchRiders])

//   // API Call to Update Order
//   const updateOrder = async (values: z.infer<typeof UpdateStatusSchema>) => {
//     setIsSaving(true)
//     try {
//       const response = await fetch(`/api/orders/${orders.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(values),
//       })

//       if (!response.ok) {
//         const error = await response.json()
//         throw new Error(error.message || "Failed to update order")
//       }
//       toast.success("Order status updated successfully!")
//       closeModal()
//       window.location.reload()
//     } catch (error: any) {
//       toast.error(`Error: ${error.message || "Failed to update order"}`)
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   // Trigger WhatsApp message when order status is confirmed
//   useEffect(() => {
//     if (orderStatus === "confirmed" && !isMessageSent) {
//       sendOrderConfirmation(orders)
//       setIsMessageSent(true) // Prevent further triggering
//     }
//   }, [orderStatus, isMessageSent, orders])

//   // Handle form submission
//   const onSubmit = (values: z.infer<typeof UpdateStatusSchema>) => {
//     updateOrder(values)
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         <div className="flex w-full gap-2">
//           {/* Order Status Field */}
//           <FormField
//             control={form.control}
//             name="status"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormLabel>Order Status</FormLabel>
//                 <Select
//                   onValueChange={(value: OrderStatus) => {
//                     field.onChange(value)
//                     setOrderStatus(value)
//                   }}
//                   defaultValue={field.value}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select Status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {status.map(({ title, value }) => (
//                       <SelectItem value={value}>{title}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {/* Dispatch Rider Field */}
//           <FormField
//             control={form.control}
//             name="dispatchRider"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormLabel>Dispatch Rider</FormLabel>
//                 <Select
//                   onValueChange={field.onChange}
//                   defaultValue={field.value || ""}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select Rider" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {dispatchRiders.map((rider) => (
//                       <SelectItem
//                         key={rider.id}
//                         value={`${rider.firstName} ${rider.lastName}`}
//                       >
//                         {`${rider.firstName} ${rider.lastName}`}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <Button type="submit" className="w-full" disabled={isSaving}>
//           {isSaving ? (
//             <span className="loading loading-infinity loading-md"></span>
//           ) : (
//             "Save Changes"
//           )}
//         </Button>
//       </form>
//     </Form>
//   )
// }

// export default StatusUpdateForm

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
  sendOrderReceived,
} from "@/lib/actions/sendWhatsappMessage"
import { useDispatchRidersStore } from "@/store"
import { status } from "@/constants"
import { updateBalance } from "@/lib/updatedCreditBalance"

interface StatusUpdateFormProps {
  orders: Order
  closeModal: () => void
}

// const StatusUpdateForm: React.FC<StatusUpdateFormProps> = ({
//   orders,
//   closeModal,
// }) => {
//   const [orderStatus, setOrderStatus] = useState(orders.status)
//   const [isSaving, setIsSaving] = useState(false)
//   const { dispatchRiders, fetchDispatchRiders } = useDispatchRidersStore()

//   const form = useForm<z.infer<typeof UpdateStatusSchema>>({
//     resolver: zodResolver(UpdateStatusSchema),
//     defaultValues: {
//       ...orders,
//       dispatchRider: orders.dispatchRider
//         ? `${orders.dispatchRider.firstName} ${orders.dispatchRider.lastName}` // Join first name and last name
//         : "",
//     },
//   })

//   useEffect(() => {
//     fetchDispatchRiders()
//   }, [fetchDispatchRiders])

//   // Handle form submission

//   const updateOrder = async (values: z.infer<typeof UpdateStatusSchema>) => {
//     setIsSaving(true)

//     try {
//       // Validate if orders exist
//       if (!orders) {
//         throw new Error("No order found to update.")
//       }

//       // Find dispatch rider and prepare their data
//       const dispatchRider = dispatchRiders.find(
//         (rider) =>
//           `${rider.firstName} ${rider.lastName}` === values.dispatchRider
//       )

//       const dispatchRiderData = dispatchRider
//         ? {
//             id: dispatchRider.id,
//             firstName: dispatchRider.firstName,
//             lastName: dispatchRider.lastName,
//             phone: dispatchRider.phone,
//           }
//         : undefined

//       // Determine payment action based on order status
//       const isAutoPay =
//         orders.status === "confirmed" && orders.updatedOrderTotal === 0
//       const paymentAction = isAutoPay ? "paid" : "pending"

//       // Update the order
//       const updateOrderResponse = await fetch(`/api/orders/${orders.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...values,
//           dispatchRider: dispatchRiderData,
//           dispatchRiderId: dispatchRider?.id,
//           paymentAction: paymentAction,
//         }),
//       })

//       if (!updateOrderResponse.ok) {
//         const error = await updateOrderResponse.json()
//         throw new Error(error.message || "Failed to update order")
//       }

//       // Handle auto-pay logic if applicable
//       if (isAutoPay) {
//         await updateBalance(orders)
//       }

//       // Process the updated order
//       const updatedOrder = await updateOrderResponse.json()
//       setOrderStatus(updatedOrder.status)

//       // Send order confirmation if status is confirmed
//       if (updatedOrder.status === "confirmed") {
//         await sendOrderConfirmation(orders)
//       }

//       // Close modal, show success message, and reload the page
//       closeModal()
//       toast.success("Order status updated successfully!")
//       window.location.reload()
//     } catch (error: any) {
//       toast.error(`Error: ${error.message || "Failed to update order"}`)
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   const onSubmit = (values: z.infer<typeof UpdateStatusSchema>) => {
//     updateOrder(values)
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         <div className="flex w-full gap-2">
//           {/* Order Status Field */}
//           <FormField
//             control={form.control}
//             name="status"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormLabel>Order Status</FormLabel>
//                 <Select
//                   onValueChange={(value: OrderStatus) => {
//                     field.onChange(value)
//                     setOrderStatus(value)
//                   }}
//                   defaultValue={field.value}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select Status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {status.map(({ title, value }) => (
//                       <SelectItem key={value} value={value}>
//                         {title}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {/* Dispatch Rider Field */}
//           <FormField
//             control={form.control}
//             name="dispatchRider"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormLabel>Dispatch Rider</FormLabel>
//                 <Select
//                   onValueChange={field.onChange}
//                   // defaultValue={field.value || ""}
//                   defaultValue={
//                     typeof field.value === "string" ? field.value : ""
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select Rider" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {dispatchRiders.map((rider) => (
//                       <SelectItem
//                         key={rider.id}
//                         value={`${rider.firstName} ${rider.lastName}`}
//                       >
//                         {`${rider.firstName} ${rider.lastName}`}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <Button type="submit" className="w-full" disabled={isSaving}>
//           {isSaving ? (
//             <span className="loading loading-infinity loading-md"></span>
//           ) : (
//             "Save Changes"
//           )}
//         </Button>
//       </form>
//     </Form>
//   )
// }

// export default StatusUpdateForm

const StatusUpdateForm: React.FC<StatusUpdateFormProps> = ({
  orders,
  closeModal,
}) => {
  const [orderStatus, setOrderStatus] = useState(orders.status)
  const [isSaving, setIsSaving] = useState(false)
  const { dispatchRiders, fetchDispatchRiders } = useDispatchRidersStore()

  const form = useForm<z.infer<typeof UpdateStatusSchema>>({
    resolver: zodResolver(UpdateStatusSchema),
    defaultValues: {
      ...orders,
      dispatchRider: orders.dispatchRider
        ? `${orders.dispatchRider.firstName} ${orders.dispatchRider.lastName}`
        : "",
    },
  })

  useEffect(() => {
    fetchDispatchRiders()
  }, [fetchDispatchRiders])

  const updateOrder = async (values: z.infer<typeof UpdateStatusSchema>) => {
    setIsSaving(true)

    try {
      if (!orders) {
        throw new Error("No order found to update.")
      }

      const dispatchRider = dispatchRiders.find(
        (rider) =>
          `${rider.firstName} ${rider.lastName}` === values.dispatchRider
      )

      const dispatchRiderData = dispatchRider
        ? {
            id: dispatchRider.id,
            firstName: dispatchRider.firstName,
            lastName: dispatchRider.lastName,
            phone: dispatchRider.phone,
          }
        : undefined

      // ✨ KEY CHANGE: Use values.status instead of orders.status
      const isAutoPay =
        values.status === "confirmed" && orders.updatedOrderTotal === 0
      const paymentAction = isAutoPay ? "paid" : "pending"

      const updateOrderResponse = await fetch(`/api/orders/${orders.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          dispatchRider: dispatchRiderData,
          dispatchRiderId: dispatchRider?.id,
          paymentAction: paymentAction,
        }),
      })

      if (!updateOrderResponse.ok) {
        const error = await updateOrderResponse.json()
        throw new Error(error.message || "Failed to update order")
      }

      // ✨ Use updatedOrder for confirmation instead of original orders
      const updatedOrder = await updateOrderResponse.json()

      if (isAutoPay) {
        await updateBalance(orders) // Use updated order data
      }

      //       // Handle auto-pay logic if applicable
      // if (isAutoPay) {
      //   await updateBalance(orders)
      // }

      setOrderStatus(updatedOrder.status)

      if (updatedOrder.status === "confirmed") {
        await sendOrderConfirmation(updatedOrder) // Use updated order
      }

      closeModal()
      toast.success("Order status updated successfully!")
      window.location.reload()
    } catch (error: any) {
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
          {/* Order Status Field */}{" "}
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
                  // defaultValue={field.value || ""}
                  defaultValue={
                    typeof field.value === "string" ? field.value : ""
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Rider" />
                  </SelectTrigger>
                  <SelectContent>
                    {dispatchRiders.map((rider) => (
                      <SelectItem
                        key={rider.id}
                        value={`${rider.firstName} ${rider.lastName}`}
                      >
                        {`${rider.firstName} ${rider.lastName}`}
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
