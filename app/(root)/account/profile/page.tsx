"use client"
import React, { useState, useEffect, useCallback } from "react"

import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import { toast } from "sonner"
import { Order, ShippingAddress } from "@/types"
import { mockPaymentMethods, mockPreferences } from "@/utils/mockData"
import { useSession } from "next-auth/react"
import ProfileHeader from "@/components/profile/ProfileHeader"
import PersonalInfoCard from "@/components/profile/PersonalInfoCard"
import AddressCard from "@/components/profile/AddressCard"
import PaymentMethodsCard from "@/components/profile/PaymentMethodsCard"
import PreferencesCard from "@/components/profile/PreferencesCard"
import OrderHistoryCard from "@/components/profile/OrderHistoryCard"

// Define proper types based on your application
interface UserType {
  id?: string
  name: string
  email: string
  phone?: string | null
  address?: string
  city?: string
  country?: string
  dateOfBirth?: string
  avatar?: string
  orders?: Array<Order>
  role?: string
  balance?: number
}

type PaymentMethod = {
  id: string
  cardNumber: string
  cardHolder: string
  expiryDate: string
  isDefault: boolean
}

type Preferences = {
  emailNotifications: boolean
  smsNotifications: boolean
  weeklyNewsletter: boolean
  specialOffers: boolean
  orderUpdates: boolean
}

const Profile = () => {
  const [user, setUser] = useState<UserType>({
    name: "",
    email: "",
  })
  const [addresses, setAddresses] = useState<ShippingAddress | null>(null)
  // const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  // const [preferences, setPreferences] = useState<Preferences[]>([])
  const [preferences, setPreferences] = useState<Preferences>({
    emailNotifications: false,
    smsNotifications: false,
    weeklyNewsletter: false,
    specialOffers: false,
    orderUpdates: false,
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [error, setError] = useState<string | null>(null)

  // const session = useSession()
  // const activeUser = session?.data?.user

  // useEffect(() => {
  //   const getUser = async () => {
  //     if (!activeUser?.email) return
  //     setIsLoading(true)
  //     try {
  //       const res = await fetch(`/api/user/${activeUser.email}`, {
  //         method: "GET",
  //         cache: "no-store",
  //       })
  //       if (res.ok) {
  //         const active = await res.json()

  //         if (active?.user) {
  //           // Set user data
  //           setUser({
  //             ...active.user,
  //             name: active.user.name || "",
  //             email: active.user.email || "",
  //           })

  //           // Process orders if they exist
  //           if (active.user.orders && active.user.orders.length > 0) {
  //             // Get the full order list
  //             const allOrders = active.user.orders.map((order: any) => ({
  //               ...order,
  //               date: order.createdAt,
  //               items: order.products?.length || 0,
  //             }))

  //             setOrders(allOrders)

  //             // Get the last order for the shipping address
  //             const lastOrder = allOrders[allOrders.length - 1]

  //             if (lastOrder?.shippingAddress) {
  //               // Ensure all required fields are present
  //               const shippingAddress: ShippingAddress = {
  //                 id: lastOrder.shippingAddress.id || "",
  //                 name: lastOrder.shippingAddress.name || "",
  //                 email:
  //                   lastOrder.shippingAddress.email || active.user.email || "",
  //                 address: lastOrder.shippingAddress.address || "",
  //                 city: lastOrder.shippingAddress.city || "",
  //                 region: lastOrder.shippingAddress.region || "",
  //                 country: lastOrder.shippingAddress.country || "",
  //                 phone: lastOrder.shippingAddress.phone || "",
  //                 deliveryMethod: lastOrder.shippingAddress.deliveryMethod,
  //                 whatsappOptIn: lastOrder.shippingAddress.whatsappOptIn,
  //               }
  //               setAddresses(shippingAddress)
  //             }
  //           }
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch user details:", error)
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }
  //   getUser()
  // }, [activeUser?.email])

  // const handleToggleEdit = () => {
  //   setIsEditing(!isEditing)
  // }

  // const handleSaveUser = (updatedInfo: Partial<UserType>) => {
  //   setUser((prevUser) => ({ ...prevUser, ...updatedInfo }))
  // }

  // const handleSaveAddresses = (updatedAddress: ShippingAddress) => {
  //   setAddresses(updatedAddress)
  // }

  // const handleSavePaymentMethods = (updatedMethods: typeof paymentMethods) => {
  //   setPaymentMethods(updatedMethods)
  // }

  // const handleSavePreferences = (updatedPrefs: typeof preferences) => {
  //   setPreferences(updatedPrefs)
  // }

  // const handleSaveAll = async () => {
  //   setIsEditing(false)

  //   try {
  //     const res = await fetch(`/api/modify-user/${activeUser?.email}`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         name: user?.name,
  //         email: user?.email,
  //         phone: user?.phone,
  //         dateOfBirth: user?.dateOfBirth,
  //         address: addresses?.address,
  //         city: addresses?.city,
  //         country: addresses?.country,
  //         region: addresses?.region,
  //       }),
  //     })

  //     if (!res.ok) throw new Error("User couldnt be created!")
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // // Get only the latest 3 orders for display
  // const recentOrders = orders.slice(-3).reverse()
  // console.log(addresses, "addresses")

  const session = useSession()
  const activeUser = session?.data?.user

  console.log(activeUser, "activeUser")

  const fetchUserData = useCallback(async () => {
    if (!activeUser?.email) return

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/user/${activeUser.email}`, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`)
      }

      const data = await res.json()

      if (data?.user) {
        // Set user data
        // setUser({
        //   name: data.user.name || "",
        //   email: data.user.email || "",
        //   phone: data.user.phone || "",
        //   dateOfBirth: data.user.dateOfBirth || "",
        // })

        setUser(data?.user)

        // Process orders if they exist
        if (data.user.orders?.length > 0) {
          const processedOrders = data.user.orders.map((order: any) => ({
            ...order,
            date: order.createdAt,
            items: order.products?.length || 0,
          }))

          setOrders(processedOrders)

          // Get the last order for the shipping address
          const lastOrder = processedOrders[processedOrders.length - 1]
          if (lastOrder?.shippingAddress) {
            setAddresses({
              id: lastOrder.shippingAddress.id || "",
              name: lastOrder.shippingAddress.name || "",
              email: lastOrder.shippingAddress.email || data.user.email || "",
              address: lastOrder.shippingAddress.address || "",
              city: lastOrder.shippingAddress.city || "",
              region: lastOrder.shippingAddress.region || "",
              country: lastOrder.shippingAddress.country || "",
              phone: lastOrder.shippingAddress.phone || "",
              deliveryMethod: lastOrder.shippingAddress.deliveryMethod,
              whatsappOptIn: lastOrder.shippingAddress.whatsappOptIn || false,
            })
          }
        }
      }

      // Set payment methods and preferences if available
      if (data.paymentMethods) {
        setPaymentMethods(data.paymentMethods)
      }
      if (data.preferences) {
        setPreferences(data.preferences)
      }
    } catch (err) {
      console.error("Failed to fetch user details:", err)
      setError(
        err instanceof Error ? err.message : "Failed to load profile data"
      )
    } finally {
      setIsLoading(false)
    }
  }, [activeUser?.email])

  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

  const handleToggleEdit = () => {
    setIsEditing(!isEditing)
  }

  const handleSaveUser = (updatedInfo: Partial<UserType>) => {
    setUser((prevUser) => ({ ...prevUser, ...updatedInfo }))
  }

  const handleSaveAddresses = (updatedAddress: ShippingAddress) => {
    setAddresses(updatedAddress)
  }

  const handleSavePaymentMethods = (updatedMethods: PaymentMethod[]) => {
    setPaymentMethods(updatedMethods)
  }

  const handleSavePreferences = (updatedPrefs: Preferences) => {
    setPreferences(updatedPrefs)
  }

  console.log(user, "user")

  const handleSaveAll = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/modify-user/${activeUser?.email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user?.name,
          email: user?.email,
          phone: user?.phone,
          dateOfBirth: user?.dateOfBirth,
          address: addresses?.address,
          city: addresses?.city,
          country: addresses?.country,
          region: addresses?.region,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to save changes")
      }

      const data = await res.json()
      if (data.user) {
        setUser(data.user)
      }
      setIsEditing(false)
    } catch (err) {
      console.error("Failed to save changes:", err)
      setError(err instanceof Error ? err.message : "Failed to save changes")
    } finally {
      setIsLoading(false)
    }
  }

  const recentOrders = orders.slice(-3).reverse()

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <ProfileHeader
          user={user}
          onEdit={handleToggleEdit}
          isEditing={isEditing}
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <PersonalInfoCard
              user={{
                name: user.name,
                email: user.email,
                phone: user.phone || "",
                dateOfBirth: user.dateOfBirth,
              }}
              isEditing={isEditing}
              onSave={handleSaveUser}
            />

            <AddressCard
              address={addresses}
              activeUser={user}
              isEditing={isEditing}
              onSave={handleSaveAddresses}
            />

            <PaymentMethodsCard
              paymentMethods={paymentMethods}
              orders={orders}
              isEditing={isEditing}
              onSave={handleSavePaymentMethods}
            />
          </div>

          <div className="space-y-8">
            <PreferencesCard
              preferences={preferences}
              isEditing={isEditing}
              onSave={handleSavePreferences}
            />

            <OrderHistoryCard
              orders={recentOrders}

              // viewAllLink="/account/order-history"
            />
          </div>
        </div>

        {isEditing && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-center shadow-lg">
            <Button
              onClick={handleSaveAll}
              size="lg"
              className="bg-green-500 hover:bg-green-600 px-8"
            >
              <Save className="mr-2 h-5 w-5" />
              Save All Changes
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}

export default Profile
