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
import { RadioSchema } from "@/schemas"
import { useState } from "react"
import { nextDay } from "@/lib/utils"

interface DeliveryMethodProps {
  setDeliveryMethod: (method: string) => void
}

export const DeliveryMethod: React.FC<DeliveryMethodProps> = ({
  setDeliveryMethod,
}) => {
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] =
    useState<string>("")

  const form = useForm<z.infer<typeof RadioSchema>>({
    resolver: zodResolver(RadioSchema),
  })

  return (
    <div className="border border-neutral-300 w-full h-fit p-4 rounded-lg">
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormControl>
              <RadioGroup
                onValueChange={(value) => {
                  field.onChange(value)
                  setSelectedDeliveryMethod(value)
                  setDeliveryMethod(value) // Update the parent component's state
                }}
                defaultValue={field.value}
                className="flex flex-col "
              >
                {[
                  {
                    label: "Same Day Delivery",
                    tag: "(Order before 10AM)",
                    price: `GHC ${20}`,
                    value: "same-day-delivery",
                  },
                  {
                    label: "Next Day Delivery",
                    date: nextDay,
                    price: `GHC ${20}`,
                    value: "next-day-delivery",
                  },

                  {
                    label: "Schedule a pickup",
                    price: `GHC ${20}`,
                    value: "schedule-pickup",
                  },
                ].map((option) => (
                  <FormItem
                    key={option.value}
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
