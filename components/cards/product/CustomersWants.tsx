// "use client"
// import React, { useEffect, useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Skeleton } from "@/components/ui/skeleton"
// import ProductCards from "./ProductCards"
// import { Button } from "@/components/ui/button"
// import { ChevronLeft, ChevronRight } from "lucide-react"
// import { Product } from "@/types"
// import { cn } from "@/lib/utils"

// interface CustomersWantsProps {
//   message?: string
// }

// const CustomersWants = ({ message }: CustomersWantsProps) => {
//   const [productList, setProductList] = useState<Product[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [currentIndex, setCurrentIndex] = useState(0)
//   const [showArrows, setShowArrows] = useState(false)
//   const [canScrollLeft, setCanScrollLeft] = useState(false)
//   const [canScrollRight, setCanScrollRight] = useState(true)

//   useEffect(() => {
//     async function getPopularProductList() {
//       try {
//         const res = await fetch("/api/products/popular", {
//           method: "GET",
//           cache: "no-store",
//         })

//         if (res.ok) {
//           const popularProducts = await res.json()
//           setProductList(popularProducts)
//         }
//       } catch (error) {
//         console.error("Error fetching popular products:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     getPopularProductList()
//   }, [])

//   useEffect(() => {
//     setCanScrollLeft(currentIndex > 0)
//     setCanScrollRight(currentIndex < productList.length - 4)
//   }, [currentIndex, productList.length])

//   const handlePrev = () => {
//     setCurrentIndex((prev) => Math.max(0, prev - 1))
//   }

//   const handleNext = () => {
//     setCurrentIndex((prev) => Math.min(prev + 1, productList.length - 4))
//   }

//   const scrollContainerRef = React.useRef<HTMLDivElement>(null)

//   return (
//     <div className="relative">
//       <Card className="border-0 shadow-none">
//         <CardHeader className="pb-2">
//           <CardTitle className="text-lg md:text-xl font-semibold">
//             {message}
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="pt-0">
//           {isLoading ? (
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//               {[...Array(4)].map((_, i) => (
//                 <Skeleton key={i} className="aspect-square rounded-lg" />
//               ))}
//             </div>
//           ) : (
//             <div
//               className="relative group"
//               onMouseEnter={() => setShowArrows(true)}
//               onMouseLeave={() => setShowArrows(false)}
//             >
//               {/* Scrollable container */}
//               <div
//                 ref={scrollContainerRef}
//                 className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide"
//               >
//                 <div className="flex gap-4 w-max min-w-full">
//                   {productList.map((product) => (
//                     <div
//                       key={product.id}
//                       className="w-[calc(50vw-32px)] sm:w-[calc(33.333vw-32px)] md:w-[calc(25vw-32px)] lg:w-[280px] flex-shrink-0"
//                     >
//                       <ProductCards data={product} />
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Navigation arrows */}
//               {productList.length > 4 && (
//                 <>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className={cn(
//                       "absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background transition-opacity",
//                       showArrows && canScrollLeft ? "opacity-100" : "opacity-0",
//                       "hidden sm:flex"
//                     )}
//                     onClick={handlePrev}
//                     disabled={!canScrollLeft}
//                   >
//                     <ChevronLeft className="h-5 w-5" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className={cn(
//                       "absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background transition-opacity",
//                       showArrows && canScrollRight
//                         ? "opacity-100"
//                         : "opacity-0",
//                       "hidden sm:flex"
//                     )}
//                     onClick={handleNext}
//                     disabled={!canScrollRight}
//                   >
//                     <ChevronRight className="h-5 w-5" />
//                   </Button>
//                 </>
//               )}
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// export default CustomersWants

"use client"
import React, { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import ProductCards from "./ProductCards"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Product } from "@/types"
import { cn } from "@/lib/utils"

interface CustomersWantsProps {
  message?: string
}

const CustomersWants = ({ message }: CustomersWantsProps) => {
  const [productList, setProductList] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function getPopularProductList() {
      try {
        const res = await fetch("/api/products/popular", {
          method: "GET",
          cache: "no-store",
        })

        if (res.ok) {
          const popularProducts = await res.json()
          setProductList(popularProducts)
        }
      } catch (error) {
        console.error("Error fetching popular products:", error)
      } finally {
        setIsLoading(false)
      }
    }
    getPopularProductList()
  }, [])

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
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

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", checkScrollPosition)
      // Initial check
      checkScrollPosition()
      return () => container.removeEventListener("scroll", checkScrollPosition)
    }
  }, [productList])

  return (
    <div className="relative">
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-2 p-0 py-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl flex items-center text-sowgren_Color self-center sm:text-2xl md:text-3xl font-bold">
              {message}
            </CardTitle>
            {productList.length > 4 && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background",
                    !canScrollLeft && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={handlePrev}
                  disabled={!canScrollLeft}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background",
                    !canScrollRight && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={handleNext}
                  disabled={!canScrollRight}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="relative">
              {/* Scrollable container */}
              <div
                ref={scrollContainerRef}
                className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide"
              >
                <div className="flex gap-4 w-max min-w-full">
                  {productList.map((product) => (
                    <div
                      key={product.id}
                      className="w-[calc(50vw-32px)] sm:w-[calc(33.333vw-32px)] md:w-[calc(25vw-32px)] lg:w-[280px] flex-shrink-0"
                    >
                      <ProductCards data={product} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default CustomersWants

// "use client"
// import React, { useEffect, useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Skeleton } from "@/components/ui/skeleton"
// import ProductCards from "./ProductCards"
// import { Button } from "@/components/ui/button"
// import { ChevronLeft, ChevronRight } from "lucide-react"
// import { Product } from "@/types"

// const CustomersWants = () => {
//   const [productList, setProductList] = useState<Product[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [currentIndex, setCurrentIndex] = useState(0)

//   useEffect(() => {
//     async function getPopularProductList() {
//       try {
//         const res = await fetch("/api/products/popular", {
//           method: "GET",
//           cache: "no-store",
//         })

//         if (res.ok) {
//           const popularProducts = await res.json()
//           setProductList(popularProducts)
//         }
//       } catch (error) {
//         console.error("Error fetching popular products:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     getPopularProductList()
//   }, [])

//   const handlePrev = () => {
//     setCurrentIndex((prev) => Math.max(0, prev - 1))
//   }

//   const handleNext = () => {
//     setCurrentIndex((prev) => Math.min(prev + 1, productList.length - 4))
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="text-lg md:text-xl">
//           Customers also bought
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         {isLoading ? (
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//             {[...Array(4)].map((_, i) => (
//               <Skeleton key={i} className="aspect-square rounded-lg" />
//             ))}
//           </div>
//         ) : (
//           <div className="relative">
//             <div className="overflow-hidden">
//               <div
//                 className="flex transition-transform duration-300 ease-in-out"
//                 style={{ transform: `translateX(-${currentIndex * 25}%)` }}
//               >
//                 {productList.map((product) => (
//                   <div
//                     key={product.id}
//                     className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 flex-shrink-0"
//                   >
//                     <ProductCards data={product} />
//                   </div>
//                 ))}
//               </div>
//             </div>
//             {productList.length > 0 && (
//               <>
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   className="absolute left-2 top-1/2 -translate-y-1/2 hidden sm:flex"
//                   onClick={handlePrev}
//                   disabled={currentIndex === 0}
//                 >
//                   <ChevronLeft className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex"
//                   onClick={handleNext}
//                   disabled={currentIndex >= productList.length - 4}
//                 >
//                   <ChevronRight className="h-4 w-4" />
//                 </Button>
//               </>
//             )}
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }

// export default CustomersWants
