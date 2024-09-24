"use client"
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, Carrot } from "lucide-react"
import { useCustomerStore, useProductStore } from "@/store"
import { Order, Product, ShippingAddress } from "@/types"

interface OrdersProps {
  loading: boolean
  orders: Order[]
  products: Product[]
  customers: ShippingAddress[]
}

export const Cards = ({
  orders,
  loading,
  products,
  customers,
}: OrdersProps) => {


  return (
    <div className="grid gap-4 lg:gap-3 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <Card x-chunk="dashboard-01-chunk-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$45,231.89</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500 font-semibold"> +20.1% </span>from
            last month
          </p>
        </CardContent>
      </Card>

      <Card x-chunk="dashboard-01-chunk-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {/* Ensure customerDetails is not null or undefined */}
          <div className="text-2xl font-bold">
            {customers ? customers.length : 0}
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500 font-semibold"> +20.1% </span>from
            last month
          </p>
        </CardContent>
      </Card>

      <Card x-chunk="dashboard-01-chunk-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Transactions
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">803</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-red-500 font-semibold"> -20.1% </span>from
            last month
          </p>
        </CardContent>
      </Card>

      <Card x-chunk="dashboard-01-chunk-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Carrot className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {products ? products?.length : 0}
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500 font-semibold"> +20.1% </span>from
            last month
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
