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
// import { Badge } from "@/components/ui/badge"

// interface DeliveryMethodProps {
//   setSelectedDeliveryMethod: (method: string) => void
//   selectedDeliveryMethod: string
//   selectedPickupOption: string
//   selectedDeliveryDate: string
//   form: UseFormReturn<z.infer<typeof CheckoutSchema>>
//   setSelectedPickupOption: (option: string) => void
//   setSelectedDeliveryDate: (date: string) => void
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
//     const fetchPickupOptions = async () => {
//       try {
//         const res = await fetch("/api/pickup-options", {
//           method: "GET",
//           cache: "no-store",
//         })
// if (res.ok) {
//   const data = await res.json()
//   setPickupOptions(
//     data.map((option: { id: string; location: string }) =>
//       option.location.trim()
//     )
//   )
// }
//       } catch (error) {
//         console.error("Error fetching pickup options:", error)
//       }
//     }
//     fetchPickupOptions()
//   }, [])

//   // Validate pickup option when "Schedule Pickup" is selected
//   useEffect(() => {
//     if (selectedDeliveryMethod === "schedule-pickup" && !selectedPickupOption) {
//       form.setError("deliveryMethod", {
//         type: "manual",
//         message: "Please select a pickup option.",
//       })
//     } else {
//       form.clearErrors("deliveryMethod")
//     }
//   }, [selectedDeliveryMethod, selectedPickupOption, form])

//   return (
//     <FormField
//       control={form.control}
//       name="deliveryMethod"
//       render={({ field }) => (
//         <FormItem className="space-y-3">
//           <FormControl>
//             <RadioGroup
//               onValueChange={(value) => {
//                 field.onChange(value)
//                 setSelectedDeliveryMethod(value)
//                 if (value !== "schedule-pickup") {
//                   setSelectedPickupOption("")
//                 }
//               }}
//               defaultValue={field.value}
//               className="space-y-4"
//             >
//               {deliveryMethods.map((option) => (
//                 <div key={option.value}>
//                   <FormItem
//                     className={`flex items-start space-x-3 space-y-0 p-4 rounded-lg border transition-all ${
//                       selectedDeliveryMethod === option.value
//                         ? "border-primary bg-primary/5"
//                         : "border-gray-200 hover:border-primary/50"
//                     }`}
//                   >
//                     <FormControl>
//                       <RadioGroupItem
//                         value={option.value}
//                         onClick={() => setSelectedDeliveryDate(option.date)}
//                         className="mt-0.5 text-primary"
//                       />
//                     </FormControl>
//                     <div className="space-y-1">
//                       <FormLabel className="font-semibold text-base cursor-pointer">
//                         {option.label}
//                         {option.tag && (
//                           <Badge variant="secondary" className="ml-2">
//                             {option.tag}
//                           </Badge>
//                         )}
//                       </FormLabel>
//                       {option.date && (
//                         <p className="text-sm text-gray-600">
//                           Delivery date: {option.date}
//                         </p>
//                       )}
//                     </div>
//                   </FormItem>

//                   {option.value === "schedule-pickup" &&
//                     selectedDeliveryMethod === "schedule-pickup" && (
//                       <div className="ml-8 mt-3 space-y-3">
//                         <p className="font-medium text-gray-700">
//                           Select pickup location:
//                         </p>
//                         <RadioGroup
//                           onValueChange={(pickupValue) => {
//                             setSelectedPickupOption(pickupValue)
//                             form.clearErrors("deliveryMethod")
//                           }}
//                           value={selectedPickupOption}
//                           className="space-y-2"
//                         >
//                           {pickupOptions.map((pickupOption, index) => {
//                             const normalizedOption = pickupOption
//                               .trim()
//                               .toUpperCase()
//                             const date =
//                               normalizedOption === "DZORWULU"
//                                 ? formatDeliveryDate(wednesday)
//                                 : ["WEB DuBOIS CENTER", "PARKS & GARDENS"].some(
//                                       (loc) =>
//                                         loc.toUpperCase() === normalizedOption
//                                     )
//                                   ? formatDeliveryDate(saturday)
//                                   : null

//                             return (
//                               <FormItem
//                                 key={`${pickupOption}-${index}`}
//                                 className={`flex items-start space-x-3 p-3 rounded-lg border transition-all ${
//                                   selectedPickupOption === pickupOption
//                                     ? "border-primary bg-primary/5"
//                                     : "border-gray-200 hover:border-primary/50"
//                                 }`}
//                               >
//                                 <FormControl>
//                                   <RadioGroupItem
//                                     value={pickupOption}
//                                     onClick={() =>
//                                       setSelectedDeliveryDate(date || "")
//                                     }
//                                     className="mt-0.5 text-primary"
//                                   />
//                                 </FormControl>
//                                 <div className="space-y-1">
//                                   <FormLabel className="font-medium text-sm cursor-pointer">
//                                     {pickupOption}
//                                   </FormLabel>
//                                   {date && (
//                                     <p className="text-xs text-gray-500">
//                                       Available: {date} (11AM - 5PM)
//                                     </p>
//                                   )}
//                                 </div>
//                               </FormItem>
//                             )
//                           })}
//                         </RadioGroup>
//                       </div>
//                     )}
//                 </div>
//               ))}
//             </RadioGroup>
//           </FormControl>
//           {form.formState.errors.deliveryMethod && (
//             <FormMessage className="text-red-600">
//               {form.formState.errors.deliveryMethod.message}
//             </FormMessage>
//           )}
//         </FormItem>
//       )}
//     />
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
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"

interface DeliveryMethodProps {
  setSelectedDeliveryMethod: (method: string) => void
  selectedDeliveryMethod: string
  selectedPickupOption: string
  selectedDeliveryDate: string
  form: UseFormReturn<z.infer<typeof CheckoutSchema>>
  setSelectedPickupOption: (option: string) => void
  setSelectedDeliveryDate: (date: string) => void
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

  // Fetch available pickup options
  useEffect(() => {
    const fetchPickupOptions = async () => {
      try {
        const res = await fetch("/api/pickup-options", {
          method: "GET",
          cache: "no-store",
        })
        if (res.ok) {
          const data = await res.json()
          setPickupOptions(
            data.map((option: { id: string; location: string }) =>
              option.location.trim()
            )
          )
        }
      } catch (error) {
        console.error("Error fetching pickup options:", error)
      }
    }
    fetchPickupOptions()
  }, [])

  // Validate pickup option when "Schedule Pickup" is selected
  useEffect(() => {
    if (selectedDeliveryMethod === "schedule-pickup" && !selectedPickupOption) {
      form.setError("deliveryMethod", {
        type: "manual",
        message: "Please select a pickup option.",
      })
    } else {
      form.clearErrors("deliveryMethod")
    }
  }, [selectedDeliveryMethod, selectedPickupOption, form])

  return (
    <FormField
      control={form.control}
      name="deliveryMethod"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormControl>
            <RadioGroup
              onValueChange={(value) => {
                field.onChange(value)
                setSelectedDeliveryMethod(value)
                if (value !== "schedule-pickup") {
                  setSelectedPickupOption("")
                }
              }}
              defaultValue={field.value}
              className="space-y-4"
            >
              {deliveryMethods.map((option) => (
                <div key={option.value}>
                  <FormItem
                    className={`flex items-start space-x-3 space-y-0 p-4 rounded-lg border transition-all ${
                      selectedDeliveryMethod === option.value
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center">
                      <FormControl>
                        <RadioGroupItem
                          value={option.value}
                          onClick={() => setSelectedDeliveryDate(option.date)}
                          className="mt-0.5 text-primary"
                        />
                      </FormControl>
                      {selectedDeliveryMethod === option.value && (
                        <CheckCircle2 className="ml-2 h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <FormLabel className="font-semibold text-base cursor-pointer">
                        {option.label}
                        {option.tag && (
                          <Badge variant="secondary" className="ml-2">
                            {option.tag}
                          </Badge>
                        )}
                      </FormLabel>
                      {option.date && (
                        <p className="text-sm text-gray-600">
                          Delivery date: {option.date}
                        </p>
                      )}
                    </div>
                  </FormItem>

                  {option.value === "schedule-pickup" &&
                    selectedDeliveryMethod === "schedule-pickup" && (
                      <div className="ml-8 mt-3 space-y-3">
                        <p className="font-medium text-gray-700">
                          Select pickup location:
                        </p>
                        <RadioGroup
                          onValueChange={(pickupValue) => {
                            setSelectedPickupOption(pickupValue)
                            form.clearErrors("deliveryMethod")
                          }}
                          value={selectedPickupOption}
                          className="space-y-2"
                        >
                          {pickupOptions.map((pickupOption, index) => {
                            const normalizedOption = pickupOption
                              .trim()
                              .toUpperCase()
                            const date =
                              normalizedOption === "DZORWULU"
                                ? formatDeliveryDate(wednesday)
                                : ["WEB DuBOIS CENTER", "PARKS & GARDENS"].some(
                                      (loc) =>
                                        loc.toUpperCase() === normalizedOption
                                    )
                                  ? formatDeliveryDate(saturday)
                                  : null

                            return (
                              <FormItem
                                key={`${pickupOption}-${index}`}
                                className={`flex items-start space-x-3 p-3 rounded-lg border transition-all ${
                                  selectedPickupOption === pickupOption
                                    ? "border-primary bg-primary/5"
                                    : "border-gray-200 hover:border-primary/50"
                                }`}
                              >
                                <div className="flex items-center">
                                  <FormControl>
                                    <RadioGroupItem
                                      value={pickupOption}
                                      onClick={() =>
                                        setSelectedDeliveryDate(date || "")
                                      }
                                      className="mt-0.5 text-primary"
                                    />
                                  </FormControl>
                                  {selectedPickupOption === pickupOption && (
                                    <CheckCircle2 className="ml-2 h-4 w-4 text-green-500" />
                                  )}
                                </div>
                                <div className="space-y-1">
                                  <FormLabel className="font-medium text-sm cursor-pointer">
                                    {pickupOption}
                                  </FormLabel>
                                  {date && (
                                    <p className="text-xs text-gray-500">
                                      Available: {date} (11AM - 5PM)
                                    </p>
                                  )}
                                </div>
                              </FormItem>
                            )
                          })}
                        </RadioGroup>
                      </div>
                    )}
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          {form.formState.errors.deliveryMethod && (
            <FormMessage className="text-red-600">
              {form.formState.errors.deliveryMethod.message}
            </FormMessage>
          )}
        </FormItem>
      )}
    />
  )
}
