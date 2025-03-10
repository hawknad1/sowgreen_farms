import { Order } from "@/types"

export const updateBalance = async (order: Order) => {
  if (
    !order?.shippingAddress?.email ||
    !order?.updatedBalance ||
    !order?.shippingAddress?.phone
  ) {
    throw new Error("Incomplete data for updating balance.")
  }

  const balanceResponse = await fetch("/api/balance", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: order.shippingAddress.email,
      updatedBalance: order.updatedBalance,
      phone: order.shippingAddress.phone,
    }),
  })

  if (!balanceResponse.ok) {
    const error = await balanceResponse.json()
    throw new Error(error.message || "Failed to update balance")
  }
}
