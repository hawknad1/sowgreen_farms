import React, { useState } from "react"
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
import { UpdateCityandFeeSchema } from "@/schemas"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CitiesWithFees } from "@/types"
import { regions } from "@/constants"

interface Props {
  location?: CitiesWithFees
}

const EditLocationForm = ({ location }: Props) => {
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<z.infer<typeof UpdateCityandFeeSchema>>({
    resolver: zodResolver(UpdateCityandFeeSchema),
    defaultValues: location,
  })
  const onSubmit = async (values: z.infer<typeof UpdateCityandFeeSchema>) => {
    setIsSaving(true)
    try {
      const res = await fetch(`/api/cities/${location.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        throw new Error("Couldnt update location")
      }

      window.location.reload()
    } catch (error) {
      console.log(error)
    } finally {
      setIsSaving(false)
    }
  }
  // updateProduct(values)
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-wrap gap-4">
          {/* Region */}
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

          {/* Delivery Fee */}
          <FormField
            control={form.control}
            name="deliveryFee"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[120px]">
                <FormLabel>Delivery Fee</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter fee"
                    type="number"
                    aria-label="Delivery Fee"
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
            "Save changes"
          )}
        </Button>
      </form>
    </Form>
  )
}

export default EditLocationForm
