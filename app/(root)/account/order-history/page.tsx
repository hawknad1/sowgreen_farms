"use client"

import OrderHistoryTable from "./OrderHistoryTable"

const OrderHistoryPage = () => {
  return (
    <div className="h-screen container mx-auto flex justify-center items-center">
      <div className="flex flex-col gap-y-2">
        <h2 className="text-4xl font-bold">Order History</h2>
        <p className="text-neutral-600">
          Below is a list of all orders, in reverse chronological order, that
          you have placed with Sowgreen.com
        </p>
        {/* Pass orders?.orders array if it's defined */}
        <OrderHistoryTable />
      </div>
    </div>
  )
}

export default OrderHistoryPage
