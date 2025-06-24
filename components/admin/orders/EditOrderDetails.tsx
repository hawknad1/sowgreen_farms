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
import { PaymentActionSchema } from "@/schemas"
import { Order } from "@/types"
import { paymentActionList } from "@/constants"
import { deductBalance } from "@/lib/actions/deductBalance"
import { getUser } from "@/lib/actions/getUser"
import { UserData } from "./StatusUpdateForm"
import toast from "react-hot-toast"

interface OrderProps {
  order: Order
}

const EditOrderDetails = ({ order }: OrderProps) => {
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)

  const form = useForm<z.infer<typeof PaymentActionSchema>>({
    resolver: zodResolver(PaymentActionSchema),
    defaultValues: {
      paymentAction: order?.paymentAction,
    },
  })

  const email = order?.shippingAddress?.email

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

  const orderTotal = order?.total + order?.deliveryFee
  const balance = userData?.user?.balance

  const { updatedBalance } = deductBalance(balance, orderTotal)

  console.log(updatedBalance, "updatedBalance===")

  const onSubmit = async (values: z.infer<typeof PaymentActionSchema>) => {
    setIsSaving(true)

    try {
      const deliverRes = await fetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentAction: values.paymentAction,
        }),
      })

      if (!deliverRes.ok) throw new Error("Failed to update payment action")

      // Handle balance updates if needed
      const balanceResponse = await fetch("/api/balance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          updatedBalance,
          phone: order.shippingAddress.phone,
        }),
      })

      if (!balanceResponse.ok) {
        const error = await balanceResponse.json()
        throw new Error(error.message || "Failed to update balance")
      }

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
