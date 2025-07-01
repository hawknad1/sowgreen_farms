"use client"
import React, { useState, useEffect, useMemo, useCallback } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Product } from "@/types"
import ProductCard from "@/components/cards/product/ProductCard"
import ProductsSkeleton from "@/components/skeletons/ProductsSkeleton"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ProductsHeroBanner from "./ProductsHeroBanner"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { useInView } from "react-intersection-observer"
import PaginationButtons from "@/components/sort/PaginationButtons"

interface ProductsClientProps {
  initialProducts: Product[]
  categories: any[]
}

const ProductsClient = ({
  initialProducts,
  categories,
}: ProductsClientProps) => {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(12)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const sortOption = searchParams.get("sort") || "alphabetical"
  // ✅ ADD a useMemo hook for client-side sorting
  const sortedProducts = useMemo(() => {
    // The server already handles other sorting types
    // We only need to run this logic for price sorting
    if (sortOption === "price-low" || sortOption === "price-high") {
      const sorted = [...products]
      if (sortOption === "price-low") {
        sorted.sort(
          (a, b) => (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0)
        )
      } else if (sortOption === "price-high") {
        sorted.sort(
          (a, b) => (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0)
        )
      }
      return sorted
    }
    // For all other cases, return the products as they came from the server
    return products
  }, [products, sortOption])

  const { ref, inView } = useInView({ threshold: 0.1 })

  // ✅ THIS IS THE MAIN FIX - ROBUST DATA FETCHING
  const fetchClientProducts = useCallback(async () => {
    // Don't re-fetch for the initial server-rendered state
    if (!searchParams.toString()) {
      setProducts(initialProducts)
      return
    }

    setLoading(true)
    try {
      const params = new URLSearchParams(searchParams.toString())
      const res = await fetch(`/api/products?${params.toString()}`, {
        cache: "no-store",
      })

      // Check if the request was successful
      if (!res.ok) {
        // Log the server's error message for debugging
        const errorData = await res.json()
        throw new Error(errorData.error || `Error: ${res.status}`)
      }

      const data = await res.json()

      // Ensure data is an array before setting it
      if (Array.isArray(data)) {
        setProducts(data)
      } else {
        // If data is not an array, something is still wrong with the API response
        console.error("API did not return an array:", data)
        setProducts([]) // Set to empty array to prevent crash
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
      setProducts([]) // Set to an empty array on any error to prevent crashing
    } finally {
      setLoading(false)
      setCurrentPage(1) // Reset pagination on filter/sort change
    }
  }, [searchParams, initialProducts])

  useEffect(() => {
    fetchClientProducts()
  }, [fetchClientProducts])

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", value)
    router.push(`${pathname}?${params.toString()}`)
  }

  useEffect(() => {
    if (inView && !loading && currentPage * productsPerPage < products.length) {
      setCurrentPage((prev) => prev + 1)
    }
  }, [inView, loading, products.length, currentPage, productsPerPage])

  //   const currentProducts = useMemo(() => {
  //     // This check provides a final layer of safety
  //     if (!Array.isArray(products)) return []
  //     return products.slice(0, currentPage * productsPerPage)
  //   }, [products, currentPage, productsPerPage])

  const currentProducts = useMemo(() => {
    if (!Array.isArray(sortedProducts)) return [] // Use the new sortedProducts
    return sortedProducts.slice(0, currentPage * productsPerPage)
  }, [sortedProducts, currentPage, productsPerPage])

  return (
    <div className="container mx-auto px-4 sm:px-10 py-8">
      <ProductsHeroBanner />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="w-full">
          <PaginationButtons categories={categories} />
        </div>
        <div className="w-full md:w-auto">
          <Select onValueChange={handleSortChange} value={sortOption}>
            <SelectTrigger className="w-full md:w-48 bg-background">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest Arrivals</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <ProductsSkeleton />
      ) : (
        <>
          {currentProducts.length === 0 ? (
            <div className="text-center py-10">
              <h2 className="text-2xl font-semibold text-gray-700">
                No products found
              </h2>
              <p className="text-gray-500 mt-2">
                We couldn't find any products matching your criteria.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {currentProducts.map((product) => (
                  <ProductCard key={product.id} data={product} />
                ))}
              </div>

              <div ref={ref} className="h-10 w-full my-4" />

              {currentPage * productsPerPage < products.length && (
                <div className="flex justify-center mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="gap-2"
                  >
                    Load More
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default ProductsClient
