"use client"
import React from "react"
import { Cards } from "@/components/admin/Cards"
import { Table } from "@/components/admin/Table"
import { useEffect, useState } from "react"
import OrdersDataTable from "@/components/admin/orders/OrdersDataTable"

const Dashboard = () => {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [customers, setCustomers] = useState([])

  useEffect(() => {
    const OrdersData = async () => {
      try {
        const res = await fetch("/api/orders", {
          method: "GET",
          cache: "no-store",
        })
        if (res.ok) {
          const orders = await res.json()
          setOrders(orders)
          setLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    OrdersData()
  }, [])

  useEffect(() => {
    async function getProductList() {
      try {
        const res = await fetch("/api/products", {
          method: "GET",
          cache: "no-store",
        })

        if (res.ok) {
          const products = await res.json()
          setProducts(products)
          setLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getProductList()
  }, [])

  useEffect(() => {
    async function getCustomerList() {
      try {
        const res = await fetch("/api/address", {
          method: "GET",
          cache: "no-store",
        })

        if (res.ok) {
          const customers = await res.json()
          setCustomers(customers)
          setLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getCustomerList()
  }, [])

  return (
    <div className="h-screen overflow-scroll scrollbar-hide">
      <Cards
        orders={orders}
        products={products}
        loading={loading}
        customers={customers}
      />
      <OrdersDataTable orders={orders} loading={loading} />
    </div>
  )
}

export default Dashboard