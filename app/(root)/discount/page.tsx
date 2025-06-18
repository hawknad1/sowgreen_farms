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

// "use client"
// import ProductCard from "@/components/cards/product/ProductCard"
// import ProductsSkeleton from "@/components/skeletons/ProductsSkeleton"
// import PaginationButtons from "@/components/sort/PaginationButtons"
// import { useCategoryState } from "@/hooks/state"
// import { useProductStore } from "@/store"
// import { Product } from "@/types"
// import React, { useEffect, useState, useCallback } from "react"
// import { motion } from "framer-motion"
// import dynamic from "next/dynamic"

// // Lazy load heavy components
// const LazyProductCard = dynamic(
//   () => import("@/components/cards/product/ProductCard"),
//   {
//     loading: () => (
//       <div className="w-full h-64 bg-gray-100 rounded-lg animate-pulse" />
//     ),
//   }
// )

// const DiscountPage = () => {
//   const [products, setProducts] = useState<Product[]>([])
//   const setProductDetails = useProductStore((state) => state.setProductDetails)
//   const [loading, setLoading] = useState(true)
//   const [currentPage, setCurrentPage] = useState(1)
//   const [productsPerPage] = useState(8)
//   const [sortOption, setSortOption] = useState<string>("popularity")
//   const { selected } = useCategoryState()
//   const [isFetching, setIsFetching] = useState(false)
//   const [hasMore, setHasMore] = useState(true)
//   const [allProductsLoaded, setAllProductsLoaded] = useState(false)

//   const fetchProducts = useCallback(async () => {
//     if (isFetching || allProductsLoaded) return
//     setIsFetching(true)

//     try {
//       const res = await fetch(
//         `/api/products?page=${currentPage}&limit=${productsPerPage}`,
//         {
//           method: "GET",
//           cache: "no-store",
//         }
//       )

//       if (res.ok) {
//         const newProducts = await res.json()
//         if (newProducts.length === 0) {
//           setAllProductsLoaded(true)
//           setHasMore(false)
//           return
//         }

//         setProducts((prev) => {
//           // Filter out duplicates before adding new products
//           const existingIds = new Set(prev.map((p) => p.id))
//           const uniqueNewProducts = newProducts.filter(
//             (p: Product) => !existingIds.has(p.id)
//           )
//           return [...prev, ...uniqueNewProducts]
//         })

//         // Update product details in store without duplicates
//         setProductDetails((prev: Product[]) => {
//           const existingIds = new Set(prev.map((p) => p.id))
//           const uniqueNewProducts = newProducts.filter(
//             (p: Product) => !existingIds.has(p.id)
//           )
//           return [...prev, ...uniqueNewProducts]
//         })

//         setHasMore(newProducts.length === productsPerPage)
//       }
//     } catch (error) {
//       console.error("Error fetching products:", error)
//     } finally {
//       setIsFetching(false)
//       setLoading(false)
//     }
//   }, [
//     currentPage,
//     productsPerPage,
//     isFetching,
//     allProductsLoaded,
//     setProductDetails,
//   ])

//   useEffect(() => {
//     fetchProducts()
//   }, [fetchProducts])

//   // Sort products based on the selected option
//   const sortedProducts = React.useMemo(() => {
//     const sorted = [...products]
//     switch (sortOption) {
//       case "popularity":
//         sorted.sort(
//           (a: Product, b: Product) => (b.rating || 0) - (a.rating || 0)
//         )
//         break
//       case "price-low":
//         sorted.sort((a, b) => a.variants[0].price - b.variants[0].price)
//         break
//       case "price-high":
//         sorted.sort((a, b) => b.variants[0].price - a.variants[0].price)
//         break
//       case "newest":
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

//   // Filter discounted products
//   const discountedProducts = React.useMemo(() => {
//     return sortedProducts.filter((product) => product?.discount > 0)
//   }, [sortedProducts])

//   // Pagination logic - show products up to current page
//   const currentProducts = discountedProducts.slice(
//     0,
//     currentPage * productsPerPage
//   )

//   // Handle scroll for infinite loading
//   useEffect(() => {
//     const handleScroll = () => {
//       if (
//         window.innerHeight + document.documentElement.scrollTop <
//           document.documentElement.offsetHeight - 100 ||
//         isFetching ||
//         !hasMore
//       ) {
//         return
//       }
//       setCurrentPage((prev) => prev + 1)
//     }

//     window.addEventListener("scroll", handleScroll)
//     return () => window.removeEventListener("scroll", handleScroll)
//   }, [isFetching, hasMore])

//   // Handle sorting option change
//   const handleSortChange = (value: string) => {
//     setSortOption(value)
//     setCurrentPage(1)
//     setProducts([])
//     setAllProductsLoaded(false)
//   }

//   return (
//     <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 2xl:px-32 py-8 mb-11">
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="flex flex-col items-center gap-8"
//       >
//         <div className="text-center space-y-2">
//           <motion.h4
//             initial={{ y: -20 }}
//             animate={{ y: 0 }}
//             className="text-3xl md:text-4xl font-bold text-gray-900"
//           >
//             Enjoy discounts on organic farm produce!
//           </motion.h4>
//           <p className="text-gray-600 max-w-2xl mx-auto">
//             Discover amazing deals on fresh, organic products straight from
//             local farms
//           </p>
//         </div>

//         <div className="w-full max-w-7xl space-y-6">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//             <div className="flex items-center">
//               <h2 className="text-2xl font-bold text-gray-800">Category / </h2>
//               <h2 className="text-xl md:text-2xl font-semibold text-sowgren_Color ml-1">
//                 {selected || "All Discounts"}
//               </h2>
//             </div>

//             <div className="w-full sm:w-auto">
//               <PaginationButtons
//                 onSortChange={handleSortChange}
//                 currentSort={sortOption}
//               />
//             </div>
//           </div>

//           {loading ? (
//             <ProductsSkeleton />
//           ) : (
//             <>
//               {discountedProducts.length === 0 ? (
//                 <div className="text-center py-12">
//                   <h3 className="text-xl font-medium text-gray-700">
//                     No discounted products available at the moment
//                   </h3>
//                   <p className="text-gray-500 mt-2">
//                     Check back later for new deals!
//                   </p>
//                 </div>
//               ) : (
//                 <>
//                   <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//                     {currentProducts.map((product: Product, index) => (
//                       <motion.div
//                         key={`${product.id}-${index}`}
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: index * 0.05 }}
//                       >
//                         <LazyProductCard data={product} />
//                       </motion.div>
//                     ))}
//                   </div>

//                   {isFetching && (
//                     <div className="flex justify-center mt-8">
//                       <div className="w-8 h-8 border-4 border-sowgren_Color border-t-transparent rounded-full animate-spin"></div>
//                     </div>
//                   )}

//                   {!hasMore && !loading && (
//                     <div className="text-center py-6 text-gray-500">
//                       You've reached the end of products
//                     </div>
//                   )}
//                 </>
//               )}
//             </>
//           )}
//         </div>
//       </motion.div>
//     </div>
//   )
// }

// export default DiscountPage
