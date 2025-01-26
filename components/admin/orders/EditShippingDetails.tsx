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
import { CitiesWithFees, Order } from "@/types"
import { useDeliveryStore } from "@/store"

interface ShippingProps {
  order: Order
}

// const EditShippingDetails = ({ order }: ShippingProps) => {
//   const [isSaving, setIsSaving] = useState(false)
//   const [selectedCity, setSelectedCity] = useState("")
//   const [filteredCities, setFilteredCities] = useState([])
//   const [list, setList] = useState<CitiesWithFees[]>([])
//   const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState("")
//   const [selectedPickupOption, setSelectedPickupOption] = useState("")
//   const [pickupOptions, setPickupOptions] = useState<string[]>([])

//   const deliveryFee = useDeliveryStore((state) => state.deliveryFee)
//   const setDeliveryFee = useDeliveryStore((state) => state.setDeliveryFee)

//   useEffect(() => {
//     async function fetchCities() {
//       try {
//         const res = await fetch("/api/cities", {
//           method: "GET",
//           cache: "no-store",
//         })
//         if (res.ok) {
//           const cityList = await res.json()
//           setList(cityList)
//         }
//       } catch (error) {
//         console.error("Error fetching cities:", error)
//       }
//     }
//     fetchCities()
//   }, [])

//   useEffect(() => {
//     let newDeliveryFee = 0 // Default fee for schedule-pickup

//     if (
//       selectedDeliveryMethod !== "schedule-pickup" &&
//       selectedCity &&
//       cityDeliveryPrices[selectedCity]
//     ) {
//       newDeliveryFee = cityDeliveryPrices[selectedCity]
//     }

//     if (deliveryFee !== newDeliveryFee) {
//       setDeliveryFee(newDeliveryFee)
//     }
//   }, [
//     selectedDeliveryMethod,
//     selectedPickupOption,
//     selectedCity,
//     deliveryFee,
//     setDeliveryFee,
//   ])

//   const finalDeliveryMethod =
//     selectedDeliveryMethod === "schedule-pickup"
//       ? selectedPickupOption
//       : selectedDeliveryMethod

//   useEffect(() => {
//     async function fetchPickupOptions() {
//       try {
//         const res = await fetch("/api/pickup-options", {
//           method: "GET",
//           cache: "no-store",
//         })
//         if (res.ok) {
//           const data = await res.json()
//           setPickupOptions(
//             data.map((option: { location: string }) => option.location)
//           )
//         }
//       } catch (error) {
//         console.error("Error fetching pickup options:", error)
//       }
//     }
//     fetchPickupOptions()
//   }, [])

//   const form = useForm<z.infer<typeof CheckoutSchema>>({
//     resolver: zodResolver(CheckoutSchema),
//     defaultValues: order?.shippingAddress,
//   })

//   const updateShippingAddress = async (
//     values: z.infer<typeof editDeliveryMethod>
//   ) => {
//     const address = values.address
//     const city = values.city
//     const region = values.region
//     const deliveryMethod = finalDeliveryMethod
//     console.log(values, "values")
//     try {
//       const res = await fetch(`/api/orders/${order?.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           deliveryFee,
//           address,
//           city,
//           region,
//         }),
//       })

//       if (!res.ok) {
//         const errorData = await res.json()
//         console.error("Failed to update order:", errorData)
//         throw new Error(errorData.message || "Failed to update order")
//       }
//       const data = await res.json()
//       window.location.reload()
//       toast.success("Delivery method updated!")
//     } catch (error) {
//       console.log("Error updating order:", error)
//       toast.error("An unexpected error occurred while updating the order")
//     }
//   }

//   const onSubmit = (values: z.infer<typeof CheckoutSchema>) =>
//     updateShippingAddress(values)

//   // Update filtered cities when the region changes
//   const handleRegionChange = (region: string) => {
//     const filteredCities = list.filter((city) => city.region === region)
//     setFilteredCities(filteredCities)
//     setSelectedCity("") // Reset city when region changes
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         <div className="flex items-center justify-between gap-x-3">
//           <FormField
//             control={form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormLabel>Name</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Name" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="address"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormLabel>Address</FormLabel>
//                 <FormControl>
//                   <Input type="text" placeholder="Enter address" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3">
//           <FormField
//             control={form.control}
//             name="region"
//             render={({ field }) => (
//               <FormItem>
//                 <label className="font-medium">Region</label>
//                 <Select
//                   onValueChange={(value) => {
//                     field.onChange(value)
//                     handleRegionChange(value)
//                   }}
//                   defaultValue={field.value}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select region" />
//                   </SelectTrigger>
//                   <SelectContent className="max-h-72">
//                     <SelectGroup>
//                       <SelectLabel>Region</SelectLabel>
//                       {regions.map((region) => (
//                         <SelectItem key={region.name} value={region.name}>
//                           {region.name}
//                         </SelectItem>
//                       ))}
//                     </SelectGroup>
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="city"
//             render={({ field }) => (
//               <FormItem>
//                 <label className="font-medium">City</label>
//                 <Select
//                   onValueChange={(value) => {
//                     field.onChange(value)
//                     setSelectedCity(value)
//                   }}
//                   defaultValue={field.value}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select city" />
//                   </SelectTrigger>
//                   <SelectContent className="max-h-72">
//                     <SelectGroup>
//                       <SelectLabel>City</SelectLabel>
//                       {filteredCities.map((city) => (
//                         <SelectItem key={city.id} value={city.city}>
//                           {city.city}
//                         </SelectItem>
//                       ))}
//                     </SelectGroup>
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <Button type="submit" className="w-full" disabled={isSaving}>
//           {isSaving ? (
//             <span className="loading loading-infinity loading-md"></span>
//           ) : (
//             "Save changes"
//           )}
//         </Button>
//       </form>
//     </Form>
//   )
// }

// export default EditShippingDetails

const EditShippingDetails = ({ order }: ShippingProps) => {
  const [isSaving, setIsSaving] = useState(false)
  const [selectedCity, setSelectedCity] = useState("")
  const [filteredCities, setFilteredCities] = useState<CitiesWithFees[]>([])
  const [list, setList] = useState<CitiesWithFees[]>([])
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState("")
  const [selectedPickupOption, setSelectedPickupOption] = useState("")
  const [pickupOptions, setPickupOptions] = useState<string[]>([])

  const deliveryFee = useDeliveryStore((state) => state.deliveryFee)
  const setDeliveryFee = useDeliveryStore((state) => state.setDeliveryFee)

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
      window.location.reload()
      toast.success("Delivery method updated!")
    } catch (error) {
      console.log("Error updating order:", error)
      toast.error("An unexpected error occurred while updating the order")
    } finally {
      setIsSaving(false)
    }
  }

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

        <Button type="submit" className="w-full" disabled={isSaving}>
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
