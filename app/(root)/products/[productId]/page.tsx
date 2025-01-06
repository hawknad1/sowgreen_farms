"use client"
import CustomersWants from "@/components/cards/product/CustomersWants"
import ProductDetailCard from "@/components/cards/product/ProductDetailCard"
import LoadProductDetail from "@/components/loading/LoadProductDetail"
import { useEffect, useState } from "react"
import ProductImages from "./ProductImages"
import { Product } from "@/types"
import { Separator } from "@/components/ui/separator"
import ProductInfo from "./ProductInfo"

interface Variant {
  id: string
  productId: string
  weight: number
  price: number
  unit: string
}

// interface Product {
//   categoryName: string
//   createdAt: string
//   description: string
//   discount: number
//   id: string
//   imageUrl: string
//   isInStock: string
//   purchaseCount: number
//   quantity: number
//   title: string
//   updatedAt: string
//   variants: Variant[]
// }

interface CartItem {
  variantId: string
  productId: string
  weight: number
  price: number
  unit: string
  quantity: number
}

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
    // <div className="mx-auto max-w-6xl">
    //   <ProductDetailCard product={product} />
    //   <div className="container">
    //     <CustomersWants />
    //   </div>
    // </div>
    <div className="px-4 mt-7 mb-7 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
      {/* Images */}
      <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
        <ProductImages product={product} />
      </div>
      {/* Texts */}
      <ProductInfo product={product} />
    </div>
  )
}

export default ProductDetailPage
