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
import { tomorrow } from "@/lib/utils"

export const DeliveryMethod = () => {
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState("")

  const form = useForm<z.infer<typeof RadioSchema>>({
    resolver: zodResolver(RadioSchema),
  })

  function onSubmit(data: z.infer<typeof RadioSchema>) {
    console.log(data)
  }

  return (
    <div className="border border-neutral-300 w-full h-fit p-4 rounded-lg">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
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
                        date: tomorrow,
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
                            <p className="font-normal text-neutral-600">
                              {option.tag}
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
        </form>
      </Form>
    </div>
  )
}
