"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormItem, FormLabel } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { getUpcomingDeliveryDates } from "@/lib/getUpcomingDeliveryDates"
import { formatDeliveryDate } from "@/lib/formateDeliveryDate"

// Updated Zod schema
export const PickupOptionSchema = z.object({
  pickupOptions: z.array(z.string().nonempty("Location is required")),
})

const [wednesday, saturday] = getUpcomingDeliveryDates()

const availablePickupOptions = [
  `DZORWULU `,
  `WEB DuBOIS CENTER`,
  `PARKS & GARDENS`,
]

// const availablePickupOptions = [
//   `DZORWULU - ${formatDeliveryDate(wednesday)} - 11AM-5PM`,
//   `WEB DuBOIS CENTER - ${formatDeliveryDate(saturday)} - 10AM-3PM`,
//   `PARKS & GARDENS - ${formatDeliveryDate(saturday)} - 10AM-3PM`,
// ]

type FormValues = z.infer<typeof PickupOptionSchema>

export function PickupOptions() {
  const router = useRouter()
  const [existingPickupOptions, setExistingPickupOptions] = useState<string[]>(
    []
  )

  // Fetch existing pickup options from the database
  useEffect(() => {
    const fetchExistingOptions = async () => {
      try {
        const res = await fetch("/api/pickup-options")
        if (res.ok) {
          const data = await res.json()
          setExistingPickupOptions(
            data.map((item: { location: string }) => item.location)
          )
        }
      } catch (error) {
        console.error("Error fetching existing pickup options:", error)
      }
    }

    fetchExistingOptions()
  }, [])

  // Initialize the form with the existing pickup options
  const form = useForm<FormValues>({
    resolver: zodResolver(PickupOptionSchema),
    defaultValues: {
      pickupOptions: [],
    },
  })

  // Update form default values after fetching the data
  useEffect(() => {
    if (existingPickupOptions.length > 0) {
      form.reset({
        pickupOptions: existingPickupOptions,
      })
    }
  }, [existingPickupOptions, form])

  // Handle form submission
  async function onSubmit(data: FormValues) {
    console.log("Updated pickup options:", data.pickupOptions)

    try {
      const res = await fetch("/api/pickup-options", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickupOptions: data.pickupOptions }),
      })

      if (res.ok) {
        toast({
          title: "Pickup Options Updated Successfully",
        })
        // router.push("/admin/dashboard")
        window.location.reload()
      } else {
        console.log("Failed to submit data:", await res.json())
      }
    } catch (error) {
      console.error("Error submitting data:", error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
        <FormLabel className="text-lg font-semibold">
          Select Pickup Options
        </FormLabel>
        {availablePickupOptions.map((option) => (
          <FormItem
            key={option}
            className="flex flex-row max-w-[400px] items-start space-x-3 space-y-0 rounded-md border p-4 shadow"
          >
            <FormControl>
              <Controller
                control={form.control}
                name="pickupOptions"
                render={({ field }) => {
                  const isChecked = field.value.includes(option)

                  const handleCheckboxChange = (checked: boolean) => {
                    if (checked) {
                      // Add the selected option to the array
                      field.onChange([...field.value, option])
                    } else {
                      // Remove the unselected option from the array
                      field.onChange(
                        field.value.filter((item: string) => item !== option)
                      )
                    }
                  }

                  return (
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={handleCheckboxChange}
                    />
                  )
                }}
              />
            </FormControl>
            <FormLabel>{option}</FormLabel>
          </FormItem>
        ))}

        <Button type="submit">Save</Button>
      </form>
    </Form>
  )
}
