// "use client"
// import ProductCard from "@/components/cards/product/ProductCard"
// import ProductsSkeleton from "@/components/skeletons/ProductsSkeleton"
// import { Product, TCategory } from "@/types"
// import Image from "next/image"
// import React, { useEffect, useState, useCallback } from "react"

// type Props = {
//   searchParams: {
//     q: string
//   }
// }

// const Category = ({ searchParams: { q } }: Props) => {
//   const [productsByCategory, setProductsByCategory] = useState<TCategory[]>([])
//   const [error, setError] = useState<string | null>(null)
//   const [loading, setLoading] = useState(true)

//   const fetchProductsByCategory = useCallback(async (catName: string) => {
//     try {
//       const res = await fetch(`/api/categories/${catName}`)
//       if (!res.ok) throw new Error(`Failed to load products: ${res.statusText}`)

//       const data = await res.json()
//       setProductsByCategory(data)
//     } catch (err) {
//       setError("Failed to fetch products. Please try again later.")
//       console.error("Fetch error:", err)
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   useEffect(() => {
//     if (q) {
//       fetchProductsByCategory(q)
//     }
//   }, [q, fetchProductsByCategory])

//   const catProducts = productsByCategory[0]?.products || []

//   if (error) {
//     return <div className="text-red-500 text-center">Error: {error}</div>
//   }

//   return (
//     <main className="container mx-auto py-8 flex-1">
//       {catProducts.length > 0 && (
//         <div className="mb-8">
//           <h3 className="text-2xl font-bold text-center w-full">
//             Showing results for <span>{q.toLowerCase()}</span>
//           </h3>
//         </div>
//       )}

//       {loading ? (
//         <ProductsSkeleton />
//       ) : catProducts.length ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-8 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8 md:gap-x-8">
//           {catProducts.map((product: Product) => (
//             <ProductCard key={product.id} data={product} />
//           ))}
//         </div>
//       ) : (
//         <div className="container mx-auto py-8 flex-1 h-screen w-full">
//           <div className="flex flex-col items-center mt-4 ">
//             <p className="text-3xl font-bold">No available products for {q}</p>
//             <p className="text-gray-500">
//               We didn’t find what you need, but our farmers are on it!{" "}
//             </p>
//             <Image
//               src="/images/harvester.png"
//               alt={q}
//               height={600}
//               width={700}
//               className="h-[500px] w-[500px] object-contain"
//             />
//           </div>
//         </div>
//       )}
//     </main>
//   )
// }

// export default Category

"use client"
import ProductCard from "@/components/cards/product/ProductCard"
import ProductsSkeleton from "@/components/skeletons/ProductsSkeleton"
import { Product, TCategory } from "@/types"
import Image from "next/image"
import React, { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

type Props = {
  searchParams: {
    q: string
  }
}

const Category = ({ searchParams: { q } }: Props) => {
  const [productsByCategory, setProductsByCategory] = useState<TCategory[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([])
  const [page, setPage] = useState(1)
  const router = useRouter()

  const productsPerPage = 8 // Adjust based on your needs

  const fetchProductsByCategory = useCallback(async (catName: string) => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/categories/${catName}`)
      if (!res.ok) throw new Error(`Failed to load products: ${res.statusText}`)

      const data = await res.json()
      setProductsByCategory(data)

      // Reset pagination when category changes
      setPage(1)
    } catch (err) {
      setError("Failed to fetch products. Please try again later.")
      console.error("Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const catProducts = productsByCategory[0]?.products || []
  const hasMoreProducts = visibleProducts.length < catProducts.length

  // Sort products alphabetically by name
  const sortProductsAlphabetically = useCallback((products: Product[]) => {
    return [...products].sort((a, b) =>
      a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
    )
  }, [])

  // Load more products when page changes
  useEffect(() => {
    if (catProducts.length > 0) {
      const sortedProducts = sortProductsAlphabetically(catProducts)
      const newVisibleProducts = sortedProducts.slice(0, page * productsPerPage)
      setVisibleProducts(newVisibleProducts)
    }
  }, [page, catProducts, sortProductsAlphabetically])

  useEffect(() => {
    if (q) {
      fetchProductsByCategory(q)
    }
  }, [q, fetchProductsByCategory])

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8 flex-1 min-h-[70vh] flex flex-col items-center justify-center">
        <div className="max-w-md text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-500">
            Error Loading Products
          </h2>
          <p className="text-gray-600">{error}</p>
          <Button onClick={() => fetchProductsByCategory(q)}>Retry</Button>
        </div>
      </main>
    )
  }

  const handleLoadMore = () => {
    setPage((prev) => prev + 1)
  }

  return (
    <main className="container mx-auto px-4 py-8 flex-1">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-1"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </Button>

      {loading ? (
        <>
          <div className="mb-8 animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded mx-auto"></div>
          </div>
          <ProductsSkeleton />
        </>
      ) : catProducts.length ? (
        <>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">
              Showing results for{" "}
              {q.charAt(0).toUpperCase() + q.slice(1).toLowerCase()}
            </h1>
            <p className="text-gray-500">
              {catProducts.length}{" "}
              {catProducts.length === 1 ? "product" : "products"} available
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleProducts.map((product: Product) => (
              <ProductCard key={product.id} data={product} />
            ))}
          </div>

          {hasMoreProducts && (
            <div className="mt-10 text-center">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                className="px-8 py-4"
              >
                Load More Products
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 md:py-24">
          <div className="max-w-md text-center space-y-4 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              No products found for "{q}"
            </h2>
            <p className="text-gray-500 text-lg">
              We didn't find what you're looking for, but our farmers are
              working on it!
            </p>
          </div>
          <div className="relative w-full max-w-2xl aspect-square">
            <Image
              src="/images/harvester.png"
              alt="No products found"
              fill
              className="object-contain"
              priority
            />
          </div>
          <Button
            variant="outline"
            className="mt-8"
            onClick={() => router.push("/products")}
          >
            Browse All Products
          </Button>
        </div>
      )}
    </main>
  )
}

export default Category
