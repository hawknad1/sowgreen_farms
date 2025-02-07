// "use client"

// import React, { useEffect, useState } from "react"
// import { useCategoryState } from "@/hooks/state"
// import { Product } from "@/types"
// import Image from "next/image"
// import ProductCard from "@/components/cards/product/ProductCard"
// import ProductsSkeleton from "@/components/skeletons/ProductsSkeleton"
// import ProductFilter from "@/components/ProductFilter"
// import PaginationPageButton from "./PaginationPageButton"
// import { Button } from "@/components/ui/button"
// import { ArrowLongRightIcon } from "@heroicons/react/20/solid"
// import { useRouter } from "next/navigation"

// const Products = () => {
//   const [products, setProducts] = useState<Product[]>([])
//   const [loading, setLoading] = useState(true)
//   const [currentPage, setCurrentPage] = useState(1)
//   const [productsPerPage] = useState(8) // Number of products per page
//   const { selected } = useCategoryState()

//   const router = useRouter()

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

//   // Pagination logic
//   const indexOfLastProduct = currentPage * productsPerPage
//   const indexOfFirstProduct = indexOfLastProduct - productsPerPage
//   const currentProducts = products.slice(
//     indexOfFirstProduct,
//     indexOfLastProduct
//   )

//   // Change page
//   const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

//   return (
//     <div className="px-4 md:px-8 lg:px-16 xl:px-20 2xl:px-64 relative py-5 mb-11">
//       {/* Hero Section */}
//       <div className="hidden bg-[#004729] px-12 sm:flex justify-between h-80 rounded-xl mb-8">
//         <div className="w-full lg:max-w-xl flex flex-col justify-center">
//           <h1 className="text-2xl lg:text-5xl text-white font-bold lg:leading-[60px] mb-2">
//             All <span className="text-[#F9ED5D]">Fruits</span> and{" "}
//             <span className="text-[#F9ED5D]">Vegetables</span>
//             <br /> are 100% Organic
//           </h1>
//           <p className="text-white text-sm">
//             100% Pesticide and Herbicide Free. 100% Synthetic Fertilizer.
//           </p>
//           <p className="text-white text-sm">
//             100% Locally Grown & Produced In Ghana.
//           </p>
//           <Button
//             variant="ghost"
//             className="w-fit text-[#004729] flex items-center gap-x-1 mt-4 max-w-64 font-semibold text-sm bg-[#F9ED5D]"
//             onClick={() => router.push("/about")}
//           >
//             Learn More
//             <ArrowLongRightIcon className="w-5 h-5 mt-1" />
//           </Button>
//         </div>
//         <div className="relative w-[440px]">
//           <Image
//             src="/images/veg.png"
//             alt="produce"
//             fill
//             className="object-contain p-2"
//           />
//         </div>
//       </div>

//       {/* Product Filter */}
//       <ProductFilter />

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
//             totalProducts={products.length}
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
import React, { useEffect, useState } from "react"
import { useCategoryState } from "@/hooks/state"
import { Product } from "@/types"
import ProductCard from "@/components/cards/product/ProductCard"
import ProductsSkeleton from "@/components/skeletons/ProductsSkeleton"
import PaginationPageButton from "./PaginationPageButton"

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

const Products = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(8) // Number of products per page
  const [sortOption, setSortOption] = useState<string>("popularity") // Sorting state
  const { selected } = useCategoryState()

  // Fetch products based on the selected category
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

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-20 2xl:px-64 relative py-5 mb-11">
      {/* Hero Section */}
      <ProductsHeroBanner />

      {/* Product Filter and Sorting */}
      <div className="flex justify-between items-center gap-x-3 mb-8">
        <PaginationButtons />
        <div className="w-[150px]">
          <Select onValueChange={handleSortChange}>
            <SelectTrigger className="w-full font-medium rounded-lg px-4">
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
          <div className="w-full grid grid-cols-1 gap-y-8 sm:grid-cols-2 place-items-center lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-4">
            {currentProducts.map((product: Product) => (
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
  )
}

export default Products
