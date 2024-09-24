"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DataTable from "./orders/OrdersDataTable"

export const Table = () => {
  return (
    <div>
      {/* <div className="mt-5">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="flex items-center justify-between w-[390px] bg-gray-100">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
            <TabsTrigger value="in-process">In Process</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <div className=""> */}
      {/* <DataTable orders={orders} loading={loading} /> */}
      {/* </div>
          </TabsContent>
          <TabsContent value="paid">Change your password here.</TabsContent>
        </Tabs>
      </div> */}
    </div>
  )
}
