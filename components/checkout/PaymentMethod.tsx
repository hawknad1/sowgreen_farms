// "use client"
// import React from "react"
// import Image from "next/image"

// import { Separator } from "../ui/separator"
// import { Button } from "../ui/button"
// import { useRouter } from "next/navigation"

// const PaymentMethod = () => {
//   const router = useRouter()
//   return (
//     <div className="flex flex-col gap-4">
//       <h2 className="text-lg font-semibold divide-y-4 divide-black ">
//         Payment Method
//       </h2>
//       <Separator className=" h-0.5" />
//       <div className="flex items-center justify-between gap-2">
//         <div className="bg-slate-100/70 px-2 rounded-lg cursor-pointer">
//           <Image
//             src="/images/mtn.png"
//             alt="Mtn logo"
//             width={50}
//             height={50}
//             className="h-10 w-12 object-contain"
//           />
//         </div>
//         <div className="bg-slate-100/70 px-2 rounded-lg cursor-pointer">
//           <Image
//             src="/images/mastercard.png"
//             alt="Mtn logo"
//             width={50}
//             height={50}
//             className="h-10 w-12 object-contain"
//           />
//         </div>
//         <div className="bg-slate-100/70 px-2 rounded-lg cursor-pointer">
//           <Image
//             src="/images/visa.png"
//             alt="Mtn logo"
//             width={50}
//             height={50}
//             className="h-10 w-12 object-contain"
//           />
//         </div>
//         <div className="bg-slate-100/70 px-2 rounded-lg cursor-pointer">
//           <Image
//             src="/images/paypal.png"
//             alt="Mtn logo"
//             width={50}
//             height={50}
//             className="h-10 w-12 object-contain"
//           />
//         </div>
//       </div>
//       <Button onClick={() => router.push("/checkout")}>Checkout</Button>
//     </div>
//   )
// }

// export default PaymentMethod

"use client"
import React from "react"
import Image from "next/image"
import { Separator } from "../ui/separator"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

const PaymentMethod = () => {
  const router = useRouter()

  const paymentMethods = [
    { id: "mtn", name: "MTN Mobile Money", logo: "/images/mtn.png" },
    { id: "mastercard", name: "Mastercard", logo: "/images/mastercard.png" },
    { id: "visa", name: "Visa", logo: "/images/visa.png" },
    { id: "paypal", name: "PayPal", logo: "/images/paypal.png" },
  ]

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
      <Separator className="bg-gray-200" />

      <div className="grid grid-cols-2 gap-3">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary transition-colors cursor-pointer"
          >
            <Image
              src={method.logo}
              alt={method.name}
              width={40}
              height={40}
              className="h-8 w-8 object-contain mr-3"
            />
            <span className="text-sm font-medium">{method.name}</span>
          </div>
        ))}
      </div>

      <Button onClick={() => router.push("/checkout")} className="w-full mt-4">
        Proceed to Checkout
      </Button>
    </div>
  )
}

export default PaymentMethod
