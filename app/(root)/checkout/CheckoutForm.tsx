"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { CheckoutSchema } from "@/schemas"
import { useCartStore, useDeliveryStore } from "@/store"
import { getCartTotal } from "@/lib/getCartTotal"
import { cityDeliveryPrices, regions } from "@/constants"
import { DeliveryMethod } from "./DeliveryMethod"
import OrderSummary from "./OrderSummary"

interface ExtendedUser {
  email: string
  name: string
  role: string
}

export function CheckoutForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string>("")
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] =
    useState("next-day-delivery")
  const [selectedPickupOption, setSelectedPickupOption] = useState("")
  const [selectedCity, setSelectedCity] = useState("")

  const session = useSession()
  const router = useRouter()
  const deliveryFee = useDeliveryStore((state) => state.deliveryFee)
  const setDeliveryFee = useDeliveryStore((state) => state.setDeliveryFee)
  const cart = useCartStore((state) => state.cart)
  const basketTotal = getCartTotal(cart)

  const user = session?.data?.user as ExtendedUser

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

  useEffect(() => {
    if (user?.email) {
      form.setValue("email", user.email)
    }
  }, [user?.email, form])

  // Helper function for delivery selection
  const selectedDelivery = useMemo(() => {
    return selectedDeliveryMethod === "schedule-pickup"
      ? selectedPickupOption
      : selectedDeliveryMethod
  }, [selectedDeliveryMethod, selectedPickupOption])

  // Compute and update the delivery fee based on the selected method
  useEffect(() => {
    if (cart.length === 0) {
      return // Skip delivery fee calculation if cart is empty
    }

    let newDeliveryFee = 0 // Default fee for schedule-pickup

    if (
      selectedDeliveryMethod !== "schedule-pickup" &&
      selectedCity &&
      cityDeliveryPrices[selectedCity]
    ) {
      newDeliveryFee = cityDeliveryPrices[selectedCity]
    }

    if (deliveryFee !== newDeliveryFee) {
      setDeliveryFee(newDeliveryFee)
    }
  }, [
    cart.length,
    selectedDeliveryMethod,
    selectedPickupOption,
    selectedCity,
    deliveryFee,
    setDeliveryFee,
  ])

  const handleFormSubmit = async (values: z.infer<typeof CheckoutSchema>) => {
    const formData = {
      ...values,
      deliveryMethod: selectedDelivery,
      deliveryDate: selectedDelivery,
    }
    const query = new URLSearchParams(formData).toString()
    router.push(`/confirm-order?${query}`)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4 p-4 w-full min-h-fit"
      >
        <div className="flex flex-col md:flex-row gap-6 justify-between">
          <div className="w-full">
            <h2 className="font-bold text-lg mb-4">Delivery Information</h2>
            <div className="rounded-lg border p-4 border-neutral-400/35">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your phone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3">
                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Region</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                          }}
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
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                            setSelectedCity(value)
                          }}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                          <SelectContent className="max-h-72 py-1.5 overflow-auto">
                            <SelectGroup>
                              <SelectLabel>City</SelectLabel>
                              {Object.keys(cityDeliveryPrices).map((city) => (
                                <SelectItem key={city} value={city}>
                                  {city}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="mt-4">
              <h2 className="font-bold text-lg mb-4">Schedule Delivery</h2>
              <DeliveryMethod
                setSelectedDeliveryMethod={setSelectedDeliveryMethod}
                selectedDeliveryMethod={selectedDeliveryMethod}
                setSelectedPickupOption={setSelectedPickupOption}
                selectedPickupOption={selectedPickupOption}
              />
            </div>
          </div>
          <div className="w-full lg:max-w-sm md:max-w-xs mt-4 md:mt-0">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>
            <div className="rounded-lg border p-4 border-neutral-400/35">
              <OrderSummary
                selectedPickupOption={selectedPickupOption}
                selectedDeliveryMethod={selectedDeliveryMethod}
                deliveryFee={deliveryFee}
              />
              <Button className="w-full mt-4">Confirm Order</Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
