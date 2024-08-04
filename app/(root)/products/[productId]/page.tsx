"use client"
import ProductDetailCard from "@/components/cards/product/ProductDetailCard"
import LoadProductDetail from "@/components/loading/LoadProductDetail"
import { Product } from "@/types"
import { useEffect, useState } from "react"

const ProductDetailPage = ({ params }: { params: { productId: string } }) => {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getProductDetail() {
      try {
        const res = await fetch(`/api/products/${params.productId}`, {
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
  }, [params.productId])

  if (loading) return <LoadProductDetail />

  return (
    <div>
      <ProductDetailCard product={product} />
    </div>
  )
}

export default ProductDetailPage
