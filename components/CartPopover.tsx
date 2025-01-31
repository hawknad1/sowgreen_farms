"use client"

import React, { useState } from "react"
import { useCartStore } from "@/store"
import { ShoppingCartIcon } from "@heroicons/react/24/outline"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import BasketCartItems from "./basket/BasketCartItems"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

export function CartPopover() {
  const { cartItemCount } = useCartStore()
  const router = useRouter()
  const [isPopoverOpen, setIsPopoverOpen] = useState(false) // State to control popover visibility

  // Function to handle navigation and close the popover
  const handleNavigation = (path: string) => {
    router.push(path) // Navigate to the specified path
    setIsPopoverOpen(false) // Close the popover
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <div className="cursor-pointer relative">
          <ShoppingCartIcon className="size-6" />
          {cartItemCount > 0 && (
            <div className="absolute -top-2.5 -right-2 h-5 w-5 p-1 flex items-center justify-center text-xs bg-red-400 rounded-full text-white">
              <p>{cartItemCount}</p>
            </div>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        {/* Static content */}
        <p className="text-lg font-semibold mb-4">Items In Cart</p>

        {/* Scrollable content */}
        <div className="max-h-[360px] overflow-y-auto scrollbar-sowgreen">
          <BasketCartItems isCartIcon={true} isCheckout={true} />
        </div>

        {/* Static buttons */}
        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={() => handleNavigation("/basket")} // Navigate to /basket
          >
            View Cart
          </Button>
          <Button onClick={() => handleNavigation("/checkout")}>
            Checkout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
