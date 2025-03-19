"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { CreditSchema } from "@/schemas"
import { useState } from "react"

interface CustomerProps {
  customer: any
}

const UpdateBalanceForm = ({ customer }: CustomerProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [resetBalance, setResetBalance] = useState(false)
  const [availableBalance, setAvailableBalance] = useState(
    customer?.balance || 0
  )

  const form = useForm<z.infer<typeof CreditSchema>>({
    resolver: zodResolver(CreditSchema),
    defaultValues: {
      email: customer?.email,
      phone: customer?.phone,
      amount: "", // Initialize "Enter Balance" field to empty string
    },
  })

  const handleResetBalance = () => {
    setResetBalance(true) // Disable the reset button
    setAvailableBalance(0) // Reset available balance to 0
    form.reset({ amount: "0" }) // Reset the "Enter Balance" field
  }

  const onSubmit = async (values: z.infer<typeof CreditSchema>) => {
    const newBalance = availableBalance + parseFloat(values.amount) // Calculate new balance

    setIsLoading(true)
    try {
      const response = await fetch("/api/balance", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          phone: values.phone,
          updatedBalance: newBalance, // Send the accumulated balance
        }),
      })

      if (response.ok) {
        toast.success("Balance updated successfully!")
        setAvailableBalance(newBalance) // Update the available balance state
        form.reset({ amount: "" }) // Reset the "Enter Balance" field
        window.location.reload()
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to update balance")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Input */}
        <div className="md:inline-flex w-full gap-x-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter user email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Input */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter phone number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Amount Input */}
        <div className="flex items-center gap-x-4 w-full">
          <div className="flex flex-col gap-y-4 w-full">
            <FormLabel className="font-semibold">Reset Balance</FormLabel>
            <Button
              variant="destructive"
              disabled={resetBalance}
              onClick={handleResetBalance}
            >
              Reset Balance
            </Button>
          </div>
          <div className="w-full">
            <FormItem className="w-full">
              <FormLabel className="font-semibold">Available Balance</FormLabel>
              <FormControl>
                <Input type="number" disabled value={availableBalance} />
              </FormControl>
            </FormItem>
          </div>
          <div className="w-full">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-semibold">Enter Balance</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter amount"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-sowgren_Color hover:bg-sowgren_Color/85 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : (
            "Update Balance"
          )}
        </Button>
      </form>
    </Form>
  )
}

export default UpdateBalanceForm

// const UpdateBalanceForm = ({ customer }: CustomerProps) => {
//   const router = useRouter()
//   const [isLoading, setIsLoading] = useState(false)
//   const [resetBalance, setResetBalance] = useState(false)
//   const [availableBalance, setAvailableBalance] = useState(
//     customer?.balance || 0
//   )

//   const form = useForm<z.infer<typeof CreditSchema>>({
//     resolver: zodResolver(CreditSchema),
//     defaultValues: {
//       email: customer?.email,
//       phone: customer?.phone,
//       amount: "", // Initialize "Enter Balance" field to 0
//     },
//   })

//   const handleResetBalance = () => {
//     setResetBalance(true) // Disable the reset button
//     setAvailableBalance(0) // Reset available balance to 0
//   }

//   const onSubmit = async (values: z.infer<typeof CreditSchema>) => {
//     const newBalance = availableBalance + parseFloat(values.amount) // Calculate new balance
//     console.log(values, "VALUES")

//     setIsLoading(true)
//     try {
//       const newBalance = availableBalance + values.amount // Calculate new balance

//       const response = await fetch("/api/balance", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: values.email,
//           phone: values.phone,
//           updatedBalance: newBalance, // Send the accumulated balance
//         }),
//       })

//       if (response.ok) {
//         toast.success("Balance updated successfully!")
//         setAvailableBalance(newBalance) // Update the available balance state
//         window.location.reload()
//         form.reset({ amount: 0 }) // Reset the "Enter Balance" field
//       } else {
//         const error = await response.json()
//         toast.error(error.message || "Failed to update balance")
//       }
//     } catch (error) {
//       toast.error("An unexpected error occurred")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
//         {/* Email Input */}
//         <div className="md:inline-flex w-full gap-x-3">
//           <FormField
//             control={form.control}
//             name="email"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormLabel>Email</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="email"
//                     placeholder="Enter user email"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {/* Phone Input */}
//           <FormField
//             control={form.control}
//             name="phone"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormLabel>Phone</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="text"
//                     placeholder="Enter phone number"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         {/* Amount Input */}
//         <div className="flex items-center gap-x-4 w-full">
//           <div className="flex flex-col gap-y-4 w-full">
//             <FormLabel className="font-semibold">Reset Balance</FormLabel>
//             <Button
//               variant="destructive"
//               disabled={resetBalance}
//               onClick={handleResetBalance}
//             >
//               Reset Balance
//             </Button>
//           </div>
//           <div className="w-full">
//             <FormItem className="w-full">
//               <FormLabel className="font-semibold">Available Balance</FormLabel>
//               <FormControl>
//                 <Input type="number" disabled value={availableBalance} />
//               </FormControl>
//             </FormItem>
//           </div>
//           <div className="w-full">
//             <FormField
//               control={form.control}
//               name="amount"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   <FormLabel className="font-semibold">Enter Balance</FormLabel>
//                   <FormControl>
//                     <Input
//                       // type="number"
//                       placeholder="Enter amount"
//                       {...field}
//                       // onChange={(e) => field.onChange(Number(e.target.value))}
//                       onChange={(e) => field.onChange(e.target.value)}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//         </div>

//         <Button
//           type="submit"
//           className="w-full bg-sowgren_Color hover:bg-sowgren_Color/85 text-white"
//           disabled={isLoading}
//         >
//           {isLoading ? (
//             <span className="loading loading-spinner loading-md"></span>
//           ) : (
//             "Update Balance"
//           )}
//         </Button>
//       </form>
//     </Form>
//   )
// }

// export default UpdateBalanceForm
