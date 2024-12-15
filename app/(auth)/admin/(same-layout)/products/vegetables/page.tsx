"use client"
import React, { useEffect, useState } from "react"
import VegetableDataTable from "./VegetableDataTable"

const VegetablesPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

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
  return (
    <div>
      <VegetableDataTable product={products} loading={loading} />
    </div>
  )
}

export default VegetablesPage
