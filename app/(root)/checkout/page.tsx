"use client"
import React from "react"
import { CheckoutForm } from "./CheckoutForm"
import { useCartStore } from "@/store"
import { redirect } from "next/navigation"

const CheckoutPage = () => {
  const cart = useCartStore((state) => state.cart)

  // if (cart.length === 0) {
  //   redirect("/products")
  // }
  return (
    <div className="container mx-auto min-h-screen px-4 py-8">
      <div className="p-4 rounded-lg flex flex-col md:flex-row md:gap-8">
        <CheckoutForm />
      </div>
    </div>
  )
}

export default CheckoutPage
