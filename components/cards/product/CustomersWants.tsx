"use client"

import React, { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ProductCards from "./ProductCards" // This is your wrapper component
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Product } from "@/types"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

// interface CustomersWantsProps {
//   message?: string
//   // FIX: Add a default empty array to the prop for ultimate safety
//   initialProducts?: Product[]
// }

// const CustomersWants = ({
//   message,
//   initialProducts = [],
// }: CustomersWantsProps) => {
//   const [canScrollLeft, setCanScrollLeft] = useState(false)
//   const [canScrollRight, setCanScrollRight] = useState(true)
//   const scrollContainerRef = useRef<HTMLDivElement>(null)

//   const [products, setProducts] = useState(initialProducts)
//   const [loading, setLoading] = useState(false)

//   // Refetch when component mounts (client-side)
//   useEffect(() => {
//     async function refetchProducts() {
//       setLoading(true)
//       try {
//         const res = await fetch("/api/products/popular")
//         const newProducts = await res.json()
//         setProducts(newProducts)
//       } catch (error) {
//         console.error("Failed to refetch products:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     refetchProducts()
//   }, [])

//   const checkScrollPosition = () => {
//     if (scrollContainerRef.current) {
//       const { scrollLeft, scrollWidth, clientWidth } =
//         scrollContainerRef.current
//       setCanScrollLeft(scrollLeft > 0)
//       // Add a small buffer of 1px for precision issues in some browsers
//       setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
//     }
//   }

//   useEffect(() => {
//     const container = scrollContainerRef.current
//     if (container) {
//       // Run the check after the component has mounted and laid out
//       const timer = setTimeout(() => checkScrollPosition(), 100)
//       container.addEventListener("scroll", checkScrollPosition)

//       return () => {
//         clearTimeout(timer)
//         container.removeEventListener("scroll", checkScrollPosition)
//       }
//     }
//   }, [products]) // Depend on initialProducts to re-run if it changes

//   const handlePrev = () => {
//     if (scrollContainerRef.current) {
//       const cardWidth =
//         scrollContainerRef.current.querySelector('div[class*="w-["]')
//           ?.clientWidth || 280
//       scrollContainerRef.current.scrollBy({
//         left: -cardWidth - 16, // 16 is the gap between cards
//         behavior: "smooth",
//       })
//     }
//   }

//   const handleNext = () => {
//     if (scrollContainerRef.current) {
//       const cardWidth =
//         scrollContainerRef.current.querySelector('div[class*="w-["]')
//           ?.clientWidth || 280
//       scrollContainerRef.current.scrollBy({
//         left: cardWidth + 16, // 16 is the gap between cards
//         behavior: "smooth",
//       })
//     }
//   }

//   // If the server passes no products, display a message instead of an empty space.
//   if (!products || products.length === 0) {
//     return (
//       <div className="relative">
//         <Card className="border-0 shadow-none">
//           <CardHeader className="pb-2 p-0 py-4">
//             <CardTitle className="text-xl ...">{message}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-gray-500 mt-4">
//               No products to display at the moment.
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <>
//       {loading && <p>Loading fresh products...</p>}
//       <div className="relative">
//         <Card className="border-0 shadow-none">
//           <CardHeader className="pb-2 p-0 py-4">
//             <div className="flex justify-between items-center ">
//               <CardTitle className="text-xl flex items-center text-sowgren_Color self-center sm:text-2xl md:text-3xl font-bold">
//                 {message}
//               </CardTitle>
//               {/* FIX: Check initialProducts.length directly */}
//               {products.length > 4 && (
//                 <div className="flex gap-2">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className={cn("...")}
//                     onClick={handlePrev}
//                     disabled={!canScrollLeft}
//                   >
//                     <ChevronLeft className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className={cn("...")}
//                     onClick={handleNext}
//                     disabled={!canScrollRight}
//                   >
//                     <ChevronRight className="h-4 w-4" />
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </CardHeader>
//           <CardContent className="pt-0 px-0">
//             <div className="relative">
//               <div
//                 ref={scrollContainerRef}
//                 className="overflow-x-auto pb-4 scrollbar-hide"
//               >
//                 <div className="flex gap-4 w-max">
//                   {/* FIX: Map over the initialProducts prop directly */}
//                   {products.map((product) => (
//                     <div key={product.id} className="w-[240px]">
//                       <ProductCards data={product} />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </>
//   )
// }

// export default CustomersWants

interface CustomersWantsProps {
  message?: string
  initialProducts?: Product[]
  showSkeleton?: boolean // Add this prop
}

const CustomersWants = ({
  message,
  initialProducts = [],
  showSkeleton = false, // Default to false
}: CustomersWantsProps) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const [products, setProducts] = useState(initialProducts)
  const [loading, setLoading] = useState(showSkeleton) // Initialize with showSkeleton

  // Refetch when component mounts (client-side)
  useEffect(() => {
    async function refetchProducts() {
      setLoading(true)
      try {
        const res = await fetch("/api/products/popular")
        const newProducts = await res.json()
        setProducts(newProducts)
      } catch (error) {
        console.error("Failed to refetch products:", error)
      } finally {
        setLoading(false)
      }
    }

    refetchProducts()
  }, [])

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      // Add a small buffer of 1px for precision issues in some browsers
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      // Run the check after the component has mounted and laid out
      const timer = setTimeout(() => checkScrollPosition(), 100)
      container.addEventListener("scroll", checkScrollPosition)

      return () => {
        clearTimeout(timer)
        container.removeEventListener("scroll", checkScrollPosition)
      }
    }
  }, [products]) // Depend on initialProducts to re-run if it changes

  const handleNext = () => {
    if (scrollContainerRef.current) {
      const cardWidth =
        scrollContainerRef.current.querySelector('div[class*="w-["]')
          ?.clientWidth || 280
      scrollContainerRef.current.scrollBy({
        left: cardWidth + 16, // 16 is the gap between cards
        behavior: "smooth",
      })
    }
  }

  const handlePrev = () => {
    if (scrollContainerRef.current) {
      const cardWidth =
        scrollContainerRef.current.querySelector('div[class*="w-["]')
          ?.clientWidth || 280
      scrollContainerRef.current.scrollBy({
        left: -cardWidth - 16, // 16 is the gap between cards
        behavior: "smooth",
      })
    }
  }

  // Skeleton loader component
  const SkeletonLoader = () => (
    <div className="relative">
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-2 p-0 py-4">
          <div className="flex justify-between items-center">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="flex gap-2">
              <div className="h-9 w-9 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-9 w-9 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-0">
          <div className="flex gap-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="w-[240px]">
                <div className="border rounded-lg p-4">
                  <div className="h-40 bg-gray-200 rounded mb-3 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Show skeleton while loading
  if (loading) {
    return <SkeletonLoader />
  }

  // Rest of your existing component...
  if (!products || products.length === 0) {
    return (
      <div className="relative">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-2 p-0 py-4">
            <CardTitle className="text-xl ...">{message}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mt-4">
              No products to display at the moment.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative">
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-2 p-0 py-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl flex items-center text-sowgren_Color self-center sm:text-2xl md:text-3xl font-bold">
              {message}
            </CardTitle>
            {products.length > 4 && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("...")}
                  onClick={handlePrev}
                  disabled={!canScrollLeft}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("...")}
                  onClick={handleNext}
                  disabled={!canScrollRight}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-0">
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="overflow-x-auto pb-4 scrollbar-hide"
            >
              <div className="flex gap-4 w-max">
                {products.map((product) => (
                  <div key={product.id} className="w-[240px]">
                    <ProductCards data={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CustomersWants
