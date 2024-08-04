"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { PaystackButton } from "react-paystack"

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
import { Input } from "@/components/ui/input"
import { CheckoutSchema } from "@/schemas"
import { useEffect, useState } from "react"
import { useCartStore } from "@/store"
import { getCartTotal } from "@/lib/getCartTotal"
import OrderSummary from "./OrderSummary"
import { useRouter } from "next/navigation"

const config = {
  reference: new Date().getTime().toString(),
  email: "dankwahthomas@yahoo.com",
  amount: 10.0,
  publicKey: "pk_test_4999951f032c0b318c0206a4cfba8b93593997b0",
}

export function CheckoutForm() {
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState("")

  const router = useRouter()

  const cart = useCartStore((state) => state.cart)
  const basketTotal = getCartTotal(cart)
  // const amountNum = Number(basketTotal)
  // const amount = Math.round(amountNum)

  const form = useForm<z.infer<typeof CheckoutSchema>>({
    resolver: zodResolver(CheckoutSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      city: "",
      country: "",
      phone: "",
      region: "",
    },
  })

  async function onSubmit(values: z.infer<typeof CheckoutSchema>) {
    const query = new URLSearchParams(values).toString()
    router.push(`/confirm-order?${query}`)
  }
  // ...

  const handlePaystackSuccessAction = (reference: any) => {
    // Implementation for whatever you want to do with reference and after success call.
    console.log(reference)
  }

  // you can call this function anything
  const handlePaystackCloseAction = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    console.log("closed")
  }

  const componentProps = {
    ...config,
    text: "Pay Now",
    onSuccess: (reference: any) => handlePaystackSuccessAction(reference),
    onClose: handlePaystackCloseAction,
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 p-4 w-full  min-h-fit"
      >
        <div className="flex flex-col md:flex-row gap-6 justify-between">
          <div className="w-full ">
            <h2 className="font-bold text-lg mb-4">Delivery Information</h2>
            <div className="rounded-lg border p-4 border-neutral-400/35">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col md:flex-row gap-x-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter your name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Enter your phone"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-x-3">
                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Region</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter region"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter city"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="mt-4">
              <h2 className="font-bold text-lg mb-4">Schedule Delivery</h2>
            </div>
          </div>

          <div className="w-full lg:max-w-sm md:max-w-xs mt-4 md:mt-0 ">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>

            <div className="rounded-lg border p-4 border-neutral-400/35">
              <OrderSummary />

              <Button type="submit" className="w-full">
                Confirm Order
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
