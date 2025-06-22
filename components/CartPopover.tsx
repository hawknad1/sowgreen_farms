// "use client"

// import React, { useState } from "react"
// import { useCartStore } from "@/store"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"
// import BasketCartItems from "./basket/BasketCartItems"
// import { Button } from "./ui/button"
// import { useRouter } from "next/navigation"
// import { ShoppingCartIcon } from "@heroicons/react/20/solid"

// export function CartPopover() {
//   const { cartItemCount } = useCartStore()
//   const router = useRouter()
//   const [isPopoverOpen, setIsPopoverOpen] = useState(false) // State to control popover visibility

//   // Function to handle navigation and close the popover
//   const handleNavigation = (path: string) => {
//     router.push(path) // Navigate to the specified path
//     setIsPopoverOpen(false) // Close the popover
//   }

//   return (
//     <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
//       <PopoverTrigger asChild>
//         <div className="cursor-pointer relative bg-[#184532] p-2 text-white rounded-full">
//           <ShoppingCartIcon className="size-5" />
//           {cartItemCount > 0 && (
//             <div className="absolute -top-2.5 -right-2 h-5 w-5 p-1 flex items-center justify-center text-xs bg-red-400 rounded-full text-white">
//               <p>{cartItemCount}</p>
//             </div>
//           )}
//         </div>
//       </PopoverTrigger>
//       <PopoverContent className="w-96">
//         {/* Static content */}
//         <p className="text-lg font-semibold mb-4">Items In Cart</p>

//         {/* Scrollable content */}
//         <div className="max-h-[360px] overflow-y-auto scrollbar-sowgreen">
//           <BasketCartItems isCartIcon={true} isCheckout={true} />
//         </div>

//         {/* Static buttons */}
//         <div className="flex justify-between mt-4">
//           <Button
//             variant="outline"
//             onClick={() => handleNavigation("/basket")} // Navigate to /basket
//           >
//             View Cart
//           </Button>
//           <Button onClick={() => handleNavigation("/checkout")}>
//             Checkout
//           </Button>
//         </div>
//       </PopoverContent>
//     </Popover>
//   )
// }

"use client"
import React, { useState } from "react"
import { useCartStore } from "@/store"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import BasketCartItems from "./basket/BasketCartItems"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { ShoppingCartIcon } from "@heroicons/react/20/solid"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "./ui/badge"
import { formatCurrency } from "@/lib/utils"

export function CartPopover() {
  const { cartItemCount, cartTotal } = useCartStore()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleNavigation = (path: string) => {
    router.push(path)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
          <ShoppingCartIcon className="h-5 w-5 text-gray-700" />
          <AnimatePresence>
            {cartItemCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1"
              >
                <Badge
                  variant="destructive"
                  className="h-5 w-5 p-0 flex items-center justify-center"
                >
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="w-[320px] sm:w-[360px] p-0 rounded-lg shadow-xl"
        align="end"
        sideOffset={10}
      >
        <div className="flex flex-col max-h-[70vh]">
          <div className="p-4 border-b">
            <h3 className="font-medium flex items-center gap-2">
              <ShoppingCartIcon className="h-5 w-5 text-primary" />
              Your Cart ({cartItemCount}{" "}
              {cartItemCount === 1 ? "item" : "items"})
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {cartItemCount > 0 ? (
              <BasketCartItems isCartIcon={true} isCheckout={true} />
            ) : (
              <div className="p-6 flex flex-col items-center text-center">
                <ShoppingCartIcon className="h-10 w-10 text-gray-400 mb-3" />
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <Button
                  variant="outline"
                  onClick={() => handleNavigation("/products")}
                >
                  Browse Products
                </Button>
              </div>
            )}
          </div>

          {cartItemCount > 0 && (
            <div className="border-t p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium">Subtotal:</span>
                {/* <span className="font-medium">{cartTotal.toFixed(2)}</span> */}
                <span className="font-medium text-sm">
                  {formatCurrency(cartTotal, "GHS")}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleNavigation("/basket")}
                >
                  View Cart
                </Button>
                <Button onClick={() => handleNavigation("/checkout")}>
                  Checkout
                </Button>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
