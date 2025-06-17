import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { EditOrderDetailSchema } from "@/schemas"
import { Order } from "@/types"
import {
  cityDeliveryPrices,
  deliveryDates,
  newDeliveryMethod,
  paymentActionList,
} from "@/constants"
import toast from "react-hot-toast"
import { deductBalance } from "@/lib/actions/deductBalance"

interface OrderProps {
  order: Order
}

const EditOrderDetails = ({ order }: OrderProps) => {
  const [isSaving, setIsSaving] = useState(false)
  // const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(
  //   order?.shippingAddress?.deliveryMethod.trim() || ""
  // )

  // Initialize deliveryFee with order's value, but will be updated based on method/city
  // const [deliveryFee, setDeliveryFee] = useState<number>(
  //   order?.deliveryFee || 0
  // )

  // const [selectedCity, setSelectedCity] = useState(
  //   order?.shippingAddress?.city || ""
  // )

  // const total = order?.total + deliveryFee
  // const { updatedOrderTotal } = deductBalance(order?.creditAppliedTotal, total)

  // Update delivery fee whenever the selected delivery method or city changes
  // useEffect(() => {
  //   // Only update if the delivery method is "Home Delivery"
  //   if (selectedDeliveryMethod !== "Home Delivery") {
  //     setDeliveryFee(0)
  //   } else {
  //     let newDeliveryFee = 0

  //     if (selectedCity && cityDeliveryPrices[selectedCity]) {
  //       newDeliveryFee = cityDeliveryPrices[selectedCity]
  //     }
  //     setDeliveryFee(newDeliveryFee)
  //   }
  // }, [deliveryFee, selectedDeliveryMethod])

  const form = useForm<z.infer<typeof EditOrderDetailSchema>>({
    resolver: zodResolver(EditOrderDetailSchema),
    defaultValues: {
      // deliveryMethod: order?.shippingAddress?.deliveryMethod?.trim(),
      // deliveryDate: order?.deliveryDate,
      paymentAction: order?.paymentAction,
    },
  })

  const onSubmit = async (values: z.infer<typeof EditOrderDetailSchema>) => {
    // if (!order?.shippingAddress?.id || !order?.id) {
    //   console.error("Order or Shipping Address ID is missing.")
    //   return
    // }

    setIsSaving(true)

    try {
      // const res = await fetch(
      //   `/api/shipping-address/${order.shippingAddress.id}`,
      //   {
      //     method: "PUT",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ deliveryMethod: values.deliveryMethod }),
      //   }
      // )

      // if (!res.ok) throw new Error("Failed to update delivery method")

      const deliverRes = await fetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentAction: values.paymentAction,
        }),
      })

      if (!deliverRes.ok) throw new Error("Failed to update payment action")

      window.location.reload()
      toast.success("Payment action updated successfully!")
    } catch (error) {
      console.error("Error updating payment action", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
        <div className="md:inline-flex w-full md:gap-x-4">
          {/* Delivery Method */}
          {/* <FormField
            control={form.control}
            name="deliveryMethod"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Delivery Method</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    setSelectedDeliveryMethod(value) // Update selected delivery method
                  }}
                  value={field.value} // Bind value to React Hook Form
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a delivery method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {newDeliveryMethod.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {/* Delivery/Pickup Date */}
          {/* <FormField
            control={form.control}
            name="deliveryDate"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Delivery/Pickup Date</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value} // Bind value to React Hook Form
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Delivery/Pickup Date" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {deliveryDates.map((method) => (
                      <SelectItem key={method.date} value={method.date}>
                        {method.date}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {/* Payment Action */}
          <FormField
            control={form.control}
            name="paymentAction"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Payment Action</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value} // Bind value to React Hook Form
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment action" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {paymentActionList.map((action) => (
                      <SelectItem key={action.value} value={action.value}>
                        {action.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-sowgren_Color hover:bg-sowgren_Color/85"
          disabled={isSaving}
        >
          {isSaving ? (
            <span className="loading loading-infinity loading-md"></span>
          ) : (
            "Save changes"
          )}
        </Button>
      </form>
    </Form>
  )
}

export default EditOrderDetails
