import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import { cityDeliveryPrices, deliveryMethods, regions } from "@/constants"
import { deductBalance } from "@/lib/actions/deductBalance"
import { generateUpdatedDeliveryMethod } from "@/lib/actions/whatsAppMessages/generateUpdatedDeliveryMethod"
import { formatDeliveryDate } from "@/lib/formateDeliveryDate"
import { getUpcomingDeliveryDates } from "@/lib/getUpcomingDeliveryDates"
import {
  CheckoutSchema,
  DeliveryMethodSchema,
  editDeliveryMethod,
} from "@/schemas"
import { useDeliveryStore } from "@/store"
import { CitiesWithFees, Order, User } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import React, { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

interface Props {
  order: Order
}

const ChangeDeliveryMethodForm = ({ order }: Props) => {
  const [selectedCity, setSelectedCity] = useState("")
  const [filteredCities, setFilteredCities] = useState<CitiesWithFees[]>([])
  const [list, setList] = useState<CitiesWithFees[]>([])
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(
    order?.shippingAddress?.deliveryMethod || ""
  )
  const [selectedPickupOption, setSelectedPickupOption] = useState("")
  const [pickupOptions, setPickupOptions] = useState<string[]>([])
  const [wednesday, saturday] = getUpcomingDeliveryDates()
  const [activeUser, setActiveUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [deliveryDate, setDeliveryDate] = useState(order?.deliveryDate)

  const deliveryFee = useDeliveryStore((state) => state.deliveryFee)
  const setDeliveryFee = useDeliveryStore((state) => state.setDeliveryFee)
  const { data: session } = useSession()
  const user = session?.user

  const form = useForm<z.infer<typeof DeliveryMethodSchema>>({
    resolver: zodResolver(DeliveryMethodSchema),
    defaultValues: {
      address: order?.shippingAddress?.address || "",
      city: order?.shippingAddress?.city || "",
      region: order?.shippingAddress?.region || "",
      deliveryMethod: order?.shippingAddress?.deliveryMethod || "",
      pickupOption: "",
    },
  })

  const orderTotal = order?.total + deliveryFee

  const balance = activeUser?.user?.balance
  const { updatedOrderTotal } = deductBalance(balance, orderTotal)

  // Watch the `city` field and update `selectedCity` state
  const cityValue = form.watch("city")
  useEffect(() => {
    if (cityValue) {
      setSelectedCity(cityValue)
    }
  }, [cityValue])

  // Fetch cities on mount
  useEffect(() => {
    async function fetchCities() {
      try {
        const res = await fetch("/api/cities", {
          method: "GET",
          cache: "no-store",
        })
        if (res.ok) {
          const cityList = await res.json()
          setList(cityList)

          // Filter cities based on the default region from the order
          if (order?.shippingAddress?.region) {
            const filtered = cityList.filter(
              (city: CitiesWithFees) =>
                city.region === order.shippingAddress.region
            )
            setFilteredCities(filtered)
          }
        }
      } catch (error) {
        console.error("Error fetching cities:", error)
      }
    }
    fetchCities()
  }, [order?.shippingAddress?.region])

  // Recalculate delivery fee when city or delivery method changes
  useEffect(() => {
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
  }, [selectedCity, selectedDeliveryMethod, deliveryFee, setDeliveryFee])

  // Fetch pickup options
  useEffect(() => {
    async function fetchPickupOptions() {
      try {
        const res = await fetch("/api/pickup-options", {
          method: "GET",
          cache: "no-store",
        })
        if (res.ok) {
          const data = await res.json()
          setPickupOptions(
            data.map((option: { location: string }) => option.location)
          )
        }
      } catch (error) {
        console.error("Error fetching pickup options:", error)
      }
    }
    fetchPickupOptions()
  }, [])

  // Update filtered cities when the region changes
  const handleRegionChange = (region: string) => {
    const filtered = list.filter((city) => city.region === region)
    setFilteredCities(filtered)
    setSelectedCity("") // Reset city when region changes
  }

  // Handle form submission
  const updateShippingAddress = async (
    values: z.infer<typeof editDeliveryMethod>
  ) => {
    const address = values.address
    const city = values.city
    const region = values.region

    // Determine the delivery method
    const deliveryMethod =
      selectedDeliveryMethod === "existing-delivery"
        ? order.shippingAddress.deliveryMethod // Use the existing delivery method
        : selectedDeliveryMethod === "schedule-pickup"
        ? selectedPickupOption
        : selectedDeliveryMethod.split("-")[0]

    // Determine the delivery date
    const existingDeliveryDate =
      selectedDeliveryMethod === "existing-delivery"
        ? order.deliveryDate // Use the existing delivery date
        : deliveryDate

    setIsSaving(true)
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deliveryFee,
          address,
          city,
          region,
          deliveryMethod,
          deliveryDate,
          updatedOrderTotal,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.error("Failed to update order:", errorData)
        throw new Error(errorData.message || "Failed to update order")
      }

      const data = await res.json()
      window.location.reload()
      toast.success("Delivery method updated!")
    } catch (error) {
      console.log("Error updating order:", error)
      toast.error("An unexpected error occurred while updating the order")
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    const getUser = async () => {
      if (!user?.email) return
      setIsLoading(true)
      try {
        const res = await fetch(`/api/user/${user.email}`, {
          method: "GET",
          cache: "no-store",
        })
        if (res.ok) {
          const active = await res.json()
          setActiveUser(active)
          // setUser(active)
        } else {
          console.error("Failed to fetch user details:", res.statusText)
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error)
      } finally {
        setIsLoading(false)
      }
    }
    getUser()
  }, [user?.email])

  useEffect(() => {
    async function updateOrderTotal() {
      try {
        const res = await fetch(`/api/orders/${order?.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            updatedOrderTotal,
          }),
        })

        if (!res.ok) throw new Error(res.statusText)
      } catch (error) {
        console.log(error)
      }
    }
    updateOrderTotal()
  }, [deliveryFee])

  const onSubmit = (values: z.infer<typeof DeliveryMethodSchema>) =>
    updateShippingAddress(values)

  // Create a unique identifier for the current delivery method
  const currentDeliveryMethod = `${order?.shippingAddress?.deliveryMethod}-${order?.deliveryDate}`

  // Check if the current delivery method exists in the `deliveryMethods` list
  const isCurrentMethodInList = deliveryMethods.some(
    (method) => `${method.value}-${method.date}` === currentDeliveryMethod
  )

  const listDate = order?.deliveryDate
  const listDeliveryDates = deliveryMethods.map((date) => date.date)
  const isDateIncluded = listDeliveryDates.includes(listDate)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6 ">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3.5 lg:gap-y-6">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <label className="font-medium">Address</label>
                  <FormControl>
                    <Input placeholder="Enter address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <label className="font-medium">Region</label>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      handleRegionChange(value)
                    }}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      <SelectGroup>
                        <SelectLabel>Region</SelectLabel>
                        {regions.map((region) => (
                          <SelectItem key={region.name} value={region.name}>
                            {region.name}
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
                  <label className="font-medium">City</label>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      setSelectedCity(value) // Update selected city
                    }}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
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

          {/* Delivery Method Section */}
          <FormField
            control={form.control}
            name="deliveryMethod"
            render={({ field }) => (
              <FormItem>
                <div className="space-y-4">
                  {/* Render "Current Delivery Method" only if it's not in the list */}
                  {!isDateIncluded && (
                    <div className="space-y-2">
                      <label className="font-medium">
                        Current Delivery Method
                      </label>
                      <div
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedDeliveryMethod === "existing-delivery"
                            ? "border-green-500 bg-green-50" // Highlight when selected
                            : "border-gray-300 hover:border-green-300" // Default style
                        }`}
                        onClick={() => {
                          setSelectedDeliveryMethod("existing-delivery")
                          setDeliveryDate(order.deliveryDate || "")
                        }}
                      >
                        <span className="font-semibold">
                          {order.shippingAddress.deliveryMethod}
                        </span>
                        {order.deliveryDate && (
                          <span className="text-sm text-gray-500">
                            {" "}
                            - {order.deliveryDate}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Other Delivery Methods */}
                  <label className="font-medium">
                    Choose a New Delivery Method
                  </label>
                  <div className="space-y-2">
                    {deliveryMethods.map((method) => {
                      const methodIdentifier = `${method.value}-${method.date}`
                      const isCurrentMethod =
                        methodIdentifier === currentDeliveryMethod

                      return (
                        <div key={method.value}>
                          <div
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              isCurrentMethod
                                ? "border-green-500 bg-green-50" // Highlight the current method
                                : selectedDeliveryMethod === method.value
                                ? "border-green-500 bg-green-50" // Highlight the selected method
                                : "border-gray-300 hover:border-green-300" // Default style
                            }`}
                            onClick={() => {
                              setSelectedDeliveryMethod(method.value)
                              setDeliveryDate(method.date || "")
                              if (method.value !== "schedule-pickup") {
                                setSelectedPickupOption("") // Reset pickup option
                              }
                            }}
                          >
                            <span className="font-semibold">
                              {method.label}
                            </span>
                            {method.date && (
                              <span className="text-sm text-gray-500">
                                {" "}
                                - {method.date}
                              </span>
                            )}
                          </div>

                          {/* Render additional fields for specific delivery methods */}
                          {selectedDeliveryMethod === method.value &&
                            method.value === "schedule-pickup" && (
                              <div className="mt-3 space-y-2 pl-4">
                                <label className="font-medium">
                                  Pickup Options
                                </label>
                                {pickupOptions.map((option, index) => {
                                  // Normalize the fetched option for comparison
                                  const normalizedOption = option
                                    .trim()
                                    .toUpperCase()

                                  const date =
                                    normalizedOption === "DZORWULU"
                                      ? formatDeliveryDate(wednesday)
                                      : pickupOptions.some(
                                          (loc) =>
                                            loc.toUpperCase() ===
                                            normalizedOption
                                        )
                                      ? formatDeliveryDate(saturday)
                                      : null

                                  return (
                                    <div
                                      key={index}
                                      className="flex items-center space-x-3 cursor-pointer"
                                    >
                                      <input
                                        type="radio"
                                        name="pickupOption"
                                        value={option}
                                        checked={
                                          selectedPickupOption === option
                                        }
                                        onChange={() => {
                                          setSelectedPickupOption(option)
                                          setDeliveryDate(date || "")
                                        }}
                                      />
                                      <span>{`${option} - ${date}`}</span>
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSaving}>
            {isSaving ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              "Update delivery method"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ChangeDeliveryMethodForm
