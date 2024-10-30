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
import { dispatchRider, orderStatusCard } from "@/constants"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const StatusUpdateForm = ({
  orders,
  closeModal,
}: {
  orderStatus?: typeof orderStatusCard
  orders: Order
  closeModal: () => void
}) => {
  const router = useRouter()
  const form = useForm<z.infer<typeof UpdateStatusSchema>>({
    resolver: zodResolver(UpdateStatusSchema),
    defaultValues: orders,
  })

  const updateOrder = async (values: z.infer<typeof UpdateStatusSchema>) => {
    try {
      const res = await fetch(`/api/orders/${orders?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!res.ok) throw new Error("Failed to update status")

      toast.success("Status updated successfully!")
      closeModal() // Close modal after successful update
      window.location.reload() // Refresh the page
    } catch (error) {
      toast.error("Error updating orders.")
    }
  }

  const onSubmit = (values: z.infer<typeof UpdateStatusSchema>) => {
    updateOrder(values)
    router.refresh()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex w-full gap-2">
          <div className="w-full">
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
          <div className="w-full">
            <FormField
              control={form.control}
              name="dispatchRider"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Dispatch Rider</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Rider" />
                    </SelectTrigger>
                    <SelectContent>
                      {dispatchRider.map(({ name, value }, index) => (
                        <SelectItem key={index} value={value}>
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
        </div>

        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </Form>
  )
}

export default StatusUpdateForm
