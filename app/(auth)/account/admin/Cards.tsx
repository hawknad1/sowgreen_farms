import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, Carrot } from "lucide-react"

export const Cards = () => {
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
          <div className="text-2xl font-bold">5,231</div>
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
          <div className="text-2xl font-bold">931</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500 font-semibold"> +20.1% </span>from
            last month
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
