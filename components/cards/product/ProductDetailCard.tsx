"use client"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem } from "@/components/ui/select"
import { useCartStore } from "@/store"
import Image from "next/image"
import { useState } from "react"

// Types
interface Variant {
  id: string
  productId: string
  weight: number
  price: number
  unit: string
}

interface Product {
  categoryName: string
  createdAt: string
  description: string
  discount: number
  id: string
  imageUrl: string
  isInStock: string
  purchaseCount: number
  quantity: number
  title: string
  updatedAt: string
  variants: Variant[]
}

interface CartItem {
  variantId: string
  productId: string
  weight: number
  price: number
  unit: string
  quantity: number
}

// Product Details Component
const ProductDetailCard: React.FC<{ product: Product }> = ({ product }) => {
  const {
    selectedVariant,
    quantity,
    setSelectedVariant,
    setQuantity,
    addToCart,
    cart,
  } = useCartStore()

  if (!product) {
    return <p>Loading product data...</p>
  }

  if (product.variants.length === 0) {
    return <p>No variants available for this product.</p>
  }

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
    <div className="p-4">
      {/* Product Info */}
      <div className="flex gap-6">
        <Image
          src={product.imageUrl}
          alt={product.title}
          className="w-64 h-64 object-cover rounded-lg"
        />
        <div>
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <p className="text-gray-600">{product.description}</p>
          <p className="mt-2 font-semibold text-green-600">In Stock</p>
        </div>
      </div>

      {/* Variant Selector */}
      <div className="mt-4">
        <select
          onChange={(e) => {
            const variant = product.variants.find(
              (v) => v.id === e.target.value
            )
            setSelectedVariant(variant || null)
          }}
        >
          <option value="">Select a variant</option>
          {product.variants.map((variant) => (
            <option key={variant.id} value={variant.id}>
              {`${variant.weight} ${variant.unit} - $${variant.price}`}
            </option>
          ))}
        </select>
      </div>

      {/* Quantity Selector */}
      {selectedVariant && (
        <div className="mt-4">
          <label htmlFor="quantity" className="block font-semibold">
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            min={1}
            className="border p-2 rounded w-24 mt-2"
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          <button
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      )}

      {/* Basket */}
      {cart.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold">Cart</h2>
          <div className="mt-4 space-y-4">
            {cart.map((item) => (
              <div
                key={item.variantId}
                className="flex justify-between items-center border p-4 rounded-lg"
              >
                <div>
                  <p className="font-semibold">
                    {item.weight} {item.unit}
                  </p>
                  <p className="text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <p className="font-bold">${item.price * item.quantity}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetailCard
