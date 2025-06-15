"use client"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormItem, FormLabel } from "@/components/ui/form"
import toast from "react-hot-toast"

// Zod schema
export const PickupOptionSchema = z.object({
  pickupOptions: z.array(z.string().nonempty("Location is required")),
})

type FormValues = z.infer<typeof PickupOptionSchema>

export function PickupOptions() {
  const [existingPickupOptions, setExistingPickupOptions] = useState<string[]>(
    []
  )
  const [availablePickupOptions, setAvailablePickupOptions] = useState<
    string[]
  >([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(PickupOptionSchema),
    defaultValues: {
      pickupOptions: [],
    },
  })

  // Fetch existing pickup options
  useEffect(() => {
    const fetchExistingOptions = async () => {
      setIsLoading(true)
      try {
        const res = await fetch("/api/pickup-options", { method: "GET" })
        if (res.ok) {
          const data = await res.json()
          setExistingPickupOptions(
            data.map((item: { location: string }) => item.location)
          )
        }
      } catch (error) {
        console.error("Error fetching existing pickup options:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchExistingOptions()
  }, [])

  // Fetch available pickup locations
  useEffect(() => {
    const fetchPickupOptions = async () => {
      try {
        const res = await fetch("/api/pickup-locations", { method: "GET" })
        if (res.ok) {
          const data = await res.json()
          setAvailablePickupOptions(
            data.map((item: { address: string }) => item.address)
          )
        }
      } catch (error) {
        console.error("Error fetching pickup locations:", error)
      }
    }

    fetchPickupOptions()
  }, [])

  // Update form default values
  useEffect(() => {
    if (existingPickupOptions.length > 0) {
      form.reset({ pickupOptions: existingPickupOptions })
    }
  }, [existingPickupOptions, form])

  // Handle form submission
  async function onSubmit(data: FormValues) {
    console.log("Updated pickup options:", data.pickupOptions)
    setIsSaving(true)
    try {
      const res = await fetch(`/api/pickup-options`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickupOptions: data.pickupOptions }),
      })

      const responseText = await res.text()
      console.log("Response Text:", responseText)

      if (res.ok) {
        toast.success("Pickup Options Updated Successfully")
        window.location.reload()
      } else {
        toast.error("Failed to update pickup options")
        console.error("Failed to submit data:", responseText)
      }
    } catch (error) {
      toast.error("An error occurred while updating pickup options")
      console.error("Error submitting data:", error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full flex justify-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <div className="space-y-2 border border-neutral-300 p-3 rounded-lg h-fit max-h-64 overflow-y-scroll">
          {availablePickupOptions.map((option) => (
            <FormItem
              key={option}
              className="flex flex-row w-full items-start space-x-3 space-y-0 rounded-md border border-neutral-200 p-4"
            >
              <FormControl>
                <Controller
                  control={form.control}
                  name="pickupOptions"
                  render={({ field }) => {
                    const isChecked = field.value.includes(option)
                    const handleCheckboxChange = (checked: boolean) => {
                      field.onChange(
                        checked
                          ? [...field.value, option]
                          : field.value.filter(
                              (item: string) => item !== option
                            )
                      )
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
        </div>
        <Button
          type="submit"
          className="w-full bg-sowgren_Color hover:bg-sowgren_Color/85"
          disabled={isSaving}
        >
          {isSaving ? (
            <span className="loading loading-infinity loading-md"></span>
          ) : (
            "Save"
          )}
        </Button>
      </form>
    </Form>
  )
}
