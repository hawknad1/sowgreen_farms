"use client"
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
import { AddOrderSchema } from "@/schemas"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"
import { regions } from "@/constants"
import { CitiesWithFees } from "@/types"

const ProductShippingInfo = ({ shippingInfo, setShippingInfo }: any) => {
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState("")
  const [selectedPickupOption, setSelectedPickupOption] = useState("")
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [filteredCities, setFilteredCities] = useState([])
  const [list, setList] = useState<CitiesWithFees[]>([])

  const form = useForm<z.infer<typeof AddOrderSchema>>({
    resolver: zodResolver(AddOrderSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      city: "",
      phone: "",
      region: "",
      deliveryMethod: "",
    },
  })

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
        }
      } catch (error) {
        console.log(error)
      }
    }
    getCityList()
  }, [])

  function onSubmit(values: z.infer<typeof AddOrderSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
  return (
    // <div>
    //   <h3 className="text-lg font-bold mb-2">Shipping Information</h3>
    //   <div className="flex flex-col gap-2">
    //     <input
    //       type="text"
    //       placeholder="Full Name"
    //       value={shippingInfo.name}
    //       onChange={(e) =>
    //         setShippingInfo({ ...shippingInfo, name: e.target.value })
    //       }
    //       className="border p-2 rounded"
    //     />
    //     <input
    //       type="text"
    //       placeholder="Address"
    //       value={shippingInfo.address}
    //       onChange={(e) =>
    //         setShippingInfo({ ...shippingInfo, address: e.target.value })
    //       }
    //       className="border p-2 rounded"
    //     />
    //     <div className="flex w-full">
    //       <input
    //         type="text"
    //         placeholder="Address"
    //         value={shippingInfo.address}
    //         onChange={(e) =>
    //           setShippingInfo({ ...shippingInfo, address: e.target.value })
    //         }
    //         className="border p-2 rounded"
    //       />
    //       <input
    //         type="text"
    //         placeholder="Address"
    //         value={shippingInfo.address}
    //         onChange={(e) =>
    //           setShippingInfo({ ...shippingInfo, address: e.target.value })
    //         }
    //         className="border p-2 rounded"
    //       />
    //     </div>
    //     <input
    //       type="text"
    //       placeholder="Phone Number"
    //       value={shippingInfo.phone}
    //       onChange={(e) =>
    //         setShippingInfo({ ...shippingInfo, phone: e.target.value })
    //       }
    //       className="border p-2 rounded"
    //     />
    //   </div>
    // </div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
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
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Address" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
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
                    // Filter cities for the selected region
                    const filteredCities = list.filter(
                      (city) => city.region === value
                    )
                    setFilteredCities(filteredCities) // Update the cities state
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
                    setSelectedCity(value) // Set the selected city
                  }}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72 py-1.5 overflow-auto">
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="Phone" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export default ProductShippingInfo
