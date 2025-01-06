// "use client"

// import React, { useState } from "react"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "../../../ui/dialog"
// import { Button } from "../../../ui/button"
// import { ChevronLeft, ChevronRight, SquarePlus } from "lucide-react"
// import AddCustomerOrder from "../AddCustomerOrder"
// import ProductShippingInfo from "../ProductShippingInfo"
// import ProductSelection from "./ProductSelection"

// // const AddCustomerOrderDialog = () => {
// //   const [isDeleting, setIsDeleting] = useState(false)
// //   const [isOpen, setIsOpen] = useState(false)

// //   return (
// //     <Dialog open={isOpen} onOpenChange={setIsOpen}>
// //       <DialogTrigger asChild>
// //         <Button variant="outline" className="w-fit h-fit p-2">
// //           <SquarePlus className="h-5 w-5" />
// //         </Button>
// //       </DialogTrigger>

// //       <DialogContent>
// //         <DialogHeader>
// //           <DialogTitle>{`Create an order `}</DialogTitle>
// //           <DialogDescription>Create an order!</DialogDescription>
// //           <AddCustomerOrder />
// //         </DialogHeader>
// //         <DialogFooter></DialogFooter>
// //       </DialogContent>
// //     </Dialog>
// //   )
// // }

// // export default AddCustomerOrderDialog

// // Main Dialog Componenta
// const AddCustomerOrderDialog = () => {
//   const [isOpen, setIsOpen] = useState(false)
//   const [step, setStep] = useState(1)
//   const [basket, setBasket] = useState<any[]>([])
//   const [shippingInfo, setShippingInfo] = useState({
//     name: "",
//     address: "",
//     city: "",
//     region: "",
//     phone: "",
//   })

//   const addToBasket = (product: any) => {
//     const existing = basket.find((item) => item.id === product.id)
//     if (existing) {
//       setBasket(
//         basket.map((item) =>
//           item.id === product.id
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         )
//       )
//     } else {
//       setBasket([...basket, { ...product, quantity: 1 }])
//     }
//   }

//   const handleSubmit = () => {
//     // Submit the order (e.g., via an API)
//     const orderData = {
//       products: basket,
//       shipping: shippingInfo,
//     }
//     console.log(orderData)
//     setIsOpen(false)
//     setStep(1)
//     setBasket([])
//     setShippingInfo({ name: "", address: "", phone: "", city: "", region: "" })
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline" className="w-fit h-fit p-2">
//           <SquarePlus className="h-5 w-5" />
//         </Button>
//       </DialogTrigger>

//       <DialogContent className="max-h-[80vh] max-w-[600px] overflow-y-auto p-4">
//         <DialogHeader>
//           <DialogTitle>
//             {step === 1 ? "Add Products" : "Shipping Info"}
//           </DialogTitle>
//           <DialogDescription>
//             {step === 1
//               ? "Search and add products to the basket."
//               : "Enter the shipping information for the order."}
//           </DialogDescription>
//         </DialogHeader>

//         <div>
//           {step === 1 && (
//             <ProductSelection basket={basket} addToBasket={addToBasket} />
//           )}
//           {step === 2 && (
//             <ProductShippingInfo
//               shippingInfo={shippingInfo}
//               setShippingInfo={setShippingInfo}
//             />
//           )}
//         </div>

//         <DialogFooter className="flex justify-between">
//           {step > 1 && (
//             <Button variant="outline" onClick={() => setStep(step - 1)}>
//               <ChevronLeft className="h-4 w-4" />
//               Back
//             </Button>
//           )}
//           {step < 2 && (
//             <Button variant="outline" onClick={() => setStep(step + 1)}>
//               Next
//               <ChevronRight className="h-4 w-4" />
//             </Button>
//           )}
//           {step === 2 && (
//             <Button onClick={handleSubmit} className="bg-green-500 text-white">
//               Submit Order
//             </Button>
//           )}
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }

// export default AddCustomerOrderDialog

import React from "react"

const AddCustomerOrderDialog = () => {
  return <div>AddCustomerOrderDialog</div>
}

export default AddCustomerOrderDialog
