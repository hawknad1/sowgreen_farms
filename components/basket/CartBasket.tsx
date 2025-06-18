// "use client"
// import React from "react"
// import BasketCartItems from "./BasketCartItems"
// import { useCartStore } from "@/store"

// const CartBasket = () => {
//   const { cart } = useCartStore()

//   return (
//     <div className="flex flex-col justify-between ">
//       <>
//         {cart.length > 0 && (
//           <div className="mt-8">
//             {/* Header Row */}
//             <div className="flex w-full justify-between px-6 text-sm text-gray-600">
//               <div className="w-[40%]">Product</div> {/* Adjusted width */}
//               <div className="w-[30%] text-center">Quantity</div>{" "}
//               {/* Adjusted width */}
//               <div className="w-[30%] text-right">Subtotal</div>{" "}
//               {/* Adjusted width */}
//             </div>
//             <div className="max-h-[470px]">
//               <BasketCartItems />
//             </div>
//           </div>
//         )}
//       </>
//     </div>
//   )
// }

// export default CartBasket

"use client"
import React from "react"
import BasketCartItems from "./BasketCartItems"
import { useCartStore } from "@/store"
import BasketCartItemsPopover from "../BasketCartItemsPopover"

const CartBasket = () => {
  const { cart } = useCartStore()

  return (
    <div className="divide-y divide-gray-200">
      {/* Header Row */}
      <div className="hidden md:flex items-center py-3 px-4 bg-gray-50 text-sm font-medium text-gray-500">
        <div className="w-2/5">Product</div>
        {/* <div className="w-1/5 text-center">Price</div> */}
        <div className="w-1/5 text-center"> </div>
        <div className="w-1/5 text-center">Quantity</div>
        <div className="w-1/5 text-right">Subtotal</div>
      </div>

      {/* Cart Items */}
      <div className="divide-y divide-gray-200 px-3">
        <BasketCartItems />
      </div>
    </div>
  )
}

export default CartBasket
