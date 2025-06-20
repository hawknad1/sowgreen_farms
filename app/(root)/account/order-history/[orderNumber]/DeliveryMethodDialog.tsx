// "use client"

import EditShippingDetails from "@/components/admin/orders/EditShippingDetails"
import { AlertDestructive } from "@/components/alerts/AlertDestructive"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Order, ShippingAddress } from "@/types"
import { PencilSquareIcon } from "@heroicons/react/20/solid"
import { useState } from "react"

// import React, { useState } from "react"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Order } from "@/types"
// import { AlertDestructive } from "@/components/alerts/AlertDestructive"
// import ChangeDeliveryMethodForm from "./ChangeDeliveryMethodForm"

// interface Props {
//   order: Order
//   className?: string
// }

// const ChangeDeliveryMethodDialog = ({ order }: Props) => {
//   const [isOpen, setIsOpen] = useState(false)

//   const buttonDisabled =
//     order?.status === "cancelled" || order?.paymentAction === "paid"

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         <Button
//           disabled={buttonDisabled}
//           variant="secondary"
//           className={`${
//             order?.status === "confirmed" &&
//             "bg-slate-800 text-white hover:text-black font-medium w-full md:w-fit"
//           } text-xs bg-sowgren_Color text-white hover:bg-sowgren_Color/85 lg:text-sm tracking-wide border border-slate-300 w-full md:w-fit`}
//         >
//           Change Delivery
//         </Button>
//       </DialogTrigger>

//       <DialogContent
//         className={` ${
//           order?.status === "confirmed"
//             ? "max-w-2xl h-96 lg:h-fit p-1"
//             : "max-w-2xl md:h-96 lg:h-fit flex flex-col py-3 lg:scrollbar-hide overflow-y-scroll rounded-lg"
//         }`}
//       >
//         {order?.status === "confirmed" ? (
//           <AlertDestructive
//             message="Your order is being confirmed and cannot be modified at this moment.
//             Kindly call Sowgreen Organic on 0546729407 / 0544437775 for assistance.
//             Thank you!"
//           />
//         ) : (
//           <>
//             <DialogHeader className="px-6 py-2">
//               <DialogTitle className="flex items-center justify-between">
//                 Change Delivery Method
//               </DialogTitle>
//             </DialogHeader>

//             <DialogDescription className="flex-grow">
//               <ChangeDeliveryMethodForm order={order} />
//             </DialogDescription>

//             <DialogFooter />
//           </>
//         )}
//       </DialogContent>
//     </Dialog>
//   )
// }

// export default ChangeDeliveryMethodDialog

interface Props {
  shippingAddress?: ShippingAddress
  children?: React.ReactNode
  className?: string
  order: Order
  balance?: number
  updatedOrderTotal?: number
}

const ChangeDeliveryMethodDialog = ({
  order,
  balance,
  updatedOrderTotal,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const buttonDisabled =
    order?.status === "cancelled" ||
    order?.status === "delivered" ||
    order?.paymentAction === "paid"

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`${
            order?.status === "confirmed" &&
            "bg-slate-800 text-white hover:text-black font-medium w-full md:w-fit"
          } text-xs bg-sowgren_Color text-white hover:bg-sowgren_Color/85 hover:text-white lg:text-sm tracking-wide border border-slate-300 w-full md:w-fit`}
          disabled={buttonDisabled}
        >
          Change Delivery
          {/* <PencilSquareIcon className="h-5 w-5" /> */}
        </Button>
      </DialogTrigger>

      <DialogContent
        className={` ${
          order?.status === "confirmed" ||
          order?.status === "in-transit" ||
          order?.status === "delivered"
            ? "max-w-2xl h-fit p-1 rounded-lg"
            : "max-w-3xl h-[500px] flex flex-col py-3 rounded-lg"
        }`}
      >
        {order?.status === "confirmed" ||
        order?.status === "in-transit" ||
        order?.status === "delivered" ? (
          <AlertDestructive
            message="Your order is being confirmed and cannot be modified at this moment. 
                    Kindly call Sowgreen Organic on 0546729407 / 0544437775 for assistance. 
                    Thank you!"
          />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{`Modify Delivery Method.`}</DialogTitle>
              <DialogDescription>
                Update delivery method and shipping address
              </DialogDescription>
            </DialogHeader>
            <EditShippingDetails order={order} balance={balance} />
            <DialogFooter></DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ChangeDeliveryMethodDialog
