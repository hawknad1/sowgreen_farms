import React from "react"
import { Cards } from "@/components/admin/Cards"
import { Table } from "@/components/admin/Table"

const Dashboard = () => {
  return (
    <div className="h-screen overflow-scroll scrollbar-hide">
      <Cards />
      <div className="">
        <Table />
      </div>
    </div>
  )
}

export default Dashboard
