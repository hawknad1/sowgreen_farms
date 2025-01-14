"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { UpdateRiderSchema } from "@/schemas"
import toast from "react-hot-toast"

const RiderForm = () => {
  const [riders, setRiders] = useState<
    { firstName: string; lastName: string; phone: string }[]
  >([])
  const [isSaving, setIsSaving] = useState(false)

  // React Hook Form setup
  const form = useForm<z.infer<typeof UpdateRiderSchema>>({
    resolver: zodResolver(UpdateRiderSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      gender: "",
    },
  })

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof UpdateRiderSchema>) => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/dispatch-riders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const { error } = await response.json()
        console.error("Error:", error)
        return
      }

      const newRider = await response.json()
      setRiders((prev) => [...prev, newRider])
      form.reset() // Reset form fields
      window.location.reload()
      toast.success("Rider added successfully")
    } catch (error) {
      console.error("Error adding rider:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-wrap gap-4">
          {/* First Name Field */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[200px]">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter first name"
                    aria-label="First Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Name Field */}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[200px]">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter last name"
                    aria-label="Last Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Field */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[120px]">
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter phone number"
                    aria-label="Phone"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isSaving} className="w-full">
          {isSaving ? (
            <span className="loading loading-infinity loading-md"></span>
          ) : (
            "Add Rider"
          )}
        </Button>
      </form>
    </Form>
  )
}

export default RiderForm
