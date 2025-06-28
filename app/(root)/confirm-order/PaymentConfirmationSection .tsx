"use client"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { useUserStore } from "@/store"
import { Loader2 } from "lucide-react"

interface PaymentConfirmationSectionProps {
  formattedSubtotal?: string
  formattedDelivery?: string
  deliveryFee: number
  deductedBalance: number
  updatedOrderTotal: number
  formattedTotal: string
  balance: number | undefined | null
  total: number
  isConfirming: boolean
  router: {
    push: (path: string) => void
  }
  handlePaystackSuccessAction: (reference: {
    status: string
    reference: string
  }) => Promise<void>
  remainingAmount: number
}

// Extracted Payment Confirmation Section for better readability
const PaymentConfirmationSection = ({
  formattedSubtotal,
  formattedDelivery,
  deductedBalance,
  deliveryFee,
  formattedTotal,
  balance,
  total,
  updatedOrderTotal,
  isConfirming,
  router,
  handlePaystackSuccessAction,
  remainingAmount,
}: PaymentConfirmationSectionProps) => {
  const { user } = useUserStore()

  return (
    <>
      <div className="bg-blue-50/50 p-4 sm:p-6 rounded-lg border border-blue-100 mb-6">
        {/* <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Total</h3> */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-gray-700">
            <span>Subtotal:</span>
            <span className="font-medium">{formattedSubtotal}</span>
          </div>
          <div className="flex justify-between items-center text-gray-700">
            <span>Delivery Fee:</span>
            <span className="font-medium">{formattedDelivery}</span>
          </div>

          {/* <div className="flex justify-between items-center font-semibold">
            <span
              className={`${
                balance >= 0 ? "text-emerald-500" : "text-red-500"
              }`}
            >
              Credit Bal:
            </span>
            <span
              className={`${
                balance >= 0 ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {formatCurrency(balance, "GHS")}
            </span>
          </div> */}
          <div
            className={`flex justify-between ${
              balance < 0 ? " text-red-600" : " text-green-600"
            }`}
          >
            <span>{balance < 0 ? "Balance Due" : "Credit Balance"}</span>
            <span className="font-medium">
              {formatCurrency(Math.abs(balance), "GHS")}
            </span>
          </div>
          <div className="flex justify-between items-center text-gray-700">
            <span>Total Amount:</span>
            <span className="font-medium">
              {formatCurrency(total + deliveryFee, "GHS")}
            </span>
          </div>
          <div className="border-t border-gray-300 pt-3 mt-3 flex justify-between items-center text-xl font-bold text-primary">
            <span className="font-bold text-red-500 text-base">Total Due:</span>
            {balance > 0 || balance < 0 ? (
              <p className=" text-red-500 text-base">
                {formatCurrency(Number(updatedOrderTotal), "GHS") || "No total"}
              </p>
            ) : (
              <p className=" font-bold text-red-500 text-base">
                {formatCurrency(total + deliveryFee, "GHS") || "No total"}
              </p>
            )}
          </div>
        </div>

        {/* {balance !== undefined &&
          balance !== null &&
          balance < combinedTotal && (
            <div className="mt-4 p-3 bg-red-50 rounded-md border border-red-200">
              <p className="text-sm text-red-600">
                <span className="font-semibold">Notice:</span> Your account
                balance is insufficient for the full order.
              </p>
            </div>
          )} */}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <Button
          disabled={isConfirming}
          onClick={() => router.push("/basket")}
          variant="outline"
          className="w-full border-primary text-primary hover:bg-primary/5 hover:text-primary/90 h-12 text-base"
        >
          Edit Order
        </Button>

        <Button
          onClick={() =>
            handlePaystackSuccessAction({
              status: "success",
              reference: "cash-on-delivery",
            })
          }
          disabled={isConfirming}
          className="w-full h-12 text-base font-medium"
          variant="sowgreen"
        >
          {isConfirming ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing Order...
            </span>
          ) : (
            "Place Order"
          )}
        </Button>
        {/* 
        {remainingAmount > 0 && (
          <Button
            disabled={isConfirming}
            onClick={() => alert("Paystack Integration Here!")}
            variant="secondary"
            className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white"
          >
            Pay Now with Card ({formatCurrency(remainingAmount, "GHS")})
          </Button>
        )} */}
      </div>
    </>
  )
}

export default PaymentConfirmationSection
