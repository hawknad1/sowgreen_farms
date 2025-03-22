"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "react-hot-toast"
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
  CheckoutSchema,
  editDeliveryMethod,
  EditProductSchema,
} from "@/schemas"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cityDeliveryPrices, regions } from "@/constants"
import { useEffect, useState } from "react"
import { CitiesWithFees, Order, User } from "@/types"
import { useDeliveryStore } from "@/store"
import { deductBalance } from "@/lib/actions/deductBalance"
import { useSession } from "next-auth/react"

interface ShippingProps {
  order: Order
}

const EditShippingDetails = ({ order }: ShippingProps) => {
  const [isSaving, setIsSaving] = useState(false)
  const [selectedCity, setSelectedCity] = useState("")
  const [filteredCities, setFilteredCities] = useState<CitiesWithFees[]>([])
  const [list, setList] = useState<CitiesWithFees[]>([])
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeUser, setActiveUser] = useState<User>(null)
  const [selectedPickupOption, setSelectedPickupOption] = useState("")
  const [pickupOptions, setPickupOptions] = useState<string[]>([])
  const { data: session } = useSession()
  const user = session?.user

  const deliveryFee = useDeliveryStore((state) => state.deliveryFee)
  const setDeliveryFee = useDeliveryStore((state) => state.setDeliveryFee)

  const orderTotal = order?.total + deliveryFee

  const balance = activeUser?.user?.balance

  const { updatedOrderTotal } = deductBalance(balance, orderTotal)

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

  // Fetch cities data
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
              (city: any) => city.region === order.shippingAddress.region
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

  // Update delivery fee based on selected city and method
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
  }, [
    selectedDeliveryMethod,
    selectedPickupOption,
    selectedCity,
    deliveryFee,
    setDeliveryFee,
  ])

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

  // Initialize form with default values
  const form = useForm<z.infer<typeof CheckoutSchema>>({
    resolver: zodResolver(CheckoutSchema),
    defaultValues: order?.shippingAddress,
  })

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
    const deliveryMethod =
      selectedDeliveryMethod === "schedule-pickup"
        ? selectedPickupOption
        : selectedDeliveryMethod

    setIsSaving(true)
    try {
      const res = await fetch(`/api/orders/${order?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deliveryFee,
          address,
          city,
          region,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.error("Failed to update order:", errorData)
        throw new Error(errorData.message || "Failed to update order")
      }

      const data = await res.json()
      // window.location.reload()
      toast.success("Delivery method updated!")
    } catch (error) {
      console.log("Error updating order:", error)
      toast.error("An unexpected error occurred while updating the order")
    } finally {
      setIsSaving(false)
    }
  }

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

  const onSubmit = (values: z.infer<typeof CheckoutSchema>) =>
    updateShippingAddress(values)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between gap-x-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter address" {...field} />
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
                    setSelectedCity(value)
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

        <Button
          type="submit"
          className="w-full bg-sowgren_Color hover:bg-sowgren_Color/85"
          disabled={isSaving}
        >
          {isSaving ? (
            <span className="loading loading-infinity loading-md"></span>
          ) : (
            "Save changes"
          )}
        </Button>
      </form>
    </Form>
  )
}

export default EditShippingDetails
