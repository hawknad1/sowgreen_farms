"use client"
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
import { Input } from "@/components/ui/input"
import { CheckoutSchema, EditProductSchema } from "@/schemas"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { cityDeliveryPrices, regions } from "@/constants"
import { useState } from "react"
import { ShippingAddress } from "@/types"

interface ShippingProps {
  shippingAddress: ShippingAddress
}

const EditShippingDetails = ({ shippingAddress }: ShippingProps) => {
  const router = useRouter()
  const [selectedCity, setSelectedCity] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<z.infer<typeof CheckoutSchema>>({
    resolver: zodResolver(CheckoutSchema),
    defaultValues: shippingAddress,
  })

  const updateShippingAddress = async (
    values: z.infer<typeof CheckoutSchema>
  ) => {
    setIsSaving(true)
    try {
      const res = await fetch(`/api/shipping-address/${shippingAddress?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!res.ok) throw new Error("Failed to update shipping address")

      toast.success("Product updated successfully!")
      // router.push(`/admin/products`)
    } catch (error) {
      toast.error("Error updating product.")
    } finally {
      setIsSaving(false)
    }
  }

  const onSubmit = (values: z.infer<typeof CheckoutSchema>) =>
    updateShippingAddress(values)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between gap-x-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3">
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                  }}
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
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    setSelectedCity(value)
                  }}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72 py-1.5 overflow-auto">
                    <SelectGroup>
                      <SelectLabel>City</SelectLabel>
                      {Object.keys(cityDeliveryPrices).map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectGroup>
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
            "Save changes"
          )}
        </Button>
      </form>
    </Form>
  )
}

export default EditShippingDetails
