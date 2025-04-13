"use client"
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, ChevronRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Order } from "@/types"
import { useRouter } from "next/navigation"

interface OrderHistoryCardProps {
  orders: Order[]
}

const OrderHistoryCard = ({ orders }: OrderHistoryCardProps) => {
  const router = useRouter()
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "canceled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "GHS",
    }).format(amount)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingBag className="mr-2 h-5 w-5 text-green-500" />
          Order History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="space-y-2 mb-3 md:mb-0">
                  <div className="flex items-center gap-2 text-sm">
                    <h3 className="font-medium">
                      {/* Order #{order.id.substring(0, 8)} */}
                      {order.orderNumber}
                    </h3>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {formatDate(order?.createdAt)}
                    <span className="mx-2">•</span>
                    <span>
                      {order.items} {order.items === 1 ? "item" : "items"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-sm gap-4 w-full md:w-auto">
                  <span className="font-medium">
                    {formatCurrency(order.total)}
                  </span>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    Details
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="pt-2 text-center">
              <Button
                variant="outline"
                onClick={() => router.push("/account/order-history")}
                className="w-full md:w-auto"
              >
                View All Orders
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-2" />
            <p>No order history yet.</p>
            <Button variant="outline" className="mt-4">
              Start Shopping
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default OrderHistoryCard
