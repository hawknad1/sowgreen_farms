// "use client"

// import React, { useEffect, useState } from "react"
// import { useCategoryState } from "@/hooks/state"
// import { Product } from "@/types"

// import Image from "next/image"
// import ProductCard from "@/components/cards/product/ProductCard"
// import ProductsSkeleton from "@/components/skeletons/ProductsSkeleton"
// import PaginationButtons from "@/components/sort/PaginationButtons"
// import ProductFilter from "@/components/ProductFilter"

// const Products = () => {
//   const [products, setProducts] = useState<Product[]>([])
//   const [loading, setLoading] = useState(true)
//   const { selected } = useCategoryState()

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

//   return (
//     <div className="px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-64 relative py-5 mb-11">
//       <div className="hidden bg-emerald-400/25 px-4 sm:flex justify-between h-64 rounded-md">
//         <div className="w-2/3 flex flex-col items-center justify-center gap-8">
//           <h1 className="text-4xl font-semibold leading-[48px] text-gray-700">
//             All <span className="">Fruits</span> and <span>Vegetables</span>
//             <br /> are 100% Organic
//           </h1>
//         </div>
//         <div className="relative w-1/3">
//           <Image
//             src="/images/fresh.png"
//             alt="produce"
//             fill
//             className="object-contain"
//           />
//         </div>
//       </div>
//       <ProductFilter />
//       {loading ? (
//         <ProductsSkeleton />
//       ) : (
//         <div className="grid lg:grid-cols-4 gap-6 ">
//           {products.map((product: Product) => (
//             <ProductCard data={product} key={product.id} />
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// export default Products

"use client"

import React, { useEffect, useState } from "react"
import { useCategoryState } from "@/hooks/state"
import { Product } from "@/types"
import Image from "next/image"
import ProductCard from "@/components/cards/product/ProductCard"
import ProductsSkeleton from "@/components/skeletons/ProductsSkeleton"
import ProductFilter from "@/components/ProductFilter"
import PaginationPageButton from "./PaginationPageButton"

const Products = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(8) // Number of products per page
  const { selected } = useCategoryState()

  useEffect(() => {
    async function getProducts() {
      setLoading(true) // Ensure loading is set before fetching
      if (selected === "All Category") {
        try {
          const res = await fetch(`/api/products`, {
            method: "GET",
            cache: "no-store",
          })

          if (res.ok) {
            const allProducts = await res.json()
            setProducts(allProducts)
          } else {
            console.error("Failed to fetch all products")
          }
        } catch (error) {
          console.error("Error fetching all products:", error)
        }
      } else if (selected) {
        try {
          const res = await fetch(`/api/categories/${selected}`, {
            method: "GET",
            cache: "no-store",
          })

          if (res.ok) {
            const catProducts = await res.json()
            const extractedProducts = catProducts[0]?.products || []
            setProducts(extractedProducts)
          } else {
            console.error("Failed to fetch category products")
          }
        } catch (error) {
          console.error("Error fetching category products:", error)
        }
      }
      setLoading(false)
    }

    getProducts()
  }, [selected])

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  )

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-64 relative py-5 mb-11">
      {/* Hero Section */}
      <div className="hidden bg-emerald-400/25 px-4 sm:flex justify-between h-64 rounded-md mb-8">
        <div className="w-2/3 flex flex-col items-center justify-center gap-8">
          <h1 className="text-4xl font-semibold leading-[48px] text-gray-700">
            All <span className="text-emerald-600">Fruits</span> and{" "}
            <span className="text-emerald-600">Vegetables</span>
            <br /> are 100% Organic
          </h1>
        </div>
        <div className="relative w-1/3">
          <Image
            src="/images/fresh.png"
            alt="produce"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Product Filter */}
      <ProductFilter />

      {/* Products Grid */}
      {loading ? (
        <ProductsSkeleton />
      ) : (
        <>
          <div className="w-full grid grid-cols-1 gap-y-8 sm:grid-cols-2 place-items-center lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-4">
            {currentProducts.map((product: Product) => (
              <ProductCard data={product} key={product.id} />
            ))}
          </div>

          {/* Pagination */}
          <PaginationPageButton
            productsPerPage={productsPerPage}
            totalProducts={products.length}
            currentPage={currentPage}
            paginate={paginate}
          />
        </>
      )}
    </div>
  )
}

export default Products
