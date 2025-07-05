// "use client"

// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { useState, useEffect, useMemo } from "react"
// import { useRouter } from "next/navigation"
// import { useSession } from "next-auth/react"
// import { Button } from "@/components/ui/button"
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { CheckoutSchema } from "@/schemas"
// import { useCartStore, useCheckoutStore, useDeliveryStore } from "@/store"
// import { cityDeliveryPrices, regions } from "@/constants"
// import { DeliveryMethod } from "./DeliveryMethod"
// import OrderSummary from "./OrderSummary"
// import { CitiesWithFees } from "@/types"
// import { WhatsappOptIn } from "./WhatsAppOptIn"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { ChevronDown, Loader2 } from "lucide-react"
// import { motion } from "framer-motion"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// interface ExtendedUser {
//   email: string
//   name: string
//   role: string
// }

// export function CheckoutForm() {
//   const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState("")
//   const [selectedPickupOption, setSelectedPickupOption] = useState("")
//   const [selectedDeliveryDate, setSelectedDeliveryDate] = useState("")
//   const [selectedCity, setSelectedCity] = useState("")
//   const [selectedRegion, setSelectedRegion] = useState("")
//   const [filteredCities, setFilteredCities] = useState<CitiesWithFees[]>([])
//   const [list, setList] = useState<CitiesWithFees[]>([])
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const session = useSession()
//   const router = useRouter()
//   const deliveryFee = useDeliveryStore((state) => state.deliveryFee)
//   const setDeliveryFee = useDeliveryStore((state) => state.setDeliveryFee)
//   const cart = useCartStore((state) => state.cart)
//   const { formValues, setFormValues } = useCheckoutStore()
//   const user = session?.data?.user as ExtendedUser

//   // Fetch cities data and restore form data
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

//           // Restore form data from Zustand store
//           if (formValues.region) {
//             const filtered = cityList.filter(
//               (city: any) => city.region === formValues.region
//             )
//             setFilteredCities(filtered)
//             setSelectedRegion(formValues.region)
//             if (formValues.city) {
//               setSelectedCity(formValues.city)
//             }
//           }
//         }
//       } catch (error) {
//         console.log(error)
//       }
//     }

//     getCityList()
//   }, [formValues])

//   // Initialize form with default values from Zustand store
//   const form = useForm<z.infer<typeof CheckoutSchema>>({
//     resolver: zodResolver(CheckoutSchema),
//     defaultValues: {
//       ...formValues,
//       deliveryMethod: "",
//       whatsappOptIn: false,
//     },
//   })

//   // Set email if user is logged in
//   useEffect(() => {
//     if (user?.email) {
//       form.setValue("email", user.email)
//       setFormValues({ email: user.email })
//     }
//   }, [user?.email, form, setFormValues])

//   // Save form data to Zustand store on change
//   const saveToStore = () => {
//     const formData = form.getValues()
//     setFormValues({
//       ...formData,
//       city: selectedCity,
//       region: selectedRegion,
//     })
//   }

//   // Compute selected delivery method
//   const selectedDelivery = useMemo(() => {
//     return selectedDeliveryMethod === "schedule-pickup"
//       ? selectedPickupOption
//       : selectedDeliveryMethod
//   }, [selectedDeliveryMethod, selectedPickupOption])

//   // Update delivery fee based on selected city and method
//   useEffect(() => {
//     if (cart.length === 0) return // Skip if cart is empty

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
//     cart.length,
//     selectedDeliveryMethod,
//     selectedPickupOption,
//     selectedCity,
//     deliveryFee,
//     setDeliveryFee,
//   ])

//   // In your CheckoutForm component
//   const handleFormSubmit = async (values: z.infer<typeof CheckoutSchema>) => {
//     setIsSubmitting(true)

//     // Validate pickup option if "Schedule Pickup" is selected
//     if (selectedDeliveryMethod === "schedule-pickup" && !selectedPickupOption) {
//       form.setError("deliveryMethod", {
//         type: "manual",
//         message: "Please select a pickup option.",
//       })
//       setIsSubmitting(false)
//       return
//     }

//     // Store in sessionStorage (or localStorage if you want it to persist)
//     sessionStorage.setItem(
//       "checkoutData",
//       JSON.stringify({
//         ...values,
//         deliveryMethod: selectedDelivery,
//         deliveryDate: selectedDeliveryDate,
//       })
//     )

//     router.push("/confirm-order")
//   }

//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(handleFormSubmit)}
//         onChange={saveToStore}
//         className="space-y-6 w-full min-h-fit"
//       >
//         <div className="flex flex-col lg:flex-row gap-6 justify-between">
//           {/* Left Column - Form Fields */}
//           <div className="w-full lg:w-2/3">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//             >
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-lg font-bold text-primary">
//                     Delivery Information
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <FormField
//                         control={form.control}
//                         name="name"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Full Name</FormLabel>
//                             <FormControl>
//                               <Input
//                                 placeholder="Enter your full name"
//                                 {...field}
//                                 className="focus-visible:ring-primary"
//                               />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                       <FormField
//                         control={form.control}
//                         name="phone"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Mobile Number</FormLabel>
//                             <FormControl>
//                               <Input
//                                 placeholder="Enter your phone number"
//                                 {...field}
//                                 className="focus-visible:ring-primary"
//                               />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <FormField
//                         control={form.control}
//                         name="region"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Region</FormLabel>
//                             <Select
//                               onValueChange={(value) => {
//                                 field.onChange(value)
//                                 setSelectedRegion(value)
//                                 const filtered = list.filter(
//                                   (city) => city.region === value
//                                 )
//                                 setFilteredCities(filtered)
//                                 form.setValue("city", "")
//                                 setSelectedCity("")
//                               }}
//                               value={field.value}
//                             >
//                               <SelectTrigger className="focus-visible:ring-primary">
//                                 <SelectValue placeholder="Select region" />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <SelectGroup>
//                                   <SelectLabel>Regions</SelectLabel>
//                                   {regions.map((reg) => (
//                                     <SelectItem
//                                       key={reg.name}
//                                       value={reg.name}
//                                       className="focus:bg-primary/10"
//                                     >
//                                       {reg.name}
//                                     </SelectItem>
//                                   ))}
//                                 </SelectGroup>
//                               </SelectContent>
//                             </Select>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="city"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>City</FormLabel>
//                             <DropdownMenu>
//                               <DropdownMenuTrigger asChild>
//                                 <Button
//                                   variant="outline"
//                                   className="w-full justify-between focus-visible:ring-primary"
//                                   disabled={!selectedRegion}
//                                 >
//                                   {field.value || "Select city"}
//                                   <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                                 </Button>
//                               </DropdownMenuTrigger>
//                               <DropdownMenuContent className="max-h-[250px] w-[290px] sm:w-[300px] md:w-[330px] lg:w-[360px] overflow-y-auto">
//                                 <DropdownMenuGroup>
//                                   <DropdownMenuLabel>Cities</DropdownMenuLabel>
//                                   {filteredCities.length > 0 ? (
//                                     filteredCities.map((city) => (
//                                       <DropdownMenuItem
//                                         key={city.id}
//                                         onSelect={() => {
//                                           field.onChange(city.city)
//                                           setSelectedCity(city.city)
//                                         }}
//                                         className="focus:bg-primary/10"
//                                       >
//                                         {city.city}
//                                       </DropdownMenuItem>
//                                     ))
//                                   ) : (
//                                     <div className="px-2 py-1.5 text-sm text-muted-foreground">
//                                       {selectedRegion
//                                         ? "No cities found"
//                                         : "Select a region first"}
//                                     </div>
//                                   )}
//                                 </DropdownMenuGroup>
//                               </DropdownMenuContent>
//                             </DropdownMenu>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </div>

//                     <FormField
//                       control={form.control}
//                       name="address"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Delivery Address</FormLabel>
//                           <FormControl>
//                             <Input
//                               placeholder="Enter full delivery address"
//                               {...field}
//                               className="focus-visible:ring-primary"
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="email"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Email Address</FormLabel>
//                           <FormControl>
//                             <Input
//                               placeholder="Enter your email"
//                               {...field}
//                               className="focus-visible:ring-primary"
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3, delay: 0.1 }}
//               className="mt-6"
//             >
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-lg font-bold text-primary">
//                     Delivery Method
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <DeliveryMethod
//                     form={form}
//                     setSelectedDeliveryMethod={setSelectedDeliveryMethod}
//                     selectedDeliveryMethod={selectedDeliveryMethod}
//                     setSelectedPickupOption={setSelectedPickupOption}
//                     selectedPickupOption={selectedPickupOption}
//                     setSelectedDeliveryDate={setSelectedDeliveryDate}
//                     selectedDeliveryDate={selectedDeliveryDate}
//                   />
//                 </CardContent>
//               </Card>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3, delay: 0.2 }}
//               className="mt-6"
//             >
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-lg font-bold text-primary">
//                     Communication Preferences
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <WhatsappOptIn />
//                 </CardContent>
//               </Card>
//             </motion.div>
//           </div>

//           {/* Right Column - Order Summary */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3, delay: 0.3 }}
//             className="w-full lg:w-1/3"
//           >
//             <Card className="sticky top-6">
//               <CardHeader>
//                 <CardTitle className="text-lg font-bold text-primary">
//                   Order Summary
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <OrderSummary
//                   selectedPickupOption={selectedPickupOption}
//                   selectedDeliveryMethod={selectedDeliveryMethod}
//                   deliveryFee={deliveryFee}
//                 />
//                 <Button
//                   className="w-full mt-6 bg-primary hover:bg-primary/90 h-12 text-lg"
//                   type="submit"
//                   variant="sowgreen"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Processing...
//                     </>
//                   ) : (
//                     "Confirm Order"
//                   )}
//                 </Button>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </div>
//       </form>
//     </Form>
//   )
// }

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
import { WhatsappOptIn } from "./WhatsAppOptIn"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"

interface ExtendedUser {
  email: string
  name: string
  role: string
}

export function CheckoutForm() {
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState("")
  const [selectedPickupOption, setSelectedPickupOption] = useState("")
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("")
  const [filteredCities, setFilteredCities] = useState<CitiesWithFees[]>([])
  const [list, setList] = useState<CitiesWithFees[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeliveryInfoCollapsed, setIsDeliveryInfoCollapsed] = useState(false)
  const [isDeliveryMethodCollapsed, setIsDeliveryMethodCollapsed] =
    useState(false)

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
    defaultValues: {
      ...formValues,
      deliveryMethod: "",
      whatsappOptIn: false,
    },
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

  // Function to check if all required delivery info fields are filled
  const isDeliveryInfoComplete = () => {
    const values = form.getValues()
    return (
      values.name &&
      values.phone &&
      values.region &&
      values.city &&
      values.address &&
      values.email
    )
  }

  // In your CheckoutForm component
  const handleFormSubmit = async (values: z.infer<typeof CheckoutSchema>) => {
    setIsSubmitting(true)

    // Validate pickup option if "Schedule Pickup" is selected
    if (selectedDeliveryMethod === "schedule-pickup" && !selectedPickupOption) {
      form.setError("deliveryMethod", {
        type: "manual",
        message: "Please select a pickup option.",
      })
      setIsSubmitting(false)
      return
    }

    // Store in sessionStorage (or localStorage if you want it to persist)
    sessionStorage.setItem(
      "checkoutData",
      JSON.stringify({
        ...values,
        deliveryMethod: selectedDelivery,
        deliveryDate: selectedDeliveryDate,
      })
    )

    router.push("/confirm-order")
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        onChange={saveToStore}
        className="space-y-6 w-full min-h-fit"
      >
        <div className="flex flex-col lg:flex-row gap-6 justify-between">
          {/* Left Column - Form Fields */}
          <div className="w-full lg:w-2/3">
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-primary">
                    Delivery Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your full name"
                                {...field}
                                className="focus-visible:ring-primary"
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
                          <FormItem>
                            <FormLabel>Mobile Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your phone number"
                                {...field}
                                className="focus-visible:ring-primary"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                              <SelectTrigger className="focus-visible:ring-primary">
                                <SelectValue placeholder="Select region" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Regions</SelectLabel>
                                  {regions.map((reg) => (
                                    <SelectItem
                                      key={reg.name}
                                      value={reg.name}
                                      className="focus:bg-primary/10"
                                    >
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
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-between focus-visible:ring-primary"
                                  disabled={!selectedRegion}
                                >
                                  {field.value || "Select city"}
                                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="max-h-[250px] w-[290px] sm:w-[300px] md:w-[330px] lg:w-[360px] overflow-y-auto">
                                <DropdownMenuGroup>
                                  <DropdownMenuLabel>Cities</DropdownMenuLabel>
                                  {filteredCities.length > 0 ? (
                                    filteredCities.map((city) => (
                                      <DropdownMenuItem
                                        key={city.id}
                                        onSelect={() => {
                                          field.onChange(city.city)
                                          setSelectedCity(city.city)
                                        }}
                                        className="focus:bg-primary/10"
                                      >
                                        {city.city}
                                      </DropdownMenuItem>
                                    ))
                                  ) : (
                                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                      {selectedRegion
                                        ? "No cities found"
                                        : "Select a region first"}
                                    </div>
                                  )}
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
                          <FormLabel>Delivery Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter full delivery address"
                              {...field}
                              className="focus-visible:ring-primary"
                            />
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
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your email"
                              {...field}
                              className="focus-visible:ring-primary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div> */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader
                  className="cursor-pointer"
                  onClick={() =>
                    setIsDeliveryInfoCollapsed(!isDeliveryInfoCollapsed)
                  }
                >
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-bold text-primary">
                      Delivery Information
                    </CardTitle>
                    {isDeliveryInfoComplete() && (
                      <div className="flex items-center">
                        <span className="text-sm flex items-center gap-x-1 text-green-600 mr-2">
                          <CheckCircle2 className="ml-2 h-4 w-4 text-green-500" />{" "}
                          Completed
                        </span>
                        {isDeliveryInfoCollapsed ? (
                          <ChevronDown className="h-5 w-5 text-primary" />
                        ) : (
                          <ChevronUp className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>

                {!isDeliveryInfoCollapsed && (
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your full name"
                                  {...field}
                                  className="focus-visible:ring-primary"
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
                            <FormItem>
                              <FormLabel>Mobile Number</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your phone number"
                                  {...field}
                                  className="focus-visible:ring-primary"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                <SelectTrigger className="focus-visible:ring-primary">
                                  <SelectValue placeholder="Select region" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Regions</SelectLabel>
                                    {regions.map((reg) => (
                                      <SelectItem
                                        key={reg.name}
                                        value={reg.name}
                                        className="focus:bg-primary/10"
                                      >
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
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-between focus-visible:ring-primary"
                                    disabled={!selectedRegion}
                                  >
                                    {field.value || "Select city"}
                                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="max-h-[250px] w-[290px] sm:w-[300px] md:w-[330px] lg:w-[360px] overflow-y-auto">
                                  <DropdownMenuGroup>
                                    <DropdownMenuLabel>
                                      Cities
                                    </DropdownMenuLabel>
                                    {filteredCities.length > 0 ? (
                                      filteredCities.map((city) => (
                                        <DropdownMenuItem
                                          key={city.id}
                                          onSelect={() => {
                                            field.onChange(city.city)
                                            setSelectedCity(city.city)
                                          }}
                                          className="focus:bg-primary/10"
                                        >
                                          {city.city}
                                        </DropdownMenuItem>
                                      ))
                                    ) : (
                                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                        {selectedRegion
                                          ? "No cities found"
                                          : "Select a region first"}
                                      </div>
                                    )}
                                  </DropdownMenuGroup>
                                </DropdownMenuContent>
                              </DropdownMenu>
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
                            <FormLabel>Delivery Address</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter full delivery address"
                                {...field}
                                className="focus-visible:ring-primary"
                              />
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
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your email"
                                {...field}
                                className="focus-visible:ring-primary"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mt-6"
            >
              <Card>
                <CardHeader
                  className="cursor-pointer"
                  onClick={() =>
                    setIsDeliveryMethodCollapsed(!isDeliveryMethodCollapsed)
                  }
                >
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-bold text-primary">
                      Delivery Method
                    </CardTitle>
                    {selectedDeliveryMethod && (
                      <div className="flex items-center">
                        <span className="text-sm flex items-center gap-x-1 text-green-600 mr-2">
                          <CheckCircle2 className="ml-2 h-4 w-4 text-green-500" />{" "}
                          Selected
                        </span>
                        {isDeliveryMethodCollapsed ? (
                          <ChevronDown className="h-5 w-5 text-primary" />
                        ) : (
                          <ChevronUp className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>

                {!isDeliveryMethodCollapsed && (
                  <CardContent>
                    <DeliveryMethod
                      form={form}
                      setSelectedDeliveryMethod={setSelectedDeliveryMethod}
                      selectedDeliveryMethod={selectedDeliveryMethod}
                      setSelectedPickupOption={setSelectedPickupOption}
                      selectedPickupOption={selectedPickupOption}
                      setSelectedDeliveryDate={setSelectedDeliveryDate}
                      selectedDeliveryDate={selectedDeliveryDate}
                    />
                  </CardContent>
                )}
              </Card>
            </motion.div>
            <FormField
              control={form.control}
              name="specialNotes"
              render={({ field }) => (
                <FormItem className="mt-3">
                  <FormLabel>Special Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any special instructions for your order? (e.g., delivery instructions, allergies, etc.)"
                      {...field}
                      className="focus-visible:ring-primary min-h-[100px]"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mt-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-primary">
                    Communication Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <WhatsappOptIn />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="w-full lg:w-1/3"
          >
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-primary">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OrderSummary
                  selectedPickupOption={selectedPickupOption}
                  selectedDeliveryMethod={selectedDeliveryMethod}
                  deliveryFee={deliveryFee}
                />
                <Button
                  className="w-full mt-6 bg-primary hover:bg-primary/90 h-12 text-lg"
                  type="submit"
                  variant="sowgreen"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Order"
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </form>
    </Form>
  )
}
