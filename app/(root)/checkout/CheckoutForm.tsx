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
import { useCartStore, useCheckoutStore, useDeliveryStore } from "@/store"
import { cityDeliveryPrices, regions } from "@/constants"
import { DeliveryMethod } from "./DeliveryMethod"
import OrderSummary from "./OrderSummary"
import { CitiesWithFees } from "@/types"

interface ExtendedUser {
  email: string
  name: string
  role: string
}

export function CheckoutForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string>("")
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState("")
  const [selectedPickupOption, setSelectedPickupOption] = useState("")
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("")
  const [filteredCities, setFilteredCities] = useState<CitiesWithFees[]>([])
  const [list, setList] = useState<CitiesWithFees[]>([])

  const session = useSession()
  const router = useRouter()
  const deliveryFee = useDeliveryStore((state) => state.deliveryFee)
  const setDeliveryFee = useDeliveryStore((state) => state.setDeliveryFee)
  const cart = useCartStore((state) => state.cart)
  const { formValues, setFormValues } = useCheckoutStore()

  const user = session?.data?.user as ExtendedUser

  // Fetch cities data and restore form data
  useEffect(() => {
    async function getCityList() {
      try {
        const res = await fetch("/api/cities", {
          method: "GET",
          cache: "no-store",
        })

        if (res.ok) {
          const cityList = await res.json()
          setList(cityList)

          // Restore form data from Zustand store
          if (formValues.region) {
            const filtered = cityList.filter(
              (city: any) => city.region === formValues.region
            )
            setFilteredCities(filtered)
            setSelectedRegion(formValues.region)
            if (formValues.city) {
              setSelectedCity(formValues.city)
            }
          }
        }
      } catch (error) {
        console.log(error)
      }
    }

    getCityList()
  }, [formValues])

  // Initialize form with default values from Zustand store
  const form = useForm<z.infer<typeof CheckoutSchema>>({
    resolver: zodResolver(CheckoutSchema),
    defaultValues: { ...formValues, deliveryMethod: "" },
  })

  // Set email if user is logged in
  useEffect(() => {
    if (user?.email) {
      form.setValue("email", user.email)
      setFormValues({ email: user.email })
    }
  }, [user?.email, form, setFormValues])

  // Save form data to Zustand store on change
  const saveToStore = () => {
    const formData = form.getValues()
    setFormValues({
      ...formData,
      city: selectedCity,
      region: selectedRegion,
    })
  }

  // Compute selected delivery method
  const selectedDelivery = useMemo(() => {
    return selectedDeliveryMethod === "schedule-pickup"
      ? selectedPickupOption
      : selectedDeliveryMethod
  }, [selectedDeliveryMethod, selectedPickupOption])

  // Update delivery fee based on selected city and method
  useEffect(() => {
    if (cart.length === 0) return // Skip if cart is empty

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

  // Handle form submission
  // const handleFormSubmit = async (values: z.infer<typeof CheckoutSchema>) => {
  //   const formData = {
  //     ...values,
  //     deliveryMethod: selectedDelivery,
  //     deliveryDate: selectedDeliveryDate,
  //   }
  //   const query = new URLSearchParams(formData).toString()
  //   router.push(`/confirm-order?${query}`)
  // }

  const handleFormSubmit = async (values: z.infer<typeof CheckoutSchema>) => {
    // Validate pickup option if "Schedule Pickup" is selected
    if (selectedDeliveryMethod === "schedule-pickup" && !selectedPickupOption) {
      form.setError("deliveryMethod", {
        type: "manual",
        message: "Please select a pickup option.",
      })
      return // Stop submission if validation fails
    }

    // Include delivery method and pickup option in the form data
    const formData = {
      ...values,
      deliveryMethod: selectedDelivery,
      // pickupOption: selectedPickupOption, // Add pickup option
      deliveryDate: selectedDeliveryDate,
    }

    // Log the form data for debugging
    console.log("Form Data:", formData)

    // Construct the query string
    const query = new URLSearchParams(formData).toString()

    // Log the query string for debugging
    console.log("Query String:", query)

    // Navigate to the next page
    router.push(`/confirm-order?${query}`)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        onChange={saveToStore}
        className="space-y-4 w-full min-h-fit "
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
                            setSelectedRegion(value)
                            const filtered = list.filter(
                              (city) => city.region === value
                            )
                            setFilteredCities(filtered)
                            form.setValue("city", "")
                            setSelectedCity("")
                          }}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                          <SelectContent>
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
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>City</SelectLabel>
                              {filteredCities.map((city) => (
                                <SelectItem key={city.id} value={city.city}>
                                  {city.city}
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
                form={form}
                setSelectedDeliveryMethod={setSelectedDeliveryMethod}
                selectedDeliveryMethod={selectedDeliveryMethod}
                setSelectedPickupOption={setSelectedPickupOption}
                selectedPickupOption={selectedPickupOption}
                setSelectedDeliveryDate={setSelectedDeliveryDate}
                selectedDeliveryDate={selectedDeliveryDate}
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
