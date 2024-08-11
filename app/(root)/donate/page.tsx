"use client"
import React, { useEffect, useState } from "react"
import { PaystackButton } from "react-paystack"
import { PaystackProps } from "react-paystack/dist/types"

// Define type for metadata (based on Paystack's requirements)
interface Metadata {
  name: string
  phone?: string
}

type ReferenceObj = {
  message: string
  reference: string
  status: "success" | "failure"
  trans: string
  transaction: string
  trxref: string
}

const Donate = () => {
  const [ref, setRef] = useState("")
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [phone, setPhone] = useState<string | undefined>(undefined)
  const [amount, setAmount] = useState<number>(0)
  const [success, setSuccess] = useState(false)

  const config: PaystackProps = {
    reference: ref,
    email: email,
    firstname: name,
    amount: (amount * 100) | 0,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string, // Make sure this is correct
    currency: "GHS",
  }

  useEffect(() => {
    setSuccess(false)
    setRef("" + Math.floor(Math.random() * 1000000000 + 1))
  }, [success])

  const onSuccess = async (reference: ReferenceObj) => {
    console.log(reference)
    const res = await fetch(`/api/verify/${reference.reference}`)
    const verifyData = await res.json()

    if (verifyData.data.status === "success") {
      setSuccess(true)
      setEmail("")
      setAmount(0)
      setName("")
    }
  }

  const onClose = () => {
    alert("Payment cancelled.")
  }

  const componentProps = {
    ...config,
    text: `Pay GHC${amount | 0}`,
    onSuccess,
    onClose,
  }

  return (
    <div className="flex flex-col max-w-lg justify-center items-center gap-4">
      <input
        type="text"
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-slate-400 rounded-lg p-2"
      />
      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-slate-400 rounded-lg p-2"
      />
      <input
        type="number"
        placeholder="amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="border border-slate-400 rounded-lg p-2"
      />
      <input
        type="text" // Changed to text to handle phone numbers
        placeholder="phone"
        value={phone || ""} // Ensure value is a string or empty string
        onChange={(e) => setPhone(e.target.value)}
        className="border border-slate-400 rounded-lg p-2"
      />
      <PaystackButton {...componentProps} />
    </div>
  )
}

export default Donate
