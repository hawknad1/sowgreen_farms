"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"
import { Order } from "@/types"
import { AlertDestructive } from "@/components/alerts/AlertDestructive"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { SquarePen } from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { EditNotesSchema, StaffSchema } from "@/schemas"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface Props {
  order: Order
  children?: React.ReactNode
  className?: string
}

const EditNotesDialog = ({ order, className }: Props) => {
  const [isCancelling, setIsCancelling] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<z.infer<typeof EditNotesSchema>>({
    resolver: zodResolver(EditNotesSchema),
    defaultValues: {
      specialNotes: order?.specialNotes,
    },
  })

  const buttonDisabled =
    order?.status === "cancelled" || order?.paymentAction === "paid"

  const onSubmit = async (values: z.infer<typeof EditNotesSchema>) => {
    setIsSaving(true)
    try {
      const res = await fetch(`/api/orders/${order?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          specialNotes: values.specialNotes,
        }),
      })

      if (!res.ok) {
        throw new Error("Couldnt update staff")
      }

      window.location.reload()
    } catch (error) {
      console.log(error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex justify-between items-center mt-2">
        <div>
          <h3 className="font-medium text-sm">
            NOTES: <br />
            <span className="text-sm line-clamp-1">{order?.specialNotes}</span>
          </h3>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <button
                  disabled={buttonDisabled}
                  className={`p-2 rounded-sm  ${
                    order?.status === "confirmed" &&
                    "bg-gray-200/70 hover:bg-gray-200/50"
                  }`}
                >
                  <SquarePen className="w-4 h-4" />
                </button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit notes</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <DialogContent
        className={` ${
          order?.status === "confirmed" || order?.repliedNotes.length > 1
            ? "max-w-2xl h-fit p-1 rounded-lg"
            : "max-w-2xl h-fit flex flex-col py-3 scrollbar-hide overflow-y-scroll rounded-lg"
        }`}
      >
        {order?.status === "confirmed" || order?.repliedNotes.length > 1 ? (
          <AlertDestructive
            message="Your order is being confirmed and cannot be modified at this moment. 
            Kindly call Sowgreen Organic on 0546729407 / 0544437775 for assistance. 
            Thank you!"
          />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="specialNotes"
                render={({ field }) => (
                  <FormItem className="flex-1 min-w-[200px]">
                    <FormLabel>Edit Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Edit notes"
                        aria-label="special notes"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-x-4">
                {/* <Button type="submit" disabled={isSaving} className="w-full">
                  {isSaving ? (
                    <span className="loading loading-infinity loading-md"></span>
                  ) : (
                    "Save changes"
                  )}
                </Button> */}
                <Button type="submit" disabled={isSaving} className="w-full">
                  {isSaving ? (
                    <span className="loading loading-infinity loading-md"></span>
                  ) : (
                    "Save changes"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default EditNotesDialog
