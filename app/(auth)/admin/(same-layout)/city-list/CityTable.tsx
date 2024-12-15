"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { AddCityandFeeSchema } from "@/schemas"
import { regions } from "@/constants"

const CityTable = () => {
  const [cities, setCities] = useState<
    { city: string; deliveryFee: number; region: string }[]
  >([])
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<z.infer<typeof AddCityandFeeSchema>>({
    resolver: zodResolver(AddCityandFeeSchema),
    defaultValues: {
      city: "",
      deliveryFee: 0,
      region: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof AddCityandFeeSchema>) => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const { error } = await response.json()

        return
      }

      const newCity = await response.json()
      setCities((prev) => [...prev, newCity])

      form.reset()
      window.location.reload()
    } catch (error) {
      console.error("Error adding city:", error)
    } finally {
      setIsSaving(false)
    }
  }

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
            "Add City"
          )}
        </Button>
      </form>
    </Form>
  )
}

export default CityTable
