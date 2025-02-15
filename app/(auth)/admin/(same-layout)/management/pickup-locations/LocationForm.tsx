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
import { AddLocationSchema, UpdateRiderSchema } from "@/schemas"
import toast from "react-hot-toast"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { regions } from "@/constants"

const LocationForm = () => {
  const [location, setLocation] = useState<
    { region: string; city: string; address: string }[]
  >([])
  const [isSaving, setIsSaving] = useState(false)

  // React Hook Form setup
  const form = useForm<z.infer<typeof AddLocationSchema>>({
    resolver: zodResolver(AddLocationSchema),
    defaultValues: {
      region: "",
      city: "",
      address: "",
    },
  })

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof AddLocationSchema>) => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/pickup-locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const { error } = await response.json()
        console.error("Error:", error)
        return
      }

      const newLocation = await response.json()
      setLocation((prev) => [...prev, newLocation])
      form.reset() // Reset form fields
      window.location.reload()
      toast.success("Location added successfully")
    } catch (error) {
      console.error("Error adding location:", error)
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
            name="region"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[150px]">
                <FormLabel>Region</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72 py-1.5 overflow-auto">
                    <SelectGroup>
                      <SelectLabel>Region</SelectLabel>
                      {regions.map((reg) => (
                        <SelectItem key={reg.name} value={reg.name}>
                          {reg.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* City */}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[200px]">
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter city"
                    aria-label="City"
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
            name="address"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[120px]">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter address"
                    aria-label="Address"
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
            "Add Pickup Location"
          )}
        </Button>
      </form>
    </Form>
  )
}

export default LocationForm
