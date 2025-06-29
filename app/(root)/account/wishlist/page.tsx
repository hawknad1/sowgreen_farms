// import React from "react"
// import { Heart, ArrowLeft } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import Link from "next/link"

// const WishlistPage = () => {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <main className="container mx-auto px-4 py-8">
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-2">
//             <Link href="/">
//               <Button variant="ghost" size="sm">
//                 <ArrowLeft className="h-4 w-4 mr-1" />
//                 Back to Home
//               </Button>
//             </Link>
//             <h1 className="text-2xl font-bold">My Wishlist</h1>
//           </div>
//         </div>

//         <Card>
//           <CardContent className="p-6 text-center">
//             <Heart className="mx-auto h-12 w-12 text-gray-300 mb-2" />
//             <p className="text-gray-500">Your wishlist is empty</p>
//             <Link href="/products">
//               <Button variant="outline" className="mt-4">
//                 Start Shopping
//               </Button>
//             </Link>
//           </CardContent>
//         </Card>
//       </main>
//     </div>
//   )
// }

// export default WishlistPage

// app/wishlist/page.tsx

// "use client"

// import { useEffect } from "react"

// import { Button } from "@/components/ui/button"
// import { HeartOff } from "lucide-react"
// import { Skeleton } from "@/components/ui/skeleton"
// import { toast } from "sonner"
// import { useWishlistStore } from "@/store"
// import ProductCard from "@/components/cards/product/ProductCard"

// export default function WishlistPage() {
//   const { wishlist, isLoading, error, fetchWishlist, clearWishlist } =
//     useWishlistStore()

//   useEffect(() => {
//     fetchWishlist()
//   }, [fetchWishlist])

//   const handleClearWishlist = async () => {
//     try {
//       await Promise.all(
//         wishlist.map((product) =>
//           fetch("/api/wishlist", {
//             method: "DELETE",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ productId: product.id }),
//           })
//         )
//       )
//       clearWishlist()
//       toast.success("Wishlist cleared")
//     } catch (error) {
//       toast.error("Failed to clear wishlist")
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="container py-8">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {Array.from({ length: 4 }).map((_, i) => (
//             <Skeleton key={i} className="w-full h-[350px] rounded-lg" />
//           ))}
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="container py-8 text-center">
//         <p className="text-red-500">{error}</p>
//         <Button onClick={fetchWishlist} variant="outline" className="mt-4">
//           Retry
//         </Button>
//       </div>
//     )
//   }

//   return (
//     <div className="container py-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-2xl font-bold">Your Wishlist</h1>
//         {wishlist.length > 0 && (
//           <Button
//             variant="outline"
//             onClick={handleClearWishlist}
//             className="flex items-center gap-2"
//             disabled={isLoading}
//           >
//             <HeartOff className="w-4 h-4" />
//             Clear All
//           </Button>
//         )}
//       </div>

//       {wishlist.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-16 gap-4">
//           <HeartOff className="w-16 h-16 text-gray-400" />
//           <h2 className="text-xl font-medium text-gray-600">
//             Your wishlist is empty
//           </h2>
//           <p className="text-gray-500">
//             Start adding products to your wishlist
//           </p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {wishlist.map((product) => (
//             <ProductCard key={product.id} data={product} />
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }
// "use client"

// import { useWishlistStore } from "@/store"
// import { Button } from "@/components/ui/button"
// import { HeartOff } from "lucide-react"
// import { useEffect, useState } from "react"
// import { Product } from "@/types"
// import { Skeleton } from "@/components/ui/skeleton"
// import ProductCard from "@/components/cards/product/ProductCard"

// export default function WishlistPage() {
//   const { wishlist, clearWishlist, removeFromWishlist } = useWishlistStore()
//   const [loading, setLoading] = useState(true)
//   const [hydrated, setHydrated] = useState(false)

//   useEffect(() => {
//     setHydrated(true)
//     setLoading(false)
//   }, [])

//   if (!hydrated) {
//     return (
//       <div className="container py-8">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {Array.from({ length: 4 }).map((_, i) => (
//             <Skeleton key={i} className="w-full h-[350px] rounded-lg" />
//           ))}
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="container py-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-2xl font-bold">Your Wishlist</h1>
//         {wishlist.length > 0 && (
//           <Button
//             variant="outline"
//             onClick={clearWishlist}
//             className="flex items-center gap-2"
//           >
//             <HeartOff className="w-4 h-4" />
//             Clear All
//           </Button>
//         )}
//       </div>

//       {wishlist.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-16 gap-4">
//           <HeartOff className="w-16 h-16 text-gray-400" />
//           <h2 className="text-xl font-medium text-gray-600">
//             Your wishlist is empty
//           </h2>
//           <p className="text-gray-500">
//             Start adding products to your wishlist
//           </p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {wishlist.map((product: Product) => (
//             <ProductCard
//               key={product.id}
//               data={product}
//               onWishlistUpdate={() => removeFromWishlist(product.id)}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

"use client"

import { useEffect } from "react"
import { HeartOff } from "lucide-react"
import { useWishlistStore } from "@/store"
import ProductCard from "@/components/cards/product/ProductCard"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function WishlistPage() {
  // Destructure the new state and actions from the store
  const { wishlist, status, error, fetchWishlist, clearWishlist } =
    useWishlistStore()

  // The useEffect hook is now much simpler and safer
  useEffect(() => {
    // Only fetch if the status is 'idle' (i.e., we haven't tried yet)
    if (status === "idle") {
      fetchWishlist()
    }
  }, [status, fetchWishlist])

  // handleClearWishlist is now a simple wrapper around the store's action
  const handleClearWishlist = () => {
    if (wishlist.length > 0) {
      clearWishlist()
    }
  }

  // Render a loading skeleton based on the 'loading' status
  if (status === "loading") {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[350px] w-full rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  // Render an error message based on the 'failed' status
  if (status === "failed") {
    return (
      <div className="container py-8 text-center">
        <p className="text-red-500">{error || "An error occurred."}</p>
        <div className="mt-4 space-x-4">
          <Button onClick={fetchWishlist} variant="outline">
            Retry
          </Button>
          <Button onClick={() => window.location.reload()} variant="ghost">
            Refresh Page
          </Button>
        </div>
      </div>
    )
  }

  // Main content render
  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Wishlist</h1>
        {wishlist.length > 0 && (
          <Button
            variant="outline"
            onClick={handleClearWishlist}
            className="flex items-center gap-2"
          >
            <HeartOff className="h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <HeartOff className="h-16 w-16 text-gray-400" />
          <h2 className="text-xl font-medium text-gray-600">
            Your wishlist is empty
          </h2>
          <p className="text-gray-500">
            Start adding products you love to your wishlist.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {wishlist.map((product) => (
            <ProductCard key={product.id} data={product} />
          ))}
        </div>
      )}
    </div>
  )
}
