// "use client"
// import React, { useEffect, useState } from "react"
// import { useCategoryState } from "@/hooks/state"
// import { Product } from "@/types"
// import ProductCard from "@/components/cards/product/ProductCard"
// import ProductsSkeleton from "@/components/skeletons/ProductsSkeleton"
// import PaginationPageButton from "./PaginationPageButton"

// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import ProductsHeroBanner from "./ProductsHeroBanner"
// import PaginationButtons from "@/components/sort/PaginationButtons"
// import { applyDiscountToProducts } from "@/lib/applyDiscountToProduct"

// const Products = () => {
//   const [products, setProducts] = useState<Product[]>([])
//   const [loading, setLoading] = useState(true)
//   const [currentPage, setCurrentPage] = useState(1)
//   const [productsPerPage] = useState(8) // Number of products per page
//   const [sortOption, setSortOption] = useState<string>("popularity") // Sorting state
//   const { selected } = useCategoryState()

//   // Fetch products based on the selected category
//   useEffect(() => {
//     async function getProducts() {
//       setLoading(true) // Ensure loading is set before fetching
//       if (selected === "All Category") {
//         try {
//           const res = await fetch(`/api/products`, {
//             method: "GET",
//             cache: "no-store",
//           })

//           if (res.ok) {
//             const allProducts = await res.json()
//             setProducts(allProducts)
//           } else {
//             console.error("Failed to fetch all products")
//           }
//         } catch (error) {
//           console.error("Error fetching all products:", error)
//         }
//       } else if (selected) {
//         try {
//           const res = await fetch(`/api/categories/${selected}`, {
//             method: "GET",
//             cache: "no-store",
//           })

//           if (res.ok) {
//             const catProducts = await res.json()
//             const extractedProducts = catProducts[0]?.products || []
//             setProducts(extractedProducts)
//           } else {
//             console.error("Failed to fetch category products")
//           }
//         } catch (error) {
//           console.error("Error fetching category products:", error)
//         }
//       }
//       setLoading(false)
//     }

//     getProducts()
//   }, [selected])

//   // Sort products based on the selected option
//   const sortedProducts = React.useMemo(() => {
//     const sorted = [...products]
//     switch (sortOption) {
//       case "popularity":
//         // Assuming popularity is based on a `rating` or `salesCount` property
//         sorted.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
//         break
//       case "price-low":
//         sorted.sort((a, b) => a.variants[0].price - b.variants[0].price)
//         break
//       case "price-high":
//         sorted.sort((a, b) => b.variants[0].price - a.variants[0].price)
//         break
//       case "newest":
//         // Assuming `createdAt` is a property indicating the product's creation date
//         sorted.sort(
//           (a, b) =>
//             new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//         )
//         break
//       default:
//         break
//     }
//     return sorted
//   }, [products, sortOption])

//   // Pagination logic
//   const indexOfLastProduct = currentPage * productsPerPage
//   const indexOfFirstProduct = indexOfLastProduct - productsPerPage
//   const currentProducts = sortedProducts.slice(
//     indexOfFirstProduct,
//     indexOfLastProduct
//   )

//   // Change page
//   const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

//   // Handle sorting option change
//   const handleSortChange = (value: string) => {
//     setSortOption(value)
//     setCurrentPage(1) // Reset to the first page when sorting changes
//   }

//   // const checkDiscountProduct = applyDiscountToProducts(currentProducts)
//   // console.log(checkDiscountProduct, "checkDiscountProduct")

//   return (
//     <div className="px-4 md:px-8 lg:px-16 xl:px-20 2xl:px-64 relative py-5 mb-11">
//       {/* Hero Section */}
//       <ProductsHeroBanner />

//       {/* Product Filter and Sorting */}
//       <div className="flex justify-between items-center gap-x-3 mb-8">
//         <PaginationButtons />
//         <div className="w-[150px]">
//           <Select onValueChange={handleSortChange}>
//             <SelectTrigger className="w-full font-medium rounded-lg px-4">
//               <SelectValue placeholder="Sort By" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectGroup>
//                 <SelectItem value="popularity">Popularity</SelectItem>
//                 <SelectItem value="price-low">Price: Low to High</SelectItem>
//                 <SelectItem value="price-high">Price: High to Low</SelectItem>
//                 <SelectItem value="newest">Newest Arrivals</SelectItem>
//               </SelectGroup>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* Products Grid */}
//       {loading ? (
//         <ProductsSkeleton />
//       ) : (
//         <>
//           <div className="w-full grid grid-cols-1 gap-y-8 sm:grid-cols-2 place-items-center lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-4">
//             {currentProducts.map((product: Product) => (
//               <ProductCard data={product} key={product.id} />
//             ))}
//           </div>

//           {/* Pagination */}
//           <PaginationPageButton
//             productsPerPage={productsPerPage}
//             totalProducts={sortedProducts.length}
//             currentPage={currentPage}
//             paginate={paginate}
//           />
//         </>
//       )}
//     </div>
//   )
// }

// export default Products

"use client"
import React, { useEffect, useState, useCallback, useMemo } from "react"
import { useCategoryState } from "@/hooks/state"
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
import PaginationButtons from "@/components/sort/PaginationButtons"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useInView } from "react-intersection-observer"

const Products = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(12)
  const [sortOption, setSortOption] = useState<string>("popularity")
  const { selected } = useCategoryState()
  const [ref, inView] = useInView({ threshold: 0.1 })

  // Fetch products with lazy loading
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const endpoint =
        selected === "All Category"
          ? "/api/products"
          : `/api/categories/${selected}`

      const res = await fetch(endpoint, { cache: "no-store" })
      const data = await res.json()
      const products =
        selected === "All Category" ? data : data[0]?.products || []
      setProducts(products)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }, [selected])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...products]
    switch (sortOption) {
      case "popularity":
        // Use purchaseCount instead of rating since it exists in your type
        sorted.sort((a, b) => (b?.purchaseCount || 0) - (a?.purchaseCount || 0))
        break
      case "price-low":
        sorted.sort((a, b) => a.variants[0]?.price - b.variants[0]?.price)
        break
      case "price-high":
        sorted.sort((a, b) => b.variants[0]?.price - a.variants[0]?.price)
        break
      case "newest":
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt)?.getTime() - new Date(a.createdAt)?.getTime()
        )
        break
      default:
        break
    }
    return sorted
  }, [products, sortOption])

  // Lazy load more products when scrolled to bottom
  useEffect(() => {
    if (
      inView &&
      !loading &&
      currentPage * productsPerPage < sortedProducts?.length
    ) {
      setCurrentPage((prev) => prev + 1)
    }
  }, [inView, loading, currentPage, productsPerPage, sortedProducts?.length])

  // Paginated products
  const currentProducts = useMemo(() => {
    return sortedProducts.slice(0, currentPage * productsPerPage)
  }, [sortedProducts, currentPage, productsPerPage])

  const handleSortChange = (value: string) => {
    setSortOption(value)
    setCurrentPage(1)
  }

  return (
    <div className="container mx-auto px-4 sm:px-10 py-8">
      {/* Hero Banner */}
      <ProductsHeroBanner />

      {/* Filter and Sort Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="w-full">
          <PaginationButtons />
        </div>
        <div className="w-full md:w-auto">
          <Select onValueChange={handleSortChange} value={sortOption}>
            <SelectTrigger className="w-full md:w-48 bg-background">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest Arrivals</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <ProductsSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {currentProducts?.map((product) => (
              <ProductCard key={product.id} data={product} />
            ))}
          </div>

          {/* Lazy Load Trigger */}
          <div ref={ref} className="h-10 w-full my-4" />

          {/* Pagination Controls */}
          {currentPage * productsPerPage < sortedProducts?.length && (
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
    </div>
  )
}

export default Products
