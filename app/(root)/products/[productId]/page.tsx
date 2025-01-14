"use client"
import { useEffect, useState } from "react"
import { Product } from "@/types"

import ProductInfo from "./ProductInfo"
import CustomersWants from "@/components/cards/product/CustomersWants"
import LoadProductDetail from "@/components/loading/LoadProductDetail"
import ProductImages from "./ProductImages"

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
      <div className="px-4 mt-7 mb-7 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
        {/* Images */}
        <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
          <ProductImages product={product} />
        </div>
        {/* Texts */}
        <ProductInfo product={product} />
      </div>
      {/* <CustomersWants /> */}
    </div>
  )
}

export default ProductDetailPage
