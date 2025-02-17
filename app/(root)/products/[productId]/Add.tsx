"use client"

import { useCartStore } from "@/store"
import { Product } from "@/types"

const Add = ({ product }: { product: Product }) => {
  const {
    selectedVariant,
    quantity,
    setSelectedVariant,
    setQuantity,
    addToCart,
    cart,
  } = useCartStore()

  const handleQuantity = (type: "i" | "d") => {
    // Directly calculate the new quantity instead of using a functional update
    let newQuantity = quantity
    if (type === "d" && quantity > 1) {
      newQuantity = quantity - 1
    }
    if (type === "i" && quantity < product.quantity) {
      newQuantity = quantity + 1
    }
    setQuantity(newQuantity)
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
        price: selectedVariant.discountedPrice || selectedVariant.price, // Use discountedPrice if available
        unit: selectedVariant.unit,
        product: product,
        quantity,
      })
    }

    setQuantity(1) // Reset quantity after adding to cart
  }

  return (
    <div className="flex flex-col gap-4">
      <h4 className="font-medium">Choose a Quantity</h4>
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 py-2 px-4 rounded-3xl ring-1 ring-slate-200 flex items-center justify-between w-32">
            <button
              className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
              onClick={() => handleQuantity("d")}
              disabled={quantity === 1 || product?.isInStock === "out-of-stock"}
            >
              -
            </button>
            {quantity}
            <button
              className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
              onClick={() => handleQuantity("i")}
              disabled={
                quantity === product.quantity ||
                product?.isInStock === "out-of-stock"
              }
            >
              +
            </button>
          </div>
          {product.quantity < 1 ? (
            <div className="text-xs">Product is out of stock</div>
          ) : product?.quantity <= 10 ? (
            <div className="text-xs">
              Only{" "}
              <span className="text-orange-500">{product.quantity} items</span>{" "}
              left!
              <br /> Don't miss it
            </div>
          ) : null}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={product?.isInStock === "out-of-stock"}
          // disabled={product.quantity < 1 || !selectedVariant}
          className="w-36 text-sm rounded-3xl ring-1 ring-green-900/25 text-green-900 py-2 px-4 hover:bg-green-700 font-medium hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:ring-0 disabled:text-white"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default Add
