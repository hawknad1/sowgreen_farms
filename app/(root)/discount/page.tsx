"use client"
import ProductCard from "@/components/cards/product/ProductCard"
import ProductsSkeleton from "@/components/skeletons/ProductsSkeleton"
import PaginationButtons from "@/components/sort/PaginationButtons"
import { useCategoryState } from "@/hooks/state"
import { useProductStore } from "@/store"
import { Product } from "@/types"
import React, { useEffect, useState } from "react"
import PaginationPageButton from "../products/PaginationPageButton"

const DiscountPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const setProductDetails = useProductStore((state) => state.setProductDetails)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(8) // Number of products per page
  const [sortOption, setSortOption] = useState<string>("popularity") // Sorting state
  const { selected } = useCategoryState()

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
          setProductDetails(products)
          setLoading(false)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    getProductList()
  }, [])

  // Sort products based on the selected option
  const sortedProducts = React.useMemo(() => {
    const sorted = [...products]
    switch (sortOption) {
      case "popularity":
        // Assuming popularity is based on a `rating` or `salesCount` property
        sorted.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
        break
      case "price-low":
        sorted.sort((a, b) => a.variants[0].price - b.variants[0].price)
        break
      case "price-high":
        sorted.sort((a, b) => b.variants[0].price - a.variants[0].price)
        break
      case "newest":
        // Assuming `createdAt` is a property indicating the product's creation date
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        break
      default:
        break
    }
    return sorted
  }, [products, sortOption])

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  )

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Handle sorting option change
  const handleSortChange = (value: string) => {
    setSortOption(value)
    setCurrentPage(1) // Reset to the first page when sorting changes
  }

  const discountedProducts = products.filter((dis) => dis?.discount > 0)

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-20 2xl:px-64 relative py-5 mb-11">
      <div className="flex items-center flex-col gap-8">
        <h4 className="text-3xl font-bold text-center">
          Enjoy discounts on organic farm produce!
        </h4>
        <div className=" w-full flex flex-col gap-5 max-w-[1080px]">
          <div className="flex items-center w-full">
            <h2 className="text-3xl font-bold">Category / </h2>
            <h2 className="text-2xl mt-1 font-bold">{selected}</h2>
          </div>
          <PaginationButtons />
        </div>

        {loading ? (
          <ProductsSkeleton />
        ) : (
          <>
            <div className="w-full grid grid-cols-1 gap-y-8 sm:grid-cols-2 place-items-center lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-4">
              {discountedProducts.map((product: Product) => (
                <ProductCard data={product} key={product.id} />
              ))}
            </div>

            {/* Pagination */}
            <PaginationPageButton
              productsPerPage={productsPerPage}
              totalProducts={sortedProducts.length}
              currentPage={currentPage}
              paginate={paginate}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default DiscountPage
