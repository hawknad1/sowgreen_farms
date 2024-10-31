import ProductsSkeleton from "@/components/skeletons/ProductsSkeleton"
import { Product } from "@/types"
import React, { useEffect, useState } from "react"
import ProductCard from "./ProductCard"
import ProductChevrons from "@/components/ProductChevrons"
import ProductCards from "./ProductCards"

const CustomersWants = () => {
  const [productList, setProductList] = useState([])

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function getProductList() {
      try {
        const res = await fetch("/api/products", {
          method: "GET",
          cache: "no-store",
        })

        if (res.ok) {
          const products = await res.json()
          setProductList(products)
          setIsLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getProductList()
  }, [])

  const message = `Customers also considered`

  return (
    // <div className="overflow-scroll">
    //   {isLoading ? (
    //     <ProductsSkeleton />
    //   ) : (
    //     <div className="flex space-x-4 px-4 py-8 w-max ">
    //       {productList.map((product: Product) => (
    //         <ProductCard data={product} key={product.id} />
    //       ))}
    //     </div>
    //   )}
    // </div>
    <ProductChevrons message={message}>
      <ProductCards />
    </ProductChevrons>
  )
}

export default CustomersWants
