// "use client"

// import React from "react"
// import BasketOrderSummery from "@/components/checkout/BasketOrderSummery"
// import CheckoutBox from "@/components/checkout/CheckoutBox"
// import Coupon from "@/components/checkout/Coupon"
// import PaymentMethod from "@/components/checkout/PaymentMethod"
// import CartBasket from "@/components/basket/CartBasket"

// import { ShoppingCartIcon } from "@heroicons/react/24/outline"
// import { useRouter } from "next/navigation"
// import { useCartStore, useDeliveryStore } from "@/store"
// import { Button } from "@/components/ui/button"

// const BasketPage = () => {
//   const clearCart = useCartStore((state) => state.clearCart)
//   const router = useRouter()
//   const cart = useCartStore((state) => state.cart)
//   const setDeliveryFee = useDeliveryStore((state) => state.setDeliveryFee)
//   const { cartItemCount } = useCartStore()

//   const handleClearCart = () => {
//     clearCart()
//     setDeliveryFee(0)
//     router.push("/")
//   }

//   return (
//     <div className="w-full p-4 md:p-10 md:max-w-7xl mx-auto bg-white">
//       <div className="flex flex-col">
//         <div className="flex items-center space-x-2 mb-2">
//           <ShoppingCartIcon className="h-8 w-8 md:h-10 md:w-10" />
//           <h1 className="text-lg lg:text-2xl md:text-3xl font-bold">
//             Your Shopping Cart
//           </h1>
//         </div>
//         {cart.length > 0 ? (
//           <p className="text-neutral-600/75 mb-2 text-sm md:text-base">
//             Review the items in your cart and checkout when ready!
//           </p>
//         ) : (
//           <p className="text-neutral-600/75 mb-2 text-sm md:text-base">
//             You have no items in your basket!
//           </p>
//         )}
//       </div>

//       <div className="grid lg:grid-cols-3 grid-cols-1 w-full gap-8 lg:gap-x-20">
//         {/* Left Section */}

//         <div className="w-full lg:col-span-2 col-span-1">
//           <div className="overflow-y-auto scrollbar-sowgreen scrollbar-hide">
//             <CartBasket />
//           </div>
//           {cartItemCount > 0 && (
//             <div className={`mt-4 hidden lg:inline-flex`}>
//               <Button
//                 className="w-fit"
//                 variant="destructive"
//                 onClick={handleClearCart}
//               >
//                 Clear basket
//               </Button>
//             </div>
//           )}
//         </div>

//         {/* Right Section */}
//         <div className="w-full grid gap-3 md:mt-0 col-span-1">
//           <CheckoutBox className="hidden lg:inline-flex ">
//             <Coupon />
//           </CheckoutBox>
//           <CheckoutBox>
//             <BasketOrderSummery />
//           </CheckoutBox>
//           <CheckoutBox>
//             <PaymentMethod />
//           </CheckoutBox>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default BasketPage

"use client"
import React from "react"
import BasketOrderSummery from "@/components/checkout/BasketOrderSummery"
import CheckoutBox from "@/components/checkout/CheckoutBox"
import Coupon from "@/components/checkout/Coupon"
import PaymentMethod from "@/components/checkout/PaymentMethod"
import CartBasket from "@/components/basket/CartBasket"

import { ShoppingCartIcon, ArrowLeftIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"
import { useCartStore, useDeliveryStore } from "@/store"
import { Button } from "@/components/ui/button"
import EmptyCart from "@/components/basket/EmptyCart"

// const BasketPage = () => {
//   const clearCart = useCartStore((state) => state.clearCart)
//   const router = useRouter()
//   const cart = useCartStore((state) => state.cart)
//   const setDeliveryFee = useDeliveryStore((state) => state.setDeliveryFee)
//   const { cartItemCount } = useCartStore()

//   const handleClearCart = () => {
//     clearCart()
//     setDeliveryFee(0)
//     router.push("/")
//   }

//   const handleContinueShopping = () => {
//     router.push("/products")
//   }

//   return (
//     <div className="w-full p-4 md:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
//       {/* Header Section */}
//       <div className="mb-6 md:mb-8">
//         <button
//           onClick={() => router.back()}
//           className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
//         >
//           <ArrowLeftIcon className="h-4 w-4 mr-1" />
//           Back
//         </button>

//         <div className="flex items-center space-x-3 mb-3">
//           <div className="p-2 bg-primary/10 rounded-full">
//             <ShoppingCartIcon className="h-6 w-6 md:h-8 md:w-8 text-primary" />
//           </div>
//           <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
//             Your Shopping Cart
//           </h1>
//           {cart.length > 0 && (
//             <span className="bg-primary text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
//               {cartItemCount} {cartItemCount === 1 ? "item" : "items"}
//             </span>
//           )}
//         </div>

//         {cart.length > 0 ? (
//           <p className="text-gray-600 text-sm">
//             Review the items in your cart and checkout when ready!
//           </p>
//         ) : (
//           <p className="text-gray-600 text-sm">
//             Your cart is empty. Start adding some products!
//           </p>
//         )}
//       </div>

//       {cart.length === 0 ? (
//         <EmptyCart onContinueShopping={handleContinueShopping} />
//       ) : (
//         <div className="grid lg:grid-cols-3 grid-cols-1 w-full gap-6 lg:gap-8">
//           {/* Left Section - Cart Items */}
//           <div className="w-full lg:col-span-2 space-y-6">
//             <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
//               <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
//                 <CartBasket />
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row justify-between gap-4">
//               <Button
//                 variant="outline"
//                 onClick={handleContinueShopping}
//                 className="w-full sm:w-auto"
//               >
//                 Continue Shopping
//               </Button>
//               <Button
//                 variant="destructive"
//                 onClick={handleClearCart}
//                 className="w-full sm:w-auto"
//               >
//                 Clear Cart
//               </Button>
//             </div>
//           </div>

//           {/* Right Section - Order Summary */}
//           <div className="w-full space-y-6">
//             <CheckoutBox className="bg-white rounded-lg border border-gray-200 shadow-sm">
//               <Coupon />
//             </CheckoutBox>

//             <CheckoutBox className="bg-white rounded-lg border border-gray-200 shadow-sm">
//               <BasketOrderSummery />
//             </CheckoutBox>

//             <CheckoutBox className="bg-white rounded-lg border border-gray-200 shadow-sm">
//               {/* <PaymentMethod /> */}
//               <Button
//                 onClick={() => router.push("/checkout")}
//                 className="w-full mt-4"
//               >
//                 Proceed to Checkout
//               </Button>
//             </CheckoutBox>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

const BasketPage = () => {
  const clearCart = useCartStore((state) => state.clearCart)
  const router = useRouter()
  const cart = useCartStore((state) => state.cart)
  const setDeliveryFee = useDeliveryStore((state) => state.setDeliveryFee)
  const { cartItemCount } = useCartStore()

  const handleClearCart = () => {
    clearCart()
    setDeliveryFee(0)
    router.push("/")
  }

  const handleContinueShopping = () => {
    router.push("/products")
  }

  const handleCheckout = () => {
    router.push("/checkout")
  }

  return (
    <div className="w-full p-4 md:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      {/* Header Section */}
      <div className="mb-6 md:mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back
        </button>

        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <ShoppingCartIcon className="h-6 w-6 md:h-8 md:w-8 text-primary" />
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
            Your Shopping Cart
          </h1>
          {cart.length > 0 && (
            <span className="bg-primary text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
              {cartItemCount} {cartItemCount === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {cart.length > 0 ? (
          <p className="text-gray-600 text-sm">
            Review the items in your cart and checkout when ready!
          </p>
        ) : (
          <p className="text-gray-600 text-sm">
            Your cart is empty. Start adding some products!
          </p>
        )}
      </div>

      {cart.length === 0 ? (
        <EmptyCart onContinueShopping={handleContinueShopping} />
      ) : (
        <div className="grid lg:grid-cols-3 grid-cols-1 w-full gap-6 lg:gap-8">
          {/* Left Section - Cart Items */}
          <div className="w-full lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
                <CartBasket />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <Button
                variant="outline"
                onClick={handleContinueShopping}
                className="w-full sm:w-auto"
              >
                Continue Shopping
              </Button>
              <Button
                variant="destructive"
                onClick={handleClearCart}
                className="w-full sm:w-auto"
              >
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Right Section - Order Summary */}
          <div className="w-full space-y-6">
            <div className="flex flex-col md:flex-row lg:flex-col gap-6">
              <CheckoutBox className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <Coupon />
              </CheckoutBox>

              <CheckoutBox className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <BasketOrderSummery />
                <Button
                  variant="sowgreen"
                  onClick={handleCheckout}
                  className="w-full mt-4"
                >
                  Proceed to Checkout
                </Button>
              </CheckoutBox>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BasketPage
