// import React from "react"
// import { Button } from "../ui/button"
// import { Separator } from "../ui/separator"

// const Coupon = () => {
//   return (
//     <div className="flex flex-col gap-2 w-full">
//       <h2 className="text-lg font-semibold">Coupon Code</h2>
//       <Separator className="my-3 h-0.5" />
//       <form className="flex-1 flex flex-col gap-y-4">
//         <input
//           type="text"
//           placeholder="Enter Your Coupon Code"
//           className="bg-slate-50 p-2 py-2 outline-none text-sm w-full rounded-md"
//         />
//         <Button variant="outline">Apply Your Coupon</Button>
//       </form>
//     </div>
//   )
// }

// export default Coupon

import React from "react"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"

const Coupon = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Coupon Code</h2>
      <Separator className="bg-gray-200" />

      <form className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Enter coupon code"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <Button
          type="submit"
          variant="outline"
          className="w-full border-primary text-primary hover:bg-primary/10"
        >
          Apply Coupon
        </Button>
      </form>
    </div>
  )
}

export default Coupon
