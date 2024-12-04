import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
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

import { EditOrderDetailSchema } from "@/schemas"
import { Order } from "@/types"
import { deliveryMethods, newDeliveryMethod } from "@/constants"

interface OrderProps {
  order: Order
}

const EditOrderDetails = ({ order }: OrderProps) => {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<z.infer<typeof EditOrderDetailSchema>>({
    resolver: zodResolver(EditOrderDetailSchema),
    defaultValues: {
      deliveryMethod: order?.deliveryMethod || "",
      deliveryDate: order?.deliveryDate || "",
    },
  })

  const updateOrderDetails = async (
    values: z.infer<typeof EditOrderDetailSchema>
  ) => {
    setIsSaving(true)

    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error?.message || "Failed to update order details.")
      }

      toast.success("Order updated successfully!")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Error updating order details.")
    } finally {
      setIsSaving(false)
    }
  }

  const onSubmit = (values: z.infer<typeof EditOrderDetailSchema>) => {
    updateOrderDetails(values)
    console.log(values, "values")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Delivery Method */}
        <FormField
          control={form.control}
          name="deliveryMethod"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Delivery Method</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value)}
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
        />

        {/* Delivery/Pickup Date */}
        <FormField
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
                  {deliveryMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.date}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isSaving}>
          {isSaving ? "Saving changes..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  )
}

export default EditOrderDetails
