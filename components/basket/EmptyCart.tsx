"use client"
import { Button } from "@/components/ui/button"
import { ShoppingBagIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"

interface EmptyCartProps {
  onContinueShopping: () => void
}

const EmptyCart = ({ onContinueShopping }: EmptyCartProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 bg-gray-100 rounded-full mb-4">
        <ShoppingBagIcon className="h-12 w-12 text-gray-400" />
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Your cart is empty
      </h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Looks like you haven't added anything to your cart yet. Start shopping
        to find amazing products!
      </p>
      <Button variant="sowgreen" onClick={onContinueShopping}>
        Continue Shopping
      </Button>
    </div>
  )
}

export default EmptyCart
