"use client"
import AdminProductDetailCard from "@/components/admin/AdminProductDetailCard"
import { Product } from "@/types"
import React, { useEffect, useState } from "react"

const AdminProductDetail = ({ params }: { params: { id: string } }) => {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getProductDetail() {
      try {
        const res = await fetch(`/api/products/${params.id}`, {
          method: "GET",
          cache: "no-store",
        })

        if (res.ok) {
          const productDetail = await res.json()
          setProduct(productDetail)
          setLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getProductDetail()
  }, [params.id])

  //   if (loading) return <LoadProductDetail />

  return (
    <div className="my-5">
      <AdminProductDetailCard product={product} />
    </div>
  )
}

export default AdminProductDetail
