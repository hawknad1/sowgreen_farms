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
import { useState } from "react"
import { nextDay } from "@/lib/utils"
import { deliveryMethods } from "@/constants"
import { DeliveryRadioSchema } from "@/schemas"

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
  const form = useForm<z.infer<typeof DeliveryRadioSchema>>({
    resolver: zodResolver(DeliveryRadioSchema),
    defaultValues: {
      deliveryMethod: "next-day-delivery",
    },
  })

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
                  setSelectedDeliveryMethod(value) // Update the parent component's state
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
                          <p className="font-medium text-green-600">
                            {option.tag}
                          </p>
                        )}
                        {option.date && (
                          <p className="font-medium text-green-600">
                            {option.date}
                          </p>
                        )}
                      </FormLabel>
                    </FormItem>

                    {/* Conditionally render the pickup options below "Schedule a pickup" */}
                    {option.value === "schedule-pickup" &&
                      selectedDeliveryMethod === "schedule-pickup" && (
                        <div className="ml-8 mt-3 space-y-3">
                          {/* Render additional radio group for pickup options */}
                          <RadioGroup
                            onValueChange={(pickupValue) => {
                              setSelectedPickupOption(pickupValue)
                            }}
                            value={selectedPickupOption}
                            className="flex flex-col space-y-2"
                          >
                            {option.pickupOptions.map((pickupOption, index) => (
                              <FormItem
                                key={`${pickupOption.label}-${index}`}
                                className={`flex items-center space-x-3 p-2 rounded-lg ${
                                  selectedPickupOption === pickupOption.label
                                    ? "border border-neutral-400"
                                    : "border border-transparent"
                                }`}
                              >
                                <FormControl>
                                  <RadioGroupItem value={pickupOption.label} />
                                </FormControl>
                                <FormLabel className="font-semibold">
                                  {pickupOption.label}
                                </FormLabel>
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
