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
import { toast } from "@/components/ui/use-toast"
import { useState } from "react"
import { PaymentRadioSchema } from "@/schemas"

const PaymentMethods = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")

  const form = useForm<z.infer<typeof PaymentRadioSchema>>({
    resolver: zodResolver(PaymentRadioSchema),
  })

  function onSubmit(data: z.infer<typeof PaymentRadioSchema>) {
    console.log(data)
  }
  console.log(selectedPaymentMethod)
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
                {/* <FormLabel>Notify me about...</FormLabel> */}
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => {
                      field.onChange(value)
                      setSelectedPaymentMethod(value)
                    }}
                    defaultValue={field.value}
                    className="flex items-center justify-between"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="momo-pay" />
                      </FormControl>
                      <FormLabel className="font-semibold">MomoPay</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="credit-debit" />
                      </FormControl>
                      <FormLabel className="font-semibold">
                        Debit or Credit Card
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="cash-on-delivery" />
                      </FormControl>
                      <FormLabel className="font-semibold">
                        Cash on Delivery
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {selectedPaymentMethod && (
            <div className="mt-4 p-4 border border-neutral-300 rounded-lg">
              <p>Selected Payment Method: {selectedPaymentMethod}</p>
              {/* Add additional fields or information based on the selected payment method here */}
            </div>
          )}
          <div className="hidden">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default PaymentMethods
