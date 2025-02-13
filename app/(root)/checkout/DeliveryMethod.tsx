// "use client"

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { UseFormReturn } from "react-hook-form"
// import { z } from "zod"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { useEffect, useState } from "react"
// import { deliveryMethods } from "@/constants"
// import { CheckoutSchema } from "@/schemas"
// import { getUpcomingDeliveryDates } from "@/lib/getUpcomingDeliveryDates"
// import { formatDeliveryDate } from "@/lib/formateDeliveryDate"

// // Define types for props
// interface DeliveryMethodProps {
//   setSelectedDeliveryMethod: (method: string) => void
//   selectedDeliveryMethod: string
//   selectedPickupOption: string
//   selectedDeliveryDate: string
//   form: UseFormReturn<z.infer<typeof CheckoutSchema>> // Updated type here
//   setSelectedPickupOption: (method: string) => void
//   setSelectedDeliveryDate: (method: string) => void
// }

// export const DeliveryMethod: React.FC<DeliveryMethodProps> = ({
//   setSelectedDeliveryMethod,
//   selectedDeliveryMethod,
//   selectedPickupOption,
//   setSelectedPickupOption,
//   setSelectedDeliveryDate,
//   form,
// }) => {
//   const [pickupOptions, setPickupOptions] = useState<string[]>([])
//   const [wednesday, saturday] = getUpcomingDeliveryDates()

//   // Fetch available pickup options
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

//   return (
//     <div className="border border-neutral-300 w-full h-fit p-4 rounded-lg">
//       <FormField
//         // control={form}
//         name="deliveryMethod"
//         render={({ field }) => (
//           <FormItem className="space-y-3">
//             <FormControl>
//               <RadioGroup
//                 onValueChange={(value) => {
//                   field.onChange(value)
//                   setSelectedDeliveryMethod(value)
//                 }}
//                 defaultValue={field.value}
//                 className="flex flex-col"
//               >
//                 {deliveryMethods.map((option) => (
//                   <div key={option.value}>
//                     <FormItem
//                       className={`flex items-center space-x-3 space-y-0 p-3 rounded-lg ${
//                         selectedDeliveryMethod === option.value
//                           ? "border border-neutral-400"
//                           : "border border-transparent"
//                       }`}
//                     >
//                       <FormControl>
//                         <RadioGroupItem
//                           value={option.value}
//                           onClick={() => setSelectedDeliveryDate(option.date)}
//                         />
//                       </FormControl>
//                       <FormLabel className="font-semibold flex items-center gap-x-2">
//                         {option.label}
//                         {option.tag && (
//                           <span className="font-medium text-green-600">
//                             {option.tag}
//                           </span>
//                         )}
//                         {option.date && (
//                           <span className="font-medium text-green-600">
//                             - {option.date}
//                           </span>
//                         )}
//                       </FormLabel>
//                     </FormItem>

//                     {/* Conditionally render the pickup options if 'Schedule Pickup' is selected */}
//                     {option.value === "schedule-pickup" &&
//                       selectedDeliveryMethod === "schedule-pickup" && (
//                         <div className="ml-8 mt-3 space-y-3">
//                           <p className="font-semibold">Pickup Options:</p>
//                           <RadioGroup
//                             onValueChange={(pickupValue) => {
//                               setSelectedPickupOption(pickupValue)
//                             }}
//                             value={selectedPickupOption}
//                             className="flex flex-col space-y-2"
//                           >
//                             {pickupOptions.map((pickupOption, index) => {
//                               // Normalize the fetched option for comparison
//                               const normalizedOption = pickupOption
//                                 .trim()
//                                 .toUpperCase()

//                               // Determine the date based on pickup location
//                               const date =
//                                 normalizedOption === "DZORWULU"
//                                   ? formatDeliveryDate(wednesday)
//                                   : [
//                                       "WEB DuBOIS CENTER",
//                                       "PARKS & GARDENS",
//                                     ].some(
//                                       (loc) =>
//                                         loc.toUpperCase() === normalizedOption
//                                     )
//                                   ? formatDeliveryDate(saturday)
//                                   : null

//                               return (
//                                 <FormItem
//                                   key={`${pickupOption}-${index}`}
//                                   className={`flex items-center space-x-3 p-2 rounded-lg ${
//                                     selectedPickupOption === pickupOption
//                                       ? "border border-neutral-400"
//                                       : "border border-transparent"
//                                   }`}
//                                 >
//                                   <FormControl>
//                                     <RadioGroupItem
//                                       value={pickupOption}
//                                       onClick={() =>
//                                         setSelectedDeliveryDate(date)
//                                       }
//                                     />
//                                   </FormControl>
//                                   <FormLabel className="flex flex-col">
//                                     <span>{pickupOption}</span>
//                                     {date && (
//                                       <span className="text-gray-500 text-sm">
//                                         {`${date} - 11AM - 5PM`}
//                                       </span>
//                                     )}
//                                   </FormLabel>
//                                 </FormItem>
//                               )
//                             })}
//                           </RadioGroup>
//                         </div>
//                       )}
//                   </div>
//                 ))}
//               </RadioGroup>
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />
//     </div>
//   )
// }

"use client"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { UseFormReturn } from "react-hook-form"
import { z } from "zod"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useEffect, useState } from "react"
import { deliveryMethods } from "@/constants"
import { CheckoutSchema } from "@/schemas"
import { getUpcomingDeliveryDates } from "@/lib/getUpcomingDeliveryDates"
import { formatDeliveryDate } from "@/lib/formateDeliveryDate"

// Define types for props
interface DeliveryMethodProps {
  setSelectedDeliveryMethod: (method: string) => void
  selectedDeliveryMethod: string
  selectedPickupOption: string
  selectedDeliveryDate: string
  form: UseFormReturn<z.infer<typeof CheckoutSchema>>
  setSelectedPickupOption: (method: string) => void
  setSelectedDeliveryDate: (method: string) => void
}

export const DeliveryMethod: React.FC<DeliveryMethodProps> = ({
  setSelectedDeliveryMethod,
  selectedDeliveryMethod,
  selectedPickupOption,
  setSelectedPickupOption,
  setSelectedDeliveryDate,
  form,
}) => {
  const [pickupOptions, setPickupOptions] = useState<string[]>([])
  const [wednesday, saturday] = getUpcomingDeliveryDates()

  // Load selected delivery method from localStorage on component mount
  useEffect(() => {
    const savedDeliveryMethod = localStorage.getItem("selectedDeliveryMethod")
    if (savedDeliveryMethod) {
      setSelectedDeliveryMethod(savedDeliveryMethod)
      form.setValue("deliveryMethod", savedDeliveryMethod) // Sync with react-hook-form
    }
  }, [form, setSelectedDeliveryMethod])

  // Save selected delivery method to localStorage whenever it changes
  useEffect(() => {
    if (selectedDeliveryMethod) {
      localStorage.setItem("selectedDeliveryMethod", selectedDeliveryMethod)
    }
  }, [selectedDeliveryMethod])

  // Load selected pickup option from localStorage on component mount
  useEffect(() => {
    const savedPickupOption = localStorage.getItem("selectedPickupOption")
    if (savedPickupOption) {
      setSelectedPickupOption(savedPickupOption)
      form.setValue("pickupOption", savedPickupOption) // Sync with react-hook-form
    }
  }, [form, setSelectedPickupOption])

  // Save selected pickup option to localStorage whenever it changes
  useEffect(() => {
    if (selectedPickupOption) {
      localStorage.setItem("selectedPickupOption", selectedPickupOption)
    }
  }, [selectedPickupOption])

  // Fetch available pickup options
  useEffect(() => {
    async function getPickupOptions() {
      try {
        const res = await fetch("/api/pickup-options", {
          method: "GET",
          cache: "no-store",
        })
        if (res.ok) {
          const data = await res.json()
          setPickupOptions(
            data.map(
              (option: { id: string; location: string }) => option.location
            )
          )
        }
      } catch (error) {
        console.log("Error fetching pickup options:", error)
      }
    }
    getPickupOptions()
  }, [])

  return (
    <div className="border border-neutral-300 w-full h-fit p-4 rounded-lg">
      <FormField
        control={form.control}
        name="deliveryMethod"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormControl>
              <RadioGroup
                onValueChange={(value) => {
                  field.onChange(value) // Update react-hook-form state
                  setSelectedDeliveryMethod(value) // Update local state
                }}
                value={selectedDeliveryMethod}
                defaultValue={field.value}
                className="flex flex-col"
              >
                {deliveryMethods.map((option) => (
                  <div key={option.value}>
                    <FormItem
                      className={`flex items-center space-x-3 space-y-0 p-3 rounded-lg ${
                        selectedDeliveryMethod === option.value
                          ? "border border-neutral-400"
                          : "border border-transparent"
                      }`}
                    >
                      <FormControl>
                        <RadioGroupItem
                          value={option.value}
                          onClick={() =>
                            setSelectedDeliveryDate(option.date || "")
                          }
                        />
                      </FormControl>
                      <FormLabel className="font-semibold text-xs md:text-sm lg:text-base flex items-center gap-x-2">
                        {option.label}
                        {option.tag && (
                          <span className="font-medium text-xs md:text-sm lg:text-base text-green-600">
                            {option.tag}
                          </span>
                        )}
                        {option.date && (
                          <span className="font-medium text-xs md:text-sm lg:text-base text-green-600">
                            - {option.date}
                          </span>
                        )}
                      </FormLabel>
                    </FormItem>
                    {/* Conditionally render the pickup options if 'Schedule Pickup' is selected */}
                    {option.value === "schedule-pickup" &&
                      selectedDeliveryMethod === "schedule-pickup" && (
                        <div className="ml-8 mt-3 space-y-2">
                          <p className="font-semibold text-xs md:text-sm lg:text-base">
                            Pickup Options:
                          </p>
                          <FormField
                            control={form.control}
                            name="pickupOption"
                            render={({ field }) => (
                              <RadioGroup
                                onValueChange={(pickupValue) => {
                                  field.onChange(pickupValue) // Update react-hook-form state
                                  setSelectedPickupOption(pickupValue) // Update local state
                                }}
                                value={selectedPickupOption}
                                className="flex flex-col space-y-2"
                              >
                                {pickupOptions.map((pickupOption, index) => {
                                  const normalizedOption = pickupOption
                                    .trim()
                                    .toUpperCase()
                                  const date =
                                    normalizedOption === "DZORWULU"
                                      ? formatDeliveryDate(wednesday)
                                      : [
                                          "WEB DuBOIS CENTER",
                                          "PARKS & GARDENS",
                                        ].some(
                                          (loc) =>
                                            loc.toUpperCase() ===
                                            normalizedOption
                                        )
                                      ? formatDeliveryDate(saturday)
                                      : null

                                  return (
                                    <FormItem
                                      key={`${pickupOption}-${index}`}
                                      className={`flex items-center space-x-3 p-2 rounded-lg ${
                                        selectedPickupOption === pickupOption
                                          ? "border border-neutral-400"
                                          : "border border-transparent"
                                      }`}
                                    >
                                      <FormControl>
                                        <RadioGroupItem
                                          value={pickupOption}
                                          required
                                          onClick={() =>
                                            setSelectedDeliveryDate(date || "")
                                          }
                                        />
                                      </FormControl>
                                      <FormLabel className="flex flex-col">
                                        <span className="text-xs md:text-sm lg:text-base">
                                          {pickupOption}
                                        </span>
                                        {date && (
                                          <span className="text-gray-500 text-xs md:text-sm lg:text-base">
                                            {`${date} - 11AM - 5PM`}
                                          </span>
                                        )}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                })}
                                <FormMessage />
                              </RadioGroup>
                            )}
                          />
                        </div>
                      )}
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

// "use client"

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { UseFormReturn } from "react-hook-form"
// import { z } from "zod"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { useEffect, useState } from "react"
// import { deliveryMethods } from "@/constants"
// import { CheckoutSchema } from "@/schemas"
// import { getUpcomingDeliveryDates } from "@/lib/getUpcomingDeliveryDates"
// import { formatDeliveryDate } from "@/lib/formateDeliveryDate"

// // Define types for props
// interface DeliveryMethodProps {
//   setSelectedDeliveryMethod: (method: string) => void
//   selectedDeliveryMethod: string
//   selectedPickupOption: string
//   selectedDeliveryDate: string
//   form: UseFormReturn<z.infer<typeof CheckoutSchema>>
//   setSelectedPickupOption: (method: string) => void
//   setSelectedDeliveryDate: (method: string) => void
// }

// export const DeliveryMethod: React.FC<DeliveryMethodProps> = ({
//   setSelectedDeliveryMethod,
//   selectedDeliveryMethod,
//   selectedPickupOption,
//   setSelectedPickupOption,
//   setSelectedDeliveryDate,
//   form,
// }) => {
//   const [pickupOptions, setPickupOptions] = useState<string[]>([])
//   const [wednesday, saturday] = getUpcomingDeliveryDates()

//   // Load selected delivery method from localStorage on component mount
//   useEffect(() => {
//     const savedDeliveryMethod = localStorage.getItem("selectedDeliveryMethod")
//     if (savedDeliveryMethod) {
//       setSelectedDeliveryMethod(savedDeliveryMethod)
//       form.setValue("deliveryMethod", savedDeliveryMethod) // Sync with react-hook-form
//     }
//   }, [form, setSelectedDeliveryMethod])

//   // Save selected delivery method to localStorage whenever it changes
//   useEffect(() => {
//     if (selectedDeliveryMethod) {
//       localStorage.setItem("selectedDeliveryMethod", selectedDeliveryMethod)
//     }
//   }, [selectedDeliveryMethod])

//   // Fetch available pickup options
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

//   return (
//     // <div className="border border-neutral-300 w-full h-fit p-4 rounded-lg">
//     //   <FormField
//     //     control={form.control} // Use form.control
//     //     name="deliveryMethod"
//     //     render={({ field }) => (
//     //       <FormItem className="space-y-3">
//     //         <FormControl>
//     //           <RadioGroup
//     //             onValueChange={(value) => {
//     //               field.onChange(value) // Update react-hook-form state
//     //               setSelectedDeliveryMethod(value) // Update local state
//     //             }}
//     //             value={selectedDeliveryMethod} // Controlled value
//     //             defaultValue={field.value} // Default value from react-hook-form
//     //             className="flex flex-col"
//     //           >
//     //             {deliveryMethods.map((option) => (
//     //               <div key={option.value}>
//     //                 <FormItem
//     //                   className={`flex items-center space-x-3 space-y-0 p-3 rounded-lg ${
//     //                     selectedDeliveryMethod === option.value
//     //                       ? "border border-neutral-400"
//     //                       : "border border-transparent"
//     //                   }`}
//     //                 >
//     //                   <FormControl>
//     //                     <RadioGroupItem
//     //                       value={option.value}
//     //                       onClick={() => setSelectedDeliveryDate(option.date)}
//     //                     />
//     //                   </FormControl>
//     //                   <FormLabel className="font-semibold text-xs md:text-sm lg:text-base flex items-center gap-x-2">
//     //                     {option.label}
//     //                     {option.tag && (
//     //                       <span className="font-medium text-xs md:text-sm lg:text-base text-green-600">
//     //                         {option.tag}
//     //                       </span>
//     //                     )}
//     //                     {option.date && (
//     //                       <span className="font-medium text-xs md:text-sm lg:text-base text-green-600">
//     //                         - {option.date}
//     //                       </span>
//     //                     )}
//     //                   </FormLabel>
//     //                 </FormItem>

//     //                 {/* Conditionally render the pickup options if 'Schedule Pickup' is selected */}
//     //                 {option.value === "schedule-pickup" &&
//     //                   selectedDeliveryMethod === "schedule-pickup" && (
//     //                     <div className="ml-8 mt-3 space-y-2">
//     //                       <p className="font-semibold text-xs md:text-sm lg:text-base">
//     //                         Pickup Options:
//     //                       </p>
//     //                       <RadioGroup
//     //                         onValueChange={(pickupValue) => {
//     //                           setSelectedPickupOption(pickupValue)
//     //                         }}
//     //                         value={selectedPickupOption}
//     //                         className="flex flex-col space-y-2"
//     //                       >
//     //                         {pickupOptions.map((pickupOption, index) => {
//     //                           // Normalize the fetched option for comparison
//     //                           const normalizedOption = pickupOption
//     //                             .trim()
//     //                             .toUpperCase()

//     //                           // Determine the date based on pickup location
//     //                           const date =
//     //                             normalizedOption === "DZORWULU"
//     //                               ? formatDeliveryDate(wednesday)
//     //                               : [
//     //                                   "WEB DuBOIS CENTER",
//     //                                   "PARKS & GARDENS",
//     //                                 ].some(
//     //                                   (loc) =>
//     //                                     loc.toUpperCase() === normalizedOption
//     //                                 )
//     //                               ? formatDeliveryDate(saturday)
//     //                               : null

//     //                           return (
//     //                             <FormItem
//     //                               key={`${pickupOption}-${index}`}
//     //                               className={`flex items-center space-x-3 p-2 rounded-lg ${
//     //                                 selectedPickupOption === pickupOption
//     //                                   ? "border border-neutral-400"
//     //                                   : "border border-transparent"
//     //                               }`}
//     //                             >
//     //                               <FormControl>
//     //                                 <RadioGroupItem
//     //                                   value={pickupOption}
//     //                                   required
//     //                                   onClick={() =>
//     //                                     setSelectedDeliveryDate(date)
//     //                                   }
//     //                                 />
//     //                               </FormControl>
//     //                               <FormLabel className="flex flex-col">
//     //                                 <span className="text-xs md:text-sm lg:text-base">
//     //                                   {pickupOption}
//     //                                 </span>
//     //                                 {date && (
//     //                                   <span className="text-gray-500 text-xs md:text-sm lg:text-base">
//     //                                     {`${date} - 11AM - 5PM`}
//     //                                   </span>
//     //                                 )}
//     //                               </FormLabel>
//     //                             </FormItem>
//     //                           )
//     //                         })}
//     //                       </RadioGroup>
//     //                     </div>
//     //                   )}
//     //               </div>
//     //             ))}
//     //           </RadioGroup>
//     //         </FormControl>
//     //         <FormMessage />
//     //       </FormItem>
//     //     )}
//     //   />
//     // </div>
//     <div className="border border-neutral-300 w-full h-fit p-4 rounded-lg">
//       <FormField
//         control={form.control} // Use form.control
//         name="deliveryMethod"
//         render={({ field }) => (
//           <FormItem className="space-y-3">
//             <FormControl>
//               <RadioGroup
//                 onValueChange={(value) => {
//                   field.onChange(value) // Update react-hook-form state
//                   setSelectedDeliveryMethod(value) // Update local state
//                 }}
//                 value={selectedDeliveryMethod} // Controlled value
//                 defaultValue={field.value} // Default value from react-hook-form
//                 className="flex flex-col"
//               >
//                 {deliveryMethods.map((option) => (
//                   <div key={option.value}>
//                     <FormItem
//                       className={`flex items-center space-x-3 space-y-0 p-3 rounded-lg ${
//                         selectedDeliveryMethod === option.value
//                           ? "border border-neutral-400"
//                           : "border border-transparent"
//                       }`}
//                     >
//                       <FormControl>
//                         <RadioGroupItem
//                           value={option.value}
//                           onClick={() => setSelectedDeliveryDate(option.date)}
//                         />
//                       </FormControl>
//                       <FormLabel className="font-semibold text-xs md:text-sm lg:text-base flex items-center gap-x-2">
//                         {option.label}
//                         {option.tag && (
//                           <span className="font-medium text-xs md:text-sm lg:text-base text-green-600">
//                             {option.tag}
//                           </span>
//                         )}
//                         {option.date && (
//                           <span className="font-medium text-xs md:text-sm lg:text-base text-green-600">
//                             - {option.date}
//                           </span>
//                         )}
//                       </FormLabel>
//                     </FormItem>

//                     {/* Conditionally render the pickup options if 'Schedule Pickup' is selected */}
//                     {option.value === "schedule-pickup" &&
//                       selectedDeliveryMethod === "schedule-pickup" && (
//                         <div className="ml-8 mt-3 space-y-2">
//                           <p className="font-semibold text-xs md:text-sm lg:text-base">
//                             Pickup Options:
//                           </p>
//                           <FormField
//                             control={form.control}
//                             name="pickupOption"
//                             render={({ field }) => (
//                               <RadioGroup
//                                 onValueChange={(pickupValue) => {
//                                   field.onChange(pickupValue) // Update react-hook-form state
//                                   setSelectedPickupOption(pickupValue) // Update local state
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
//                                         <RadioGroupItem
//                                           value={pickupOption}
//                                           required
//                                           onClick={() =>
//                                             setSelectedDeliveryDate(date)
//                                           }
//                                         />
//                                       </FormControl>

//                                       <FormLabel className="flex flex-col">
//                                         <span className="text-xs md:text-sm lg:text-base">
//                                           {pickupOption}
//                                         </span>
//                                         {date && (
//                                           <span className="text-gray-500 text-xs md:text-sm lg:text-base">
//                                             {`${date} - 11AM - 5PM`}
//                                           </span>
//                                         )}
//                                       </FormLabel>
//                                     </FormItem>
//                                   )
//                                 })}
//                                 <FormMessage />
//                               </RadioGroup>
//                             )}
//                           />
//                         </div>
//                       )}
//                   </div>
//                 ))}
//               </RadioGroup>
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />
//     </div>
//   )
// }
