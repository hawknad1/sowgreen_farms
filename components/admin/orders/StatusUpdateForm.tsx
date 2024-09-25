import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
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
import { UpdateStatusSchema } from "@/schemas"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Order } from "@/types"
import { useRouter } from "next/navigation"
import React from "react"
import { orderStatusCard } from "@/constants"

const StatusUpdateForm = ({
  orders,
}: {
  orderStatus?: typeof orderStatusCard
  orders: Order
}) => {
  const router = useRouter()
  const form = useForm<z.infer<typeof UpdateStatusSchema>>({
    resolver: zodResolver(UpdateStatusSchema),
    defaultValues: orders,
  })

  const updateProduct = async (values: z.infer<typeof UpdateStatusSchema>) => {
    try {
      const res = await fetch(`/api/orders/${orders?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!res.ok) throw new Error("Failed to update status")

      toast.success("Status updated successfully!")
      router.push(`/admin/orders`)
    } catch (error) {
      toast.error("Error updating orders.")
    }
  }

  const onSubmit = (values: z.infer<typeof UpdateStatusSchema>) =>
    updateProduct(values)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between gap-x-3">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Order Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </Form>
  )
}

export default StatusUpdateForm
