// import PaystackButton from "@/components/paystackButton"
import { useUserListStore } from "@/store"
import { Order } from "@/types"
import React from "react"
import toast from "react-hot-toast"
import { PaystackButton } from "react-paystack"

interface OrderProps {
  order: Order
  updatedBalance?: number
  disablePayNow?: boolean
}

const PaystackPayNow = ({
  order,
  updatedBalance,
  disablePayNow,
}: OrderProps) => {
  const { setBalance } = useUserListStore()
  const handlePaystackSuccessAction = async (
    reference: any,
    orderId: string
  ) => {
    try {
      // First POST request to verify the transaction
      const payRes = await fetch(`/api/verify-transaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: reference.reference }),
      })

      if (!payRes.ok) throw new Error("Transaction verification failed")

      // Parse the response from the first POST request
      const payData = await payRes.json()

      // Second PUT request to update the order
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentAction: "paid",
          referenceNumber: reference.reference,
          cardType: payData.cardType,
          last4Digits: payData.last4Digits,
          paymentMode: payData.paymentMode, // Include additional fields if needed
        }),
      })

      if (!res.ok) throw new Error("Payment update failed")

      await fetch("/api/balance", {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          email: order?.shippingAddress?.email,
          updatedBalance,
          phone: order?.shippingAddress?.phone,
        }),
      })

      setBalance(updatedBalance)

      // Notify success
      toast.success("Payment was successful!")
      window.location.reload()
    } catch (error) {
      console.error(error)
      toast.error("Failed to update payment status")
    }
  }

  const generatePaystackConfig = (order: Order) => ({
    reference: new Date().getTime().toString(),
    email: order?.shippingAddress?.email || "",
    amount: Math.round(order?.updatedOrderTotal * 100),
    currency: "GHS",
    metadata: {
      custom_fields: [
        {
          display_name: "Name",
          variable_name: "name",
          value: order.shippingAddress?.name || "N/A",
        },
        {
          display_name: "Phone",
          variable_name: "phone",
          value: order.shippingAddress?.phone || "N/A",
        },
      ],
    },
    publicKey: process.env.PAYSTACK_PUBLIC_TEST_KEY || "",
    text: "Pay now",
    onSuccess: (reference?: any) =>
      handlePaystackSuccessAction(reference, order.id),
    onClose: () => console.log("Payment dialog closed"),
  })

  return (
    <>
      {order?.paymentMode === "cash" &&
      order?.paymentAction === "pending" &&
      order?.status === "confirmed" ? (
        // <PaystackButton
        //   {...generatePaystackConfig(order)}
        //   disabled={disablePayNow}
        //   className={`bg-green-700 text-white w-full ${
        //     disablePayNow
        //       ? "opacity-50 cursor-not-allowed rounded-lg"
        //       : "font-semibold px-4 py-2 rounded-lg hover:bg-green-600 transition"
        //   } `}
        // />
        <PaystackButton
          {...generatePaystackConfig(order)}
          className={`bg-green-700 text-white w-full font-semibold px-4 py-2 rounded-lg hover:bg-green-600 transition
        `}
        />
      ) : order?.paymentAction === "paid" ? (
        <p className="bg-emerald-500/15 text-emerald-500 text-base font-medium w-fit flex items-center px-4 rounded-md">
          Paid
        </p>
      ) : (
        <p className="text-red-500 bg-red-500/15 text-base font-medium flex items-center px-4 rounded-md w-fit">
          Pending
        </p>
      )}
    </>
  )
}

export default PaystackPayNow
