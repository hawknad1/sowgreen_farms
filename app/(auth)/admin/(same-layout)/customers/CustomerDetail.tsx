import { CustomerDetailType } from "@/types"
import React from "react"

interface CustomerProps {
  customerData: any
}

const CustomerDetail = ({ customerData }: CustomerProps) => {
  return (
    <div className="p-4 ">
      <div className="border border-neutral-300 p-2 rounded-md">
        <h2>Customer Details</h2>
        <div>
          <p>{customerData?.name}</p>
        </div>
      </div>
      <div className="p-2">
        <h2 className="font-bold text-lg">Order History</h2>
      </div>
    </div>
  )
}

export default CustomerDetail
