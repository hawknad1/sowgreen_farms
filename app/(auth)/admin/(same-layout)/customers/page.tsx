import React from "react"
import CustomerDataTable from "./data-table"

const Customers = () => {
  return (
    <div className="h-screen overflow-scroll scrollbar-none">
      <CustomerDataTable />
    </div>
  )
}

export default Customers
