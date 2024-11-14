"use client"

import { Button } from "@/components/ui/button"
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
import { z } from "zod"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useEffect, useState } from "react"
import { deliveryMethods } from "@/constants"
import { DeliveryRadioSchema } from "@/schemas"

// Define types for props
interface DeliveryMethodProps {
  setSelectedDeliveryMethod: (method: string) => void
  selectedDeliveryMethod: string
  selectedPickupOption: string
  setSelectedPickupOption: (method: string) => void
}

export const DeliveryMethod: React.FC<DeliveryMethodProps> = ({
  setSelectedDeliveryMethod,
  selectedDeliveryMethod,
  selectedPickupOption,
  setSelectedPickupOption,
}) => {
  const [pickupOptions, setPickupOptions] = useState<string[]>([])

  // React Hook Form setup
  const form = useForm<z.infer<typeof DeliveryRadioSchema>>({
    resolver: zodResolver(DeliveryRadioSchema),
    defaultValues: {
      deliveryMethod: "next-day-delivery",
    },
  })

  // Fetch available pickup options
  useEffect(() => {
    async function getPickupOptions() {
      try {
        const res = await fetch("/api/pickup-options", {
          method: "GET",
          cache: "no-store",
        })
        if (res.ok) {
          const data = await res.json()
          setPickupOptions(
            data.map(
              (option: { id: string; location: string }) => option.location
            )
          )
        }
      } catch (error) {
        console.log("Error fetching pickup options:", error)
      }
    }
    getPickupOptions()
  }, [])

  return (
    <div className="border border-neutral-300 w-full h-fit p-4 rounded-lg">
      <FormField
        control={form.control}
        name="deliveryMethod"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormControl>
              <RadioGroup
                onValueChange={(value) => {
                  field.onChange(value)
                  setSelectedDeliveryMethod(value)
                }}
                defaultValue={field.value}
                className="flex flex-col"
              >
                {deliveryMethods.map((option) => (
                  <div key={option.label}>
                    <FormItem
                      className={`flex items-center space-x-3 space-y-0 p-3 rounded-lg ${
                        selectedDeliveryMethod === option.value
                          ? "border border-neutral-400"
                          : "border border-transparent"
                      }`}
                    >
                      <FormControl>
                        <RadioGroupItem value={option.value} />
                      </FormControl>
                      <FormLabel className="font-semibold flex items-center gap-x-2">
                        {option.label}
                        {option.tag && (
                          <span className="font-medium text-green-600">
                            {option.tag}
                          </span>
                        )}
                        {option.date && (
                          <span className="font-medium text-green-600">
                            {option.date}
                          </span>
                        )}
                      </FormLabel>
                    </FormItem>

                    {/* Conditionally render the pickup options if 'Schedule Pickup' is selected */}
                    {option.value === "schedule-pickup" &&
                      selectedDeliveryMethod === "schedule-pickup" && (
                        <div className="ml-8 mt-3 space-y-3">
                          <p className="font-semibold">Pickup Options:</p>
                          <RadioGroup
                            onValueChange={(pickupValue) => {
                              setSelectedPickupOption(pickupValue)
                            }}
                            value={selectedPickupOption}
                            className="flex flex-col space-y-2"
                          >
                            {pickupOptions.map((pickupOption, index) => (
                              <FormItem
                                key={`${pickupOption}-${index}`}
                                className={`flex items-center space-x-3 p-2 rounded-lg ${
                                  selectedPickupOption === pickupOption
                                    ? "border border-neutral-400"
                                    : "border border-transparent"
                                }`}
                              >
                                <FormControl>
                                  <RadioGroupItem value={pickupOption} />
                                </FormControl>
                                <FormLabel>{pickupOption}</FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </div>
                      )}
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
