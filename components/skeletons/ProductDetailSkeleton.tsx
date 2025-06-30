import { Separator } from "../ui/separator"
import { Skeleton } from "../ui/skeleton"

// Skeleton component remains the same as previous version
export const ProductDetailSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 max-w-7xl">
      {/* Breadcrumb Skeleton */}
      <div className="mb-4 sm:mb-6 flex space-x-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Main Content Skeleton - Side by side */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Image Gallery Skeleton */}
        <div className="w-full sm:w-[45%]">
          <Skeleton className="aspect-square w-full rounded-xl mb-3" />
          <div className="flex sm:grid sm:grid-cols-4 gap-2 overflow-x-auto pb-2 sm:pb-0">
            {[...Array(4)].map((_, i) => (
              <Skeleton
                key={i}
                className="aspect-square min-w-[80px] sm:min-w-0 rounded-md"
              />
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="w-full sm:w-[55%] space-y-4 sm:space-y-6">
          <div className="space-y-2 sm:space-y-3">
            <Skeleton className="h-7 sm:h-8 w-3/4" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          <Separator />

          {/* Price Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-6 sm:h-7 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>

          <Separator />

          {/* Variants Skeleton */}
          <div className="space-y-2 sm:space-y-3">
            <Skeleton className="h-5 w-24" />
            <div className="flex flex-wrap gap-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-8 sm:h-9 w-20 rounded-md" />
              ))}
            </div>
          </div>

          {/* Quantity Skeleton */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 sm:h-9 w-32 rounded-md" />
          </div>

          {/* Add to Cart & Checkout Skeleton */}
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-9 sm:h-10 rounded-md" />
            <Skeleton className="h-9 sm:h-10 rounded-md" />
          </div>

          <Separator />

          {/* Details Skeleton */}
          <div className="space-y-2 sm:space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="space-y-1 sm:space-y-2">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-64" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Skeleton */}
      <section className="mt-8 sm:mt-12">
        <Skeleton className="h-7 sm:h-8 w-64 mb-4 sm:mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      </section>
    </div>
  )
}
