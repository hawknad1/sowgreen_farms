"use client"
import { usePaymentStore } from "@/store"
import { useEffect } from "react"

const ThankYouPage = () => {
  const reference = usePaymentStore((state) => state.reference)

  useEffect(() => {
    if (reference) {
      console.log("Payment Reference:", reference)
    }
  }, [reference])

  return (
    <div className="container mx-auto min-h-screen p-8 bg-gray-100">
      <div className="mx-auto bg-white shadow-md rounded-lg p-6 max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Thank You for Your Order!
        </h2>
        <p className="text-center text-gray-600">
          Your payment was successful. Your reference number is{" "}
          {reference?.reference}.
        </p>
      </div>
    </div>
  )
}

export default ThankYouPage
