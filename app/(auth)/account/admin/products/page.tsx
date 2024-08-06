import React from "react"
import Table from "./Table"
import ProductDataTable from "./data-table"

const AdminProducts = () => {
  return (
    <div className="h-screen overflow-scroll scrollbar-hide">
      <ProductDataTable />
    </div>
  )
}

export default AdminProducts
