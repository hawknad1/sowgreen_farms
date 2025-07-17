"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
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
import { ShippingInfoMethodSchema } from "@/schemas"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cityDeliveryPrices, regions, saturday, wednesday } from "@/constants"
import { useEffect, useState } from "react"
import { Order, Location } from "@/types"
import { useDeliveryStore } from "@/store"
import { Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { DialogFooter } from "@/components/ui/dialog"
import { formatDeliveryDate } from "@/lib/formateDeliveryDate"
import { deductBalance } from "@/lib/actions/deductBalance"

interface DeliveryOption {
  label: string
  value: string
  date: string
}

interface PickupOption {
  label: string
  value: string // This will be the address
  locationId: string
}

interface PickupLocation {
  id: string
  locationId: string
}

interface ShippingProps {
  order: Order
  balance?: number
}

interface ApiPickupLocation {
  id: string
  location: string
}

interface PickupOption {
  label: string
  value: string // This will be the location string
  locationId: string
}

const EditShippingDetails = ({ order }: ShippingProps) => {
  const [isSaving, setIsSaving] = useState(false)
  const [selectedCity, setSelectedCity] = useState(
    order?.shippingAddress?.city || ""
  )
  const [filteredCities, setFilteredCities] = useState<Location[]>([])
  const [citiesList, setCitiesList] = useState<Location[]>([])
  const [deliveryMethod, setDeliveryMethod] = useState(
    order?.shippingAddress?.deliveryMethod || "home-delivery"
  )
  const [selectedPickupLocation, setSelectedPickupLocation] =
    useState<Location | null>(null)
  const [pickupLocations, setPickupLocations] = useState<Location[]>([])
  const [isLoadingPickupLocations, setIsLoadingPickupLocations] =
    useState(false)
  const [isLoadingCities, setIsLoadingCities] = useState(false)
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState<string>(
    order?.deliveryDate || formatDeliveryDate(wednesday)
  )

  const { deliveryFee, setDeliveryFee } = useDeliveryStore()
  const [calculatedTotal, setCalculatedTotal] = useState(order?.total || 0)

  const [deliveryOptions, setDeliveryOptions] = useState({
    homeDelivery: [
      {
        label: "Home Delivery",
        // value: "home-delivery-wednesday",
        value: `Home Delivery - ${formatDeliveryDate(wednesday)}`,
        date: formatDeliveryDate(wednesday),
      },
      {
        label: "Home Delivery",
        // value: "home-delivery-saturday",
        value: `Home Delivery - ${formatDeliveryDate(saturday)}`,
        date: formatDeliveryDate(saturday),
      },
    ],
    pickup: {
      label: "Store Pickup",
      value: "pickup",
      pickupOptions: [] as PickupOption[],
      availableDates: [
        formatDeliveryDate(wednesday),
        formatDeliveryDate(saturday),
      ],
    },
  })

  const balance = order?.creditAppliedTotal

  const form = useForm<z.infer<typeof ShippingInfoMethodSchema>>({
    resolver: zodResolver(ShippingInfoMethodSchema),
    defaultValues: {
      name: order?.shippingAddress?.name || "",
      address: order?.shippingAddress?.address || "",
      city: order?.shippingAddress?.city || "",
      region: order?.shippingAddress?.region || "",
    },
  })

  const handleRegionChange = (region: string) => {
    const filtered = citiesList.filter((city) => city.region === region)
    setFilteredCities(filtered)
    setSelectedCity("")
    form.setValue("city", "")
  }

  const onSubmit = async (values: z.infer<typeof ShippingInfoMethodSchema>) => {
    setIsSaving(true)
    const toastId = toast.loading("Updating shipping information...")

    try {
      // const finalTotal = (order?.total || 0) + deliveryFee
      const finalTotal = order?.total || 0
      const updateData = {
        ...values,
        deliveryMethod:
          deliveryMethod === "pickup"
            ? selectedPickupLocation?.address || "pickup"
            : deliveryMethod,
        deliveryFee,
        deliveryDate: selectedDeliveryDate,
        total: finalTotal,
        subtotal: finalTotal,
        updatedOrderTotal,
      }

      const res = await fetch(`/api/orders/${order?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      if (!res.ok) throw new Error(await res.text())

      toast.success("Shipping information updated!", { id: toastId })
      window.location.reload()
    } catch (error) {
      console.error("Update error:", error)
      toast.error("Failed to update shipping information", { id: toastId })
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoadingCities(true) // Add this line

        // Fetch cities
        const citiesRes = await fetch("/api/cities")
        if (citiesRes.ok) {
          const cities: Location[] = await citiesRes.json()
          setCitiesList(cities)

          if (order?.shippingAddress?.region) {
            const filtered = cities.filter(
              (city) => city.region === order.shippingAddress.region
            )
            setFilteredCities(filtered)
          }
        }

        // Fetch pickup locations
        setIsLoadingPickupLocations(true)
        const pickupRes = await fetch("/api/pickup-options")
        if (pickupRes.ok) {
          const locations: ApiPickupLocation[] = await pickupRes.json()

          // Transform the API response to match your frontend expectations
          const transformedLocations = locations.map((loc) => ({
            id: loc.id,
            address: loc.location,
            // Add dummy values for other Location type fields if needed
            city: "", // or extract from location string if possible
            region: "", // or extract from location string if possible
          }))

          setPickupLocations(transformedLocations)

          setDeliveryOptions((prev) => ({
            ...prev,
            pickup: {
              ...prev.pickup,
              pickupOptions: locations.map((loc) => ({
                label: loc.location, // or format this as needed
                value: loc.location,
                locationId: loc.id,
              })),
            },
          }))

          // Initialize selected pickup location if it exists
          if (
            order?.shippingAddress?.deliveryMethod.includes("Home Delivery") &&
            order?.shippingAddress?.deliveryMethod !== "pickup"
          ) {
            const savedLocation = transformedLocations.find(
              (loc) => loc.address === order.shippingAddress.deliveryMethod
            )
            if (savedLocation) {
              setSelectedPickupLocation(savedLocation)
              setDeliveryMethod(savedLocation.address)
            }
          }
        }

        // Initialize delivery fee based on city
        if (
          order?.shippingAddress?.city &&
          cityDeliveryPrices[order.shippingAddress.city]
        ) {
          setDeliveryFee(cityDeliveryPrices[order.shippingAddress.city])
        }
      } catch (error) {
        console.error("Initialization error:", error)
        toast.error("Failed to load shipping options")
      } finally {
        setIsLoadingCities(false)
        setIsLoadingPickupLocations(false)
      }
    }

    initializeData()
  }, [order, setDeliveryFee])

  useEffect(() => {
    let newFee = 0

    if (
      deliveryMethod !== "pickup" &&
      !pickupLocations.some((loc) => loc.address === deliveryMethod) &&
      selectedCity &&
      cityDeliveryPrices[selectedCity]
    ) {
      newFee = cityDeliveryPrices[selectedCity]
    }

    setDeliveryFee(newFee)
    setCalculatedTotal((order?.total || 0) + newFee)
  }, [
    selectedCity,
    deliveryMethod,
    order?.total,
    setDeliveryFee,
    pickupLocations,
  ])

  const { remainingAmount, updatedBalance, updatedOrderTotal } = deductBalance(
    balance,
    calculatedTotal
  )

  return (
    <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto px-1">
      {/* Order Summary */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h3 className="font-semibold text-lg mb-3">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(order?.total || 0, "GHS")}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee:</span>
            <span>{formatCurrency(deliveryFee, "GHS")}</span>
          </div>
          {balance > 0 && (
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Available credit:</span>
              <span>{formatCurrency(balance, "GHS")}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t font-medium">
            <span>Total:</span>
            <span>{formatCurrency(calculatedTotal, "GHS")}</span>
          </div>

          <div className="flex text-red-500 justify-between pt-2 border-t font-medium">
            <span>Total Due:</span>
            <span>{formatCurrency(updatedOrderTotal, "GHS")}</span>
          </div>
        </div>
      </div>

      {/* Delivery Method Selection */}
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Delivery Method</h4>
          <div className="grid grid-cols-2 gap-3">
            {deliveryOptions.homeDelivery.map((option, index) => (
              <Button
                key={index}
                variant={
                  deliveryMethod === option.value ? "sowgreen" : "outline"
                }
                onClick={() => {
                  setDeliveryMethod(option.value)
                  setSelectedDeliveryDate(option.date)
                }}
                className="h-14 flex flex-col items-start"
              >
                <span className="font-medium">{option.label}</span>
                <span className="text-xs md:text-sm">{option.date}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Pickup Option */}
        <div>
          <Button
            variant={
              deliveryMethod === "pickup" ||
              pickupLocations.some((loc) => loc.address === deliveryMethod)
                ? "sowgreen"
                : "outline"
            }
            onClick={() => {
              setDeliveryMethod("pickup")
              setSelectedDeliveryDate(formatDeliveryDate(wednesday)) // Default to Wednesday
            }}
            className="w-full h-14"
          >
            Store Pickup
          </Button>

          {(deliveryMethod === "pickup" ||
            pickupLocations.some((loc) => loc.address === deliveryMethod)) && (
            <>
              <div className="mt-3 space-y-3">
                {isLoadingPickupLocations ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  deliveryOptions.pickup.pickupOptions.map((option) => (
                    <Button
                      key={option.locationId}
                      variant={
                        deliveryMethod === option.value ? "sowgreen" : "outline"
                      }
                      onClick={() => {
                        const location = pickupLocations.find(
                          (loc) => loc.address === option.value
                        )
                        setSelectedPickupLocation(location || null)
                        setDeliveryMethod(option.value)
                      }}
                      className="w-full h-14 flex flex-col items-start"
                    >
                      <span className="font-medium">{option.label}</span>
                    </Button>
                  ))
                )}
              </div>
              {/* Pickup Date Selection */}
              <div className="space-y-2">
                <h5 className="font-medium">Pickup Date</h5>
                <div className="grid grid-cols-2 gap-2">
                  {deliveryOptions.pickup.availableDates.map((date) => (
                    <Button
                      key={date}
                      variant={
                        selectedDeliveryDate === date ? "sowgreen" : "outline"
                      }
                      onClick={() => setSelectedDeliveryDate(date)}
                      className="h-14 flex flex-col items-center"
                    >
                      <span className="text-xs md:text-sm">{date}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Shipping Address Form (only shown for home delivery) */}
      {deliveryMethod.includes("Home Delivery") && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Region</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        handleRegionChange(value)
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region.name} value={region.name}>
                            {region.name}
                          </SelectItem>
                        ))}
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
                      disabled={!form.watch("region")}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredCities.map((city) => (
                          <SelectItem key={city.id} value={city.city}>
                            {city.city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="submit"
                variant="sowgreen"
                className="w-full"
                // disabled={isSaving || !selectedCity}
                disabled={
                  isSaving ||
                  (!selectedCity && deliveryMethod.includes("Home Delivery")) ||
                  isLoadingCities
                }
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      )}

      {/* Pickup Confirmation */}
      {(deliveryMethod === "pickup" ||
        pickupLocations.some((loc) => loc.address === deliveryMethod)) && (
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 className="font-medium mb-2">Selected Pickup</h4>
            {selectedPickupLocation ? (
              <div>
                <p className="font-medium">{selectedPickupLocation.address}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedPickupLocation.city}, {selectedPickupLocation.region}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Please bring your order confirmation when picking up
                </p>
              </div>
            ) : deliveryMethod !== "pickup" ? (
              <div>
                <p className="font-medium">{deliveryMethod}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Please bring your order confirmation when picking up
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Please select a pickup option
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="sowgreen"
              onClick={() => onSubmit(form.getValues())}
              className="w-full"
              disabled={
                isSaving ||
                (deliveryMethod === "pickup" && !selectedPickupLocation)
              }
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Confirm Pickup"
              )}
            </Button>
          </DialogFooter>
        </div>
      )}
    </div>
  )
}

export default EditShippingDetails
