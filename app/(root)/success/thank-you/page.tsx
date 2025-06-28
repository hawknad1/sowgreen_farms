"use client"

import Image from "next/image"
import OrderConfirmSkeleton from "@/components/skeletons/OrderConfirmSkeleton"
import { Separator } from "@/components/ui/separator"
import {
  useDeliveryStore,
  useOrderDataStore,
  useUserListStore,
  useUserStore,
} from "@/store"
import { useEffect, useMemo, useState } from "react"
import { OrderInfo } from "./OrderInfo"
import { ShippingAddress } from "./ShippingAddress"
import { formatCurrency } from "@/lib/utils"
import { Product } from "@/types"
import { CircleCheckBigIcon } from "lucide-react"
import { deductBalance } from "@/lib/actions/deductBalance"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

const ThankYouPage = () => {
  const [newProduct, setNewProduct] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Fetch state data
  const ordersData = useOrderDataStore((state) => state.ordersData)
  const { deliveryFee } = useDeliveryStore()
  const { user } = useUserStore()

  // Extract order details
  const {
    orderNumber,
    shippingAddress,
    products,
    total,
    subtotal,
    deliveryDate,
    deliveryMethod,
  } = ordersData || {}

  const orderTotal = total + deliveryFee
  const balance = user?.user.balance

  const {
    updatedBalance,
    updatedOrderTotal,
    remainingAmount,
    proceedToPaystack,
  } = deductBalance(balance, orderTotal)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products", {
          method: "GET",
          cache: "no-store",
        })

        if (res.ok) {
          const cartProducts = await res.json()
          setNewProduct(cartProducts)
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const productMap = Object.fromEntries(
    newProduct.map((product) => [product.id, product])
  )

  const deliveryMethodLabel = useMemo(() => {
    if (!shippingAddress?.deliveryMethod) {
      return "Not specified"
    }

    const normalizedDeliveryMethod = shippingAddress.deliveryMethod
      .trim()
      .toLowerCase()

    if (normalizedDeliveryMethod === "home delivery") {
      return `Home Delivery - ${deliveryDate}`
    }

    return `PICK UP - ${shippingAddress.deliveryMethod} - ${deliveryDate}`
  }, [shippingAddress?.deliveryMethod, deliveryDate])

  const enrichedProducts =
    products?.map((product) => ({
      ...product,
      item: {
        ...product.item,
        product: productMap[product.item.productId] || null,
      },
    })) || []

  // Format delivery fee
  const formattedDelivery = formatCurrency(deliveryFee || 0, "GHS")

  if (!ordersData || isLoading) {
    return <OrderConfirmSkeleton />
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <Badge
            variant="outline"
            className="mb-3 bg-green-50 text-green-600 border-green-200"
          >
            ORDER CONFIRMED
          </Badge>
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-3">
              <CircleCheckBigIcon className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Thank You For Your Order!
              </h1>
            </div>
            <p className="mt-3 text-gray-600 max-w-lg">
              Your order #{orderNumber} has been received and is being
              processed.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Order Details */}
          <div className="space-y-6">
            {/* Order Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Order Information</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderInfo orderNumber={orderNumber} />
                <Separator className="my-4" />
                <ShippingAddress shippingAddress={shippingAddress} />
                <Separator className="my-4" />
                <div>
                  <h3 className="font-medium mb-2">Shipping Method</h3>
                  <p className="text-sm text-gray-600">{deliveryMethodLabel}</p>
                </div>
              </CardContent>
            </Card>

            {/* Customer Support Card */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Contact our customer support for any questions about your
                    order.
                  </p>
                  <Button variant="outline" className="w-full">
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Order Items */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">
                  Ordered Items ({enrichedProducts.length})
                </h3>
                <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {enrichedProducts.length ? (
                    enrichedProducts.map((order) => (
                      <div
                        key={order?.item?.productId}
                        className="flex gap-4 items-start"
                      >
                        <div className="relative h-16 w-16 flex-shrink-0 bg-gray-100 rounded-md p-1">
                          <Image
                            src={
                              order?.item?.product?.imageUrl ||
                              order?.item?.product?.images[0]?.url
                            }
                            alt={order?.item?.product?.title}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">
                            {order?.item?.product?.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatCurrency(order?.item?.price, "GHS")}
                            {order?.item?.weight && (
                              <span className="ml-1">
                                {` / ${
                                  order?.item?.weight < 1
                                    ? order?.item?.weight * 1000
                                    : order?.item?.weight
                                }${order?.item?.unit}`}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-medium">
                            Qty: {order?.item?.quantity}
                          </span>
                          <span className="text-sm font-semibold mt-1">
                            {formatCurrency(parseFloat(order?.total), "GHS")}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No products available.
                    </p>
                  )}
                </div>
              </div>

              {/* Order Totals */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(total || 0, "GHS")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Delivery Fee</span>
                  <span className="text-sm font-medium">
                    {formattedDelivery}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={`text-sm ${
                      balance >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {balance >= 0 ? "Credit Balance" : "Balance Due"}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      balance >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatCurrency(Math.abs(balance), "GHS")}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-base font-medium">Total</span>
                  <span className="text-base font-medium">
                    {formatCurrency(orderTotal, "GHS")}
                  </span>
                </div>
                <div className="flex justify-between rounded-md">
                  <span className="text-base font-semibold text-red-600">
                    Total Due
                  </span>
                  <span className="text-base font-semibold text-red-600">
                    {balance > 0 || balance < 0
                      ? formatCurrency(updatedOrderTotal, "GHS")
                      : formatCurrency(orderTotal, "GHS")}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 grid grid-cols-1 gap-3">
                <Button
                  variant="sowgreen"
                  onClick={() => router.push("/products")}
                  className="w-full"
                >
                  Continue Shopping
                </Button>
                <Button
                  onClick={() => router.push("/account/order-history")}
                  variant="outline"
                  className="w-full"
                >
                  View Order History
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ThankYouPage
