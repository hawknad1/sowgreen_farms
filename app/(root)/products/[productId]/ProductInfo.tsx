import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { useCartStore } from "@/store"
import { Product } from "@/types"
import React, { useEffect } from "react"
import Add from "./Add"
import AdditionalDescription from "./AdditionalDescription"

const ProductInfo: React.FC<{ product: Product }> = ({ product }) => {
  const {
    selectedVariant,
    quantity,
    setSelectedVariant,
    setQuantity,
    addToCart,
    cart,
  } = useCartStore()

  useEffect(() => {
    // Automatically set the default variant if only one exists
    if (product.variants.length === 1) {
      setSelectedVariant(product.variants[0])
    }
  }, [product.variants, setSelectedVariant])

  const handleAddToCart = () => {
    if (!selectedVariant) return

    const existingCartItem = cart.find(
      (item) => item.variantId === selectedVariant.id
    )

    if (existingCartItem) {
      useCartStore.getState().updateCartItem(selectedVariant.id, quantity)
    } else {
      addToCart({
        variantId: selectedVariant.id,
        productId: product.id,
        weight: selectedVariant.weight,
        price: selectedVariant.price,
        unit: selectedVariant.unit,
        product: product,
        quantity,
      })
    }

    setQuantity(1) // Reset quantity after adding to cart
  }

  return (
    <div className="flex flex-col gap-6 w-full lg:w-1/2">
      <h1 className="text-4xl font-medium">{product?.title}</h1>
      <p className="text-gray-500">{product?.description}</p>
      <Separator />

      {/* Price Display */}
      <h2 className="font-medium text-2xl">
        {selectedVariant
          ? formatCurrency(selectedVariant.price, "GHS")
          : formatCurrency(product?.variants[0]?.price, "GHS")}{" "}
        {/* Fallback price */}
      </h2>

      {/* Variant Selector */}
      <div className="flex flex-col gap-y-7">
        {product.variants.length > 1 && (
          <div className="flex flex-col w-full">
            <div className="flex items-center w-full gap-x-2.5">
              <h2 className="font-medium">
                {product.variants.some((v) => v.weight) ? "Weight" : "Price"}
              </h2>
              <Select
                onValueChange={(value) => {
                  const variant = product.variants.find((v) => v.id === value)
                  setSelectedVariant(variant || null) // Update the selected variant state
                }}
                defaultValue={selectedVariant?.id || undefined}
              >
                <SelectTrigger className="max-w-56">
                  <SelectValue placeholder="Select weight" />
                </SelectTrigger>
                <SelectContent>
                  {product.variants.map((variant) => (
                    <SelectItem
                      className=""
                      key={variant.id}
                      value={variant.id}
                    >
                      {variant.weight && variant.unit
                        ? `${variant.weight} ${variant.unit}`
                        : formatCurrency(variant.price, "GHS")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <Add product={product} />
        <Separator />
      </div>

      {/* Additional product info/description  */}

      {/* <AdditionalDescription /> */}
    </div>
  )
}

export default ProductInfo
