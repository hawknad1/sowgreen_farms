// import { Button } from "@/components/ui/button"
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { cityDeliveryPrices, deliveryMethods, regions } from "@/constants"
// import { formatDeliveryDate } from "@/lib/formateDeliveryDate"
// import { getUpcomingDeliveryDates } from "@/lib/getUpcomingDeliveryDates"
// import { editDeliveryMethod } from "@/schemas"
// import { useDeliveryStore } from "@/store"
// import { CitiesWithFees, Order } from "@/types"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { FormLabel } from "@mui/material"
// import React, { useEffect, useMemo, useState } from "react"
// import { useForm } from "react-hook-form"
// import { z } from "zod"

// interface Props {
//   order: Order
// }

// const ChangeDeliveryMethodForm = ({ order }: Props) => {
//   const [selectedCity, setSelectedCity] = useState("")
//   const [filteredCities, setFilteredCities] = useState([])
//   const [list, setList] = useState<CitiesWithFees[]>([])
//   const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState("")
//   const [selectedPickupOption, setSelectedPickupOption] = useState("")
//   const [selectedDeliveryDate, setSelectedDeliveryDate] = useState("")
//   const deliveryFee = useDeliveryStore((state) => state.deliveryFee)
//   const setDeliveryFee = useDeliveryStore((state) => state.setDeliveryFee)
//   const [pickupOptions, setPickupOptions] = useState<string[]>([])
//   const [wednesday, saturday] = getUpcomingDeliveryDates()

//   useEffect(() => {
//     async function getCityList() {
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
//         console.log(error)
//       }
//     }
//     getCityList()
//   }, [])

//   // Helper function for delivery selection
//   const selectedDelivery = useMemo(() => {
//     return selectedDeliveryMethod === "schedule-pickup"
//       ? selectedPickupOption
//       : selectedDeliveryMethod
//   }, [selectedDeliveryMethod, selectedPickupOption])

//   // Compute and update the delivery fee based on the selected method
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

//   useEffect(() => {
//     async function getPickupOptions() {
//       try {
//         const res = await fetch("/api/pickup-options", {
//           method: "GET",
//           cache: "no-store",
//         })
//         if (res.ok) {
//           const data = await res.json()
//           setPickupOptions(
//             data.map(
//               (option: { id: string; location: string }) => option.location
//             )
//           )
//         }
//       } catch (error) {
//         console.log("Error fetching pickup options:", error)
//       }
//     }
//     getPickupOptions()
//   }, [])

//   const form = useForm<z.infer<typeof editDeliveryMethod>>({
//     resolver: zodResolver(editDeliveryMethod),
//     defaultValues: order,
//   })

//   const handleFormSubmit = async (
//     values: z.infer<typeof editDeliveryMethod>
//   ) => {
//     console.log(values, "values----edit")
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(handleFormSubmit)}>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3">
//           <FormField
//             control={form.control}
//             name="address"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Address</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Enter address" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="region"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Region</FormLabel>
//                 <Select
//                   onValueChange={(value) => {
//                     field.onChange(value)
//                     // Filter cities for the selected region
//                     const filteredCities = list.filter(
//                       (city) => city.region === value
//                     )
//                     setFilteredCities(filteredCities) // Update the cities state
//                   }}
//                   defaultValue={field.value}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select region" />
//                   </SelectTrigger>
//                   <SelectContent className="max-h-72 py-1.5 overflow-auto">
//                     <SelectGroup>
//                       <SelectLabel>Region</SelectLabel>
//                       {regions.map((reg) => (
//                         <SelectItem key={reg.name} value={reg.name}>
//                           {reg.name}
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
//                 <FormLabel>City</FormLabel>
//                 <Select
//                   onValueChange={(value) => {
//                     field.onChange(value)
//                     setSelectedCity(value) // Set the selected city
//                   }}
//                   defaultValue={field.value}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select city" />
//                   </SelectTrigger>
//                   <SelectContent className="max-h-72 py-1.5 overflow-auto">
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
//           <Button type="submit">Submit</Button>
//         </div>
//         <div>
//           <FormField
//             // control={form}
//             name="deliveryMethod"
//             render={({ field }) => (
//               <FormItem className="space-y-3">
//                 <FormControl>
//                   <RadioGroup
//                     onValueChange={(value) => {
//                       field.onChange(value)
//                       setSelectedDeliveryMethod(value)
//                     }}
//                     defaultValue={field.value}
//                     className="flex flex-col"
//                   >
//                     {deliveryMethods.map((option) => (
//                       <div key={option.value}>
//                         <FormItem
//                           className={`flex items-center space-x-3 space-y-0 p-3 rounded-lg ${
//                             selectedDeliveryMethod === option.value
//                               ? "border border-neutral-400"
//                               : "border border-transparent"
//                           }`}
//                         >
//                           <FormControl>
//                             <RadioGroupItem
//                               value={option.value}
//                               onClick={() =>
//                                 setSelectedDeliveryDate(option.date)
//                               }
//                             />
//                           </FormControl>
//                           <FormLabel className="font-semibold flex items-center gap-x-2">
//                             {option.label}
//                             {option.tag && (
//                               <span className="font-medium text-green-600">
//                                 {option.tag}
//                               </span>
//                             )}
//                             {option.date && (
//                               <span className="font-medium text-green-600">
//                                 - {option.date}
//                               </span>
//                             )}
//                           </FormLabel>
//                         </FormItem>

//                         {/* Conditionally render the pickup options if 'Schedule Pickup' is selected */}
//                         {option.value === "schedule-pickup" &&
//                           selectedDeliveryMethod === "schedule-pickup" && (
//                             <div className="ml-8 mt-3 space-y-3">
//                               <p className="font-semibold">Pickup Options:</p>
//                               <RadioGroup
//                                 onValueChange={(pickupValue) => {
//                                   setSelectedPickupOption(pickupValue)
//                                 }}
//                                 value={selectedPickupOption}
//                                 className="flex flex-col space-y-2"
//                               >
//                                 {pickupOptions.map((pickupOption, index) => {
//                                   // Normalize the fetched option for comparison
//                                   const normalizedOption = pickupOption
//                                     .trim()
//                                     .toUpperCase()

//                                   // Determine the date based on pickup location
//                                   const date =
//                                     normalizedOption === "DZORWULU"
//                                       ? formatDeliveryDate(wednesday)
//                                       : [
//                                           "WEB DuBOIS CENTER",
//                                           "PARKS & GARDENS",
//                                         ].some(
//                                           (loc) =>
//                                             loc.toUpperCase() ===
//                                             normalizedOption
//                                         )
//                                       ? formatDeliveryDate(saturday)
//                                       : null

//                                   return (
//                                     <FormItem
//                                       key={`${pickupOption}-${index}`}
//                                       className={`flex items-center space-x-3 p-2 rounded-lg ${
//                                         selectedPickupOption === pickupOption
//                                           ? "border border-neutral-400"
//                                           : "border border-transparent"
//                                       }`}
//                                     >
//                                       <FormControl>
//                                         <RadioGroupItem value={pickupOption} />
//                                       </FormControl>
//                                       <FormLabel className="flex flex-col">
//                                         <span>{pickupOption}</span>
//                                         {date && (
//                                           <span className="text-gray-500 text-sm">
//                                             {`${date} - 11AM - 5PM`}
//                                           </span>
//                                         )}
//                                       </FormLabel>
//                                     </FormItem>
//                                   )
//                                 })}
//                               </RadioGroup>
//                             </div>
//                           )}
//                       </div>
//                     ))}
//                   </RadioGroup>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//       </form>
//     </Form>
//   )
// }

// export default ChangeDeliveryMethodForm

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
import { generateUpdatedDeliveryMethod } from "@/lib/actions/whatsAppMessages/generateUpdatedDeliveryMethod"
import { formatDeliveryDate } from "@/lib/formateDeliveryDate"
import { getUpcomingDeliveryDates } from "@/lib/getUpcomingDeliveryDates"
import { CheckoutSchema, editDeliveryMethod } from "@/schemas"
import { useDeliveryStore } from "@/store"
import { CitiesWithFees, Order } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

interface Props {
  order: Order
}

// const ChangeDeliveryMethodForm = ({ order }: Props) => {
//   const [selectedCity, setSelectedCity] = useState("")
//   const [filteredCities, setFilteredCities] = useState<CitiesWithFees[]>([])
//   const [list, setList] = useState<CitiesWithFees[]>([])
//   const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState("")
//   const [selectedPickupOption, setSelectedPickupOption] = useState("")
//   const [pickupOptions, setPickupOptions] = useState<string[]>([])
//   const [wednesday, saturday] = getUpcomingDeliveryDates()
//   const [isUpdating, setIsUpdating] = useState(false)
//   const [isSaving, setIsSaving] = useState(false)
//   const [deliveryDate, setDeliveryDate] = useState("")

//   const deliveryFee = useDeliveryStore((state) => state.deliveryFee)
//   const setDeliveryFee = useDeliveryStore((state) => state.setDeliveryFee)

//   // Fetch cities on mount
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

//           // Filter cities based on the default region from the order
//           if (order?.shippingAddress?.region) {
//             const filtered = cityList.filter(
//               (city: CitiesWithFees) =>
//                 city.region === order.shippingAddress.region
//             )
//             setFilteredCities(filtered)
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching cities:", error)
//       }
//     }
//     fetchCities()
//   }, [order?.shippingAddress?.region])

//   // Recalculate delivery fee when city or delivery method changes
//   // useEffect(() => {
//   //   let newDeliveryFee = 0 // Default fee for schedule-pickup

//   //   if (
//   //     selectedDeliveryMethod !== "schedule-pickup" &&
//   //     selectedCity &&
//   //     cityDeliveryPrices[selectedCity]
//   //   ) {
//   //     newDeliveryFee = cityDeliveryPrices[selectedCity]
//   //   }

//   //   if (deliveryFee !== newDeliveryFee) {
//   //     setDeliveryFee(newDeliveryFee)
//   //   }
//   // }, [selectedCity, selectedDeliveryMethod, deliveryFee, setDeliveryFee])

//   useEffect(() => {
//     console.log("Recalculating delivery fee...")
//     console.log("Selected City:", selectedCity)
//     console.log("Selected Delivery Method:", selectedDeliveryMethod)
//     console.log("City Delivery Prices:", cityDeliveryPrices)

//     let newDeliveryFee = 0 // Default fee for schedule-pickup

//     if (
//       selectedDeliveryMethod !== "schedule-pickup" &&
//       selectedCity &&
//       cityDeliveryPrices[selectedCity]
//     ) {
//       newDeliveryFee = cityDeliveryPrices[selectedCity]
//     }

//     console.log("New Delivery Fee:", newDeliveryFee)

//     if (deliveryFee !== newDeliveryFee) {
//       setDeliveryFee(newDeliveryFee)
//     }
//   }, [selectedCity, selectedDeliveryMethod, deliveryFee, setDeliveryFee])

//   // Fetch pickup options
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

//   // Initialize form with default values
//   const form = useForm<z.infer<typeof CheckoutSchema>>({
//     resolver: zodResolver(CheckoutSchema),
//     defaultValues: order?.shippingAddress,
//   })

//   // Update filtered cities when the region changes
//   const handleRegionChange = (region: string) => {
//     const filtered = list.filter((city) => city.region === region)
//     setFilteredCities(filtered)
//     setSelectedCity("") // Reset city when region changes
//   }

//   // Handle form submission
//   const updateShippingAddress = async (
//     values: z.infer<typeof editDeliveryMethod>
//   ) => {
//     const address = values.address
//     const city = values.city
//     const region = values.region
//     const deliveryMethod =
//       selectedDeliveryMethod === "schedule-pickup"
//         ? selectedPickupOption
//         : selectedDeliveryMethod.split("-")[0]

//     setIsSaving(true)
//     try {
//       const res = await fetch(`/api/orders/${order?.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           deliveryFee,
//           address,
//           city,
//           region,
//           deliveryMethod,
//           deliveryDate,
//         }),
//       })

//       if (!res.ok) {
//         const errorData = await res.json()
//         console.error("Failed to update order:", errorData)
//         throw new Error(errorData.message || "Failed to update order")
//       }

//       const data = await res.json()
//       // window.location.reload()
//       toast.success("Delivery method updated!")
//     } catch (error) {
//       console.log("Error updating order:", error)
//       toast.error("An unexpected error occurred while updating the order")
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   const onSubmit = (values: z.infer<typeof CheckoutSchema>) =>
//     updateShippingAddress(values)

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)}>
//         <div className="space-y-6 ">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3.5 lg:gap-y-6">
//             <FormField
//               control={form.control}
//               name="address"
//               render={({ field }) => (
//                 <FormItem>
//                   <label className="font-medium">Address</label>
//                   <FormControl>
//                     <Input placeholder="Enter address" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="region"
//               render={({ field }) => (
//                 <FormItem>
//                   <label className="font-medium">Region</label>
//                   <Select
//                     onValueChange={(value) => {
//                       field.onChange(value)
//                       handleRegionChange(value)
//                     }}
//                     defaultValue={field.value}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select region" />
//                     </SelectTrigger>
//                     <SelectContent className="max-h-72">
//                       <SelectGroup>
//                         <SelectLabel>Region</SelectLabel>
//                         {regions.map((region) => (
//                           <SelectItem key={region.name} value={region.name}>
//                             {region.name}
//                           </SelectItem>
//                         ))}
//                       </SelectGroup>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="city"
//               render={({ field }) => (
//                 <FormItem>
//                   <label className="font-medium">City</label>
//                   <Select
//                     onValueChange={(value) => {
//                       field.onChange(value)
//                       setSelectedCity(value) // Update selected city
//                     }}
//                     defaultValue={field.value}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select city" />
//                     </SelectTrigger>
//                     <SelectContent className="max-h-72">
//                       <SelectGroup>
//                         <SelectLabel>City</SelectLabel>
//                         {filteredCities.map((city) => (
//                           <SelectItem key={city.id} value={city.city}>
//                             {city.city}
//                           </SelectItem>
//                         ))}
//                       </SelectGroup>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//           <FormField
//             control={form.control}
//             name="deliveryMethod"
//             render={({ field }) => (
//               <FormItem>
//                 <div className="space-y-4">
//                   <label className="font-medium">Delivery Method</label>
//                   <div className="space-y-2">
//                     {deliveryMethods.map((method) => (
//                       <div key={method.value}>
//                         <div
//                           className={`p-3 rounded-lg border cursor-pointer ${
//                             selectedDeliveryMethod === method.value
//                               ? "border-green-500"
//                               : "border-gray-300"
//                           }`}
//                           onClick={() => {
//                             setSelectedDeliveryMethod(method.value)
//                             setDeliveryDate(method.date)
//                             if (method.value !== "schedule-pickup") {
//                               setSelectedPickupOption("") // Reset pickup option
//                             }
//                           }}
//                         >
//                           <span className="font-semibold">{method.label}</span>
//                           {method.date && (
//                             <span className="text-sm text-gray-500">
//                               {" "}
//                               - {method.date}
//                             </span>
//                           )}
//                         </div>

//                         {/* Render additional fields for specific delivery methods */}
//                         {selectedDeliveryMethod === method.value &&
//                           method.value === "schedule-pickup" && (
//                             <div className="mt-3 space-y-2 pl-4">
//                               <label className="font-medium">
//                                 Pickup Options
//                               </label>
//                               {pickupOptions.map((option, index) => {
//                                 // Normalize the fetched option for comparison
//                                 const normalizedOption = option
//                                   .trim()
//                                   .toUpperCase()

//                                 const date =
//                                   normalizedOption === "DZORWULU"
//                                     ? formatDeliveryDate(wednesday)
//                                     : pickupOptions.some(
//                                         (loc) =>
//                                           loc.toUpperCase() === normalizedOption
//                                       )
//                                     ? formatDeliveryDate(saturday)
//                                     : null

//                                 return (
//                                   <div
//                                     key={index}
//                                     className="flex items-center space-x-3 cursor-pointer"
//                                   >
//                                     <input
//                                       type="radio"
//                                       name="pickupOption"
//                                       value={option}
//                                       checked={selectedPickupOption === option}
//                                       onChange={() => {
//                                         setSelectedPickupOption(option)
//                                         setDeliveryDate(date)
//                                       }}
//                                     />
//                                     <span>{`${option} - ${date}`}</span>
//                                   </div>
//                                 )
//                               })}
//                             </div>
//                           )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </FormItem>
//             )}
//           />

//           <Button type="submit" className="w-full" disabled={isSaving}>
//             {isSaving ? (
//               <span className="loading loading-spinner loading-md"></span>
//             ) : (
//               "Update delivery method"
//             )}
//           </Button>
//         </div>
//       </form>
//     </Form>
//   )
// }

const ChangeDeliveryMethodForm = ({ order }: Props) => {
  const [selectedCity, setSelectedCity] = useState("")
  const [filteredCities, setFilteredCities] = useState<CitiesWithFees[]>([])
  const [list, setList] = useState<CitiesWithFees[]>([])
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState("")
  const [selectedPickupOption, setSelectedPickupOption] = useState("")
  const [pickupOptions, setPickupOptions] = useState<string[]>([])
  const [wednesday, saturday] = getUpcomingDeliveryDates()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [deliveryDate, setDeliveryDate] = useState("")

  const deliveryFee = useDeliveryStore((state) => state.deliveryFee)
  const setDeliveryFee = useDeliveryStore((state) => state.setDeliveryFee)

  const form = useForm<z.infer<typeof CheckoutSchema>>({
    resolver: zodResolver(CheckoutSchema),
    defaultValues: order?.shippingAddress,
  })

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
    const deliveryMethod =
      selectedDeliveryMethod === "schedule-pickup"
        ? selectedPickupOption
        : selectedDeliveryMethod.split("-")[0]

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
          deliveryMethod,
          deliveryDate,
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

          {/* Rest of the form */}

          <FormField
            control={form.control}
            name="deliveryMethod"
            render={({ field }) => (
              <FormItem>
                <div className="space-y-4">
                  <label className="font-medium">Delivery Method</label>
                  <div className="space-y-2">
                    {deliveryMethods.map((method) => (
                      <div key={method.value}>
                        <div
                          className={`p-3 rounded-lg border cursor-pointer ${
                            selectedDeliveryMethod === method.value
                              ? "border-green-500"
                              : "border-gray-300"
                          }`}
                          onClick={() => {
                            setSelectedDeliveryMethod(method.value)
                            setDeliveryDate(method.date)
                            if (method.value !== "schedule-pickup") {
                              setSelectedPickupOption("") // Reset pickup option
                            }
                          }}
                        >
                          <span className="font-semibold">{method.label}</span>
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
                                          loc.toUpperCase() === normalizedOption
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
                                      checked={selectedPickupOption === option}
                                      onChange={() => {
                                        setSelectedPickupOption(option)
                                        setDeliveryDate(date)
                                      }}
                                    />
                                    <span>{`${option} - ${date}`}</span>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                      </div>
                    ))}
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

// export default ChangeDeliveryMethodForm
