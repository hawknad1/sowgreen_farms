// "use client"
// import React from "react"
// import BasketCartItems from "./BasketCartItems"
// import { useCartStore } from "@/store"

// const CartBasket = () => {
//   const { cart } = useCartStore()

//   return (
//     <div className="h-screen flex flex-col justify-between">
//       <>
//         {cart.length > 0 && (
//           <div className="mt-8">
//             <div className="flex w-full justify-between px-6 text-sm text-gray-600">
//               <h2>Product</h2>
//               <h2>Quantity</h2>
//               <h2>Subtotal</h2>
//             </div>
//             <BasketCartItems />
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

const CartBasket = () => {
  const { cart } = useCartStore()

  return (
    <div className="flex flex-col justify-between ">
      <>
        {cart.length > 0 && (
          <div className="mt-8">
            {/* Header Row */}
            <div className="flex w-full justify-between px-6 text-sm text-gray-600">
              <div className="w-[40%]">Product</div> {/* Adjusted width */}
              <div className="w-[30%] text-center">Quantity</div>{" "}
              {/* Adjusted width */}
              <div className="w-[30%] text-right">Subtotal</div>{" "}
              {/* Adjusted width */}
            </div>
            <BasketCartItems />
          </div>
        )}
      </>
    </div>
  )
}

export default CartBasket
