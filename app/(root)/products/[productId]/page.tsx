"use client"
import { useEffect, useState } from "react"
import { Product } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { useCartStore } from "@/store"
import { ChevronRight, ShoppingCart, Star, Truck } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import CustomersWants from "@/components/cards/product/CustomersWants"
import { Skeleton } from "@/components/ui/skeleton"

const ProductDetailPage = ({ params }: { params: { productId: string } }) => {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [localQuantity, setLocalQuantity] = useState(1)
  const [variantError, setVariantError] = useState(false)

  const { addToCart, selectedVariant, setSelectedVariant } = useCartStore()

  useEffect(() => {
    async function getProductDetail() {
      try {
        const res = await fetch(`/api/products/${params.productId}`, {
          method: "GET",
          cache: "no-store",
        })

        if (res.ok) {
          const productDetail = await res.json()
          setProduct(productDetail)
          if (productDetail.variants.length === 1) {
            setSelectedVariant(productDetail.variants[0])
          }
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    getProductDetail()
  }, [params.productId, setSelectedVariant])

  const partnerName = product?.partner?.brand || product?.partner?.owner || ""

  const handleAddToCart = () => {
    // if (!selectedVariant) return

    if (product.variants.length > 1 && !selectedVariant) {
      setVariantError(true)
      return
    }
    setVariantError(false)

    addToCart({
      variantId: selectedVariant.id,
      productId: product?.id || "",
      weight: selectedVariant.weight,
      price: selectedVariant.discountedPrice || selectedVariant.price,
      unit: selectedVariant.unit,
      product: product!,
      quantity: localQuantity,
    })
  }

  const handleCheckout = () => {
    if (!selectedVariant) return

    // Add to cart first
    addToCart({
      variantId: selectedVariant.id,
      productId: product?.id || "",
      weight: selectedVariant.weight,
      price: selectedVariant.discountedPrice || selectedVariant.price,
      unit: selectedVariant.unit,
      product: product!,
      quantity: localQuantity,
    })

    // Then redirect to checkout
    router.push("/checkout")
  }

  if (loading) return <ProductDetailSkeleton />
  if (!product)
    return <div className="container mx-auto p-4">Product not found</div>

  return (
    <div className="container mx-auto px-4 py-4 md:px-12 sm:py-6 max-w-7xl">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mb-4 sm:mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="line-clamp-1">
              {product.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Main Product Section */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8">
        {/* Product Images */}
        <div className="w-full sm:w-[45%] lg:w-[45%]">
          {/* Main Image */}
          <div className="relative aspect-square w-full rounded-xl bg-gray-50 overflow-hidden mb-3 shadow-sm">
            <Image
              src={product?.images[selectedImageIndex]?.url}
              alt={product.title}
              fill
              priority
              className="object-contain"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
            />
            {/* Badge */}
            {product.discount > 0 && (
              <Badge className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-red-500 hover:bg-red-600 text-xs sm:text-sm">
                {product.discount}% OFF
              </Badge>
            )}
            {product.isInStock === "out-of-stock" && (
              <Badge
                variant="outline"
                className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gray-100/90 text-gray-600 text-xs sm:text-sm"
              >
                Out of stock
              </Badge>
            )}
          </div>

          {/* Thumbnail Gallery */}
          <div className="flex sm:grid sm:grid-cols-4 gap-2 overflow-x-auto pb-2 sm:pb-0">
            {product.images.map((img, index) => (
              <button
                key={img.publicId}
                className={`relative aspect-square min-w-[80px] sm:min-w-0 rounded-md overflow-hidden border-2 transition-all ${
                  selectedImageIndex === index
                    ? "border-primary"
                    : "border-transparent"
                }`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 25vw, (max-width: 768px) 20vw, 15vw"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full sm:w-[55%] lg:w-[60%] space-y-4 sm:space-y-6">
          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold">{product.title}</h1>
            {/* <p className="text-gray-500">
              by{" "}
              <span className="bg-gray-200 rounded-full px-3 py-0.5 ">
                PLENTEOUS
              </span>
            </p> */}
            {partnerName && (
              <div className="mb-1 flex items-center">
                <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                  {partnerName}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-medium">4.8</span>
              </div>
              <span className="text-sm text-muted-foreground">
                (24 reviews)
              </span>
            </div>
          </div>

          <Separator className="my-3 sm:my-4" />

          {/* Price Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xl sm:text-2xl font-bold">
                {
                  /* {selectedVariant ? (
                  product.discount > 0 && selectedVariant.discountedPrice ? (
                    <span>
                      {formatCurrency(selectedVariant.discountedPrice, "GHS")}{" "}
                      <span className="text-sm sm:text-base text-muted-foreground line-through">
                        {formatCurrency(selectedVariant.price, "GHS")}
                      </span>
                    </span>
                  ) : (
                    formatCurrency(selectedVariant.price, "GHS")
                  )
                ) : (
                  formatCurrency(product.variants[0]?.price, "GHS")
                )} */
                  product.discount > 0 && selectedVariant?.discountedPrice ? (
                    <span>
                      {formatCurrency(selectedVariant.discountedPrice, "GHS")}{" "}
                      <span className="text-sm sm:text-base text-muted-foreground line-through">
                        {formatCurrency(selectedVariant.price, "GHS")}
                      </span>
                    </span>
                  ) : (
                    formatCurrency(
                      selectedVariant?.price || product.variants[0]?.price,
                      "GHS"
                    )
                  )
                }
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <Truck className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>
                Delivery is available only on Wednesdays and Saturdays.
              </span>
            </div>
          </div>

          <Separator className="my-3 sm:my-4" />

          {/* Variant Selector */}
          {product.variants.length > 1 && (
            <div className="space-y-2 sm:space-y-3">
              <h3 className="font-medium text-sm sm:text-base">
                {product.variants.some((v) => v.weight) ? "Weight" : "Option"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <Button
                    key={variant.id}
                    variant={
                      selectedVariant?.id === variant.id
                        ? "sowgreen"
                        : "outline"
                    }
                    size="sm"
                    className="text-xs sm:text-sm"
                    // onClick={() => setSelectedVariant(variant)}
                    onClick={() => {
                      setSelectedVariant(variant)
                      setVariantError(false) // Clear error when variant is selected
                    }}
                  >
                    {variant.weight && variant.unit
                      ? `${variant.weight} ${variant.unit}`
                      : formatCurrency(variant.price, "GHS")}
                  </Button>
                ))}
              </div>
              {variantError && (
                <p className="text-red-500 font-medium text-sm">
                  {product.variants.some((v) => v.weight)
                    ? "Please select weight"
                    : "Please select an option"}
                </p>
              )}
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 sm:h-9 sm:w-9"
                onClick={() =>
                  localQuantity > 1 && setLocalQuantity(localQuantity - 1)
                }
                disabled={localQuantity <= 1}
              >
                -
              </Button>
              <span className="px-3 sm:px-4 text-sm sm:text-base">
                {localQuantity}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 sm:h-9 sm:w-9"
                onClick={() => setLocalQuantity(localQuantity + 1)}
              >
                +
              </Button>
            </div>
          </div>

          {/* Add to Cart & Checkout Buttons - Side by Side */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleAddToCart}
              size="sm"
              className="h-9 sm:h-10 text-sm sm:text-base gap-2 bg-sowgren_Color hover:bg-sowgren_Color/90"
              disabled={product.isInStock === "out-of-stock"}
            >
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              Add to Cart
            </Button>

            <Button
              onClick={handleCheckout}
              size="sm"
              variant="outline"
              className="h-9 sm:h-10 text-sm sm:text-base"
              disabled={product.isInStock === "out-of-stock"}
            >
              Checkout Now
            </Button>
          </div>

          <Separator className="my-3 sm:my-4" />

          {/* Product Details */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="font-medium text-sm sm:text-base">
              Product Details
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base">
              {product.description}
            </p>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li className="flex items-center">
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                <span>Category: {product.categoryName}</span>
              </li>
              {product.variants[0].unit && (
                <li className="flex items-center">
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  <span>Unit: {product.variants[0].unit}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Customers Also Bought Section */}
      <section className="mt-8 sm:mt-12">
        <CustomersWants message="Customers also bought" />
      </section>
    </div>
  )
}

// Skeleton component remains the same as previous version
const ProductDetailSkeleton = () => {
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

export default ProductDetailPage
