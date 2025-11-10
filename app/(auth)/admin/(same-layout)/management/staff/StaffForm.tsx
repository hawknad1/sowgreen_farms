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
import { StaffSchema } from "@/schemas"
import toast from "react-hot-toast"
import { jobTitle, staffRole } from "@/constants"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Create type from Zod schema
type StaffFormValues = z.infer<typeof StaffSchema>

const StaffForm = () => {
  const [isSaving, setIsSaving] = useState(false)

  const sowgreenFarm_Con_Sid =
    process.env.NEXT_PUBLIC_TWILIO_CONVERSATIONS_SID_SOWGREEN_FARMS

  // React Hook Form setup
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(StaffSchema),
    defaultValues: {
      fullName: "",
      jobTitle: "",
      phone: "",
      role: "",
      email: "",
    },
  })

  // Form submission handler
  const onSubmit = async (values: StaffFormValues) => {
    setIsSaving(true)
    const firstName = values.fullName.split(" ")[0]
    const formattedPhone = values.phone.replace(/^0/, "+233")

    const convertedWhatsapp = values.phone.slice(1)
    try {
      // Save staff data
      const staffResponse = await fetch("/api/management/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!staffResponse.ok) {
        const errorData = await staffResponse.json()
        throw new Error(errorData.error || "Failed to save staff")
      }

      // Create WhatsApp participant
      const conversationResponse = await fetch(
        "/api/whatsapp/conversations/add-participants",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userWhatsAppNumber: `whatsapp:+233${convertedWhatsapp}`,
            name: values.fullName,
            conversationSid: sowgreenFarm_Con_Sid,
          }),
        }
      )

      if (!conversationResponse.ok) {
        const errorData = await conversationResponse.json()
        throw new Error(
          errorData.error || "Failed to create WhatsApp participant"
        )
      }

      await fetch("/api/whatsapp/messages/send-greetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: formattedPhone, name: firstName }),
      })

      // const newStaff = await response.json()
      // setStaff((prev) => [...prev, newStaff])
      form.reset() // Reset form fields

      toast.success("Staff added successfully")
      setTimeout(() => window.location.reload(), 1500)
    } catch (error) {
      console.error("Error adding staff:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-wrap gap-4">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[200px]">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter name"
                    aria-label="Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[150px]">
                <FormLabel>Job Title</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Job Title" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72 py-1.5 overflow-auto">
                    <SelectGroup>
                      <SelectLabel>Job Title</SelectLabel>
                      {jobTitle.map(({ label, value }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Role Field */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[150px]">
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72 py-1.5 overflow-auto">
                    <SelectGroup>
                      <SelectLabel>Role</SelectLabel>
                      {staffRole.map(({ label, value }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[120px]">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter email"
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
            "Add Staff"
          )}
        </Button>
      </form>
    </Form>
  )
}

export default StaffForm
