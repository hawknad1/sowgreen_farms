// "use client"
// import React, { useEffect, useState, useCallback, useMemo } from "react"
// import { useCategoryState } from "@/hooks/state"
// import { Product } from "@/types"
// import ProductCard from "@/components/cards/product/ProductCard"
// import ProductsSkeleton from "@/components/skeletons/ProductsSkeleton"
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import ProductsHeroBanner from "./ProductsHeroBanner"
// import { Button } from "@/components/ui/button"
// import { ChevronRight } from "lucide-react"
// import { useInView } from "react-intersection-observer"
// import PaginationButtons from "@/components/sort/PaginationButtons"

// const Products = () => {
//   const [products, setProducts] = useState<Product[]>([])
//   const [loading, setLoading] = useState(true)
//   const [currentPage, setCurrentPage] = useState(1)
//   const [productsPerPage] = useState(12)
//   const [sortOption, setSortOption] = useState<string>("alphabetical")
//   const { selected } = useCategoryState()
//   const [ref, inView] = useInView({ threshold: 0.1 })

//   // Fetch products with lazy loading
//   const fetchProducts = useCallback(async () => {
//     setLoading(true)
//     try {
//       const endpoint =
//         selected === "All Category"
//           ? "/api/products"
//           : `/api/categories/${selected}`

//       const res = await fetch(endpoint, { cache: "no-store" })
//       const data = await res.json()
//       const products =
//         selected === "All Category" ? data : data[0]?.products || []

//       setProducts(products)
//     } catch (error) {
//       console.error("Error fetching products:", error)
//       setProducts([]) // Set products to empty array on error
//     } finally {
//       setLoading(false)
//     }
//   }, [selected])

//   useEffect(() => {
//     fetchProducts()
//   }, [fetchProducts])

//   // Sort products
//   const sortedProducts = useMemo(() => {
//     const sorted = [...products]
//     switch (sortOption) {
//       case "popularity":
//         // Use purchaseCount instead of rating since it exists in your type
//         sorted.sort((a, b) => (b?.purchaseCount || 0) - (a?.purchaseCount || 0))
//         break
//       case "price-low":
//         sorted.sort(
//           (a, b) => (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0)
//         )
//         break
//       case "price-high":
//         sorted.sort(
//           (a, b) => (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0)
//         )
//         break
//       case "newest":
//         sorted.sort(
//           (a, b) =>
//             new Date(b.createdAt)?.getTime() - new Date(a.createdAt)?.getTime()
//         )
//         break
//       case "alphabetical":
//         sorted.sort((a, b) => a.title.localeCompare(b.title))
//         break
//       default:
//         break
//     }
//     return sorted
//   }, [products, sortOption])

//   // Lazy load more products when scrolled to bottom
//   useEffect(() => {
//     if (
//       inView &&
//       !loading &&
//       currentPage * productsPerPage < sortedProducts?.length
//     ) {
//       setCurrentPage((prev) => prev + 1)
//     }
//   }, [inView, loading, currentPage, productsPerPage, sortedProducts?.length])

//   // Paginated products
//   const currentProducts = useMemo(() => {
//     return sortedProducts.slice(0, currentPage * productsPerPage)
//   }, [sortedProducts, currentPage, productsPerPage])

//   const handleSortChange = (value: string) => {
//     setSortOption(value)
//     setCurrentPage(1) // Reset page to 1 when sort option changes
//   }

//   return (
//     <div className="container mx-auto px-4 sm:px-10 py-8">
//       {/* Hero Banner */}
//       <ProductsHeroBanner />

//       {/* Filter and Sort Controls */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
//         <div className="w-full">
//           <PaginationButtons />
//         </div>
//         <div className="w-full md:w-auto">
//           <Select onValueChange={handleSortChange} value={sortOption}>
//             <SelectTrigger className="w-full md:w-48 bg-background">
//               <SelectValue placeholder="Sort By" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectGroup>
//                 <SelectItem value="alphabetical">Alphabetical</SelectItem>
//                 <SelectItem value="popularity">Popularity</SelectItem>
//                 <SelectItem value="price-low">Price: Low to High</SelectItem>
//                 <SelectItem value="price-high">Price: High to Low</SelectItem>
//                 <SelectItem value="newest">Newest Arrivals</SelectItem>
//                 {/* Added Alphabetical */}
//               </SelectGroup>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* Products Grid or No Products Message */}
//       {loading ? (
//         <ProductsSkeleton />
//       ) : (
//         <>
//           {currentProducts.length === 0 ? (
//             <div className="text-center py-10">
//               <h2 className="text-2xl font-semibold text-gray-700">
//                 No products found
//               </h2>
//               <p className="text-gray-500 mt-2">
//                 {selected !== "All Category"
//                   ? `There are no products under the "${selected}" category with the current sorting option.`
//                   : "We couldn't find any products matching your criteria."}
//               </p>
//               {selected !== "All Category" && (
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     // You might want to clear the category selection here
//                     // If useCategoryState has a method to reset, use it
//                     // For now, let's just reset sort option
//                     setSortOption("popularity")
//                   }}
//                   className="mt-4"
//                 >
//                   Clear Category Filter
//                 </Button>
//               )}
//             </div>
//           ) : (
//             <>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//                 {currentProducts?.map((product) => (
//                   <ProductCard key={product.id} data={product} />
//                 ))}
//               </div>

//               {/* Lazy Load Trigger */}
//               <div ref={ref} className="h-10 w-full my-4" />

//               {/* Pagination Controls */}
//               {currentPage * productsPerPage < sortedProducts?.length && (
//                 <div className="flex justify-center mt-8">
//                   <Button
//                     variant="outline"
//                     onClick={() => setCurrentPage((prev) => prev + 1)}
//                     className="gap-2"
//                   >
//                     Load More
//                     <ChevronRight className="h-4 w-4" />
//                   </Button>
//                 </div>
//               )}
//             </>
//           )}
//         </>
//       )}
//     </div>
//   )
// }

// export default Products

import React from "react"
import ProductsClient from "./ProductsClient"
import { getCategories } from "@/lib/utils"
import { Product } from "@/types"
import prisma from "@/lib/prismadb"

interface ProductsPageProps {
  searchParams: {
    sort?: string
    category?: string
  }
}

async function getProducts(
  sort?: string,
  category?: string
): Promise<Product[]> {
  let where: any = {}
  let orderBy: any = {}

  if (category && category !== "All Category") {
    where.categoryName = category
  }

  // ✅ Apply the same corrected sorting logic here
  switch (sort) {
    case "popularity":
      orderBy = { purchaseCount: "desc" }
      break
    case "price-low":
      orderBy = { variants: { _min: { price: "asc" } } }
      break
    case "price-high":
      orderBy = { variants: { _max: { price: "desc" } } }
      break
    case "newest":
      orderBy = { createdAt: "desc" }
      break
    default:
      orderBy = { title: "asc" }
      break
  }

  try {
    const productsFromDb = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        variants: true,
        partner: true,
        category: true,
      },
    })

    // ✅ Apply the same type casting and serialization fix here
    const serializedProducts = productsFromDb.map((product) => ({
      ...product,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      images: (product.images as { url: string; publicId: string }[]) || [],
      variants: product.variants.map((variant) => ({
        ...variant,
        createdAt: variant.createdAt.toISOString(),
        updatedAt: variant.updatedAt.toISOString(),
      })),
    }))

    return serializedProducts
  } catch (error) {
    console.error("Error fetching initial products:", error)
    return []
  }
}

// ... (The rest of your ProductsPage component)
const ProductsPage = async ({
  searchParams,
}: {
  searchParams: { sort?: string; category?: string }
}) => {
  const { sort, category } = searchParams
  const initialProducts = await getProducts(sort, category)
  const categories = await getCategories()

  return (
    <ProductsClient initialProducts={initialProducts} categories={categories} />
  )
}

export default ProductsPage
