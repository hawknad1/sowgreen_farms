export const verifyTransaction = async (reference: string) => {
  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, // Use your secret key
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      throw new Error("Failed to verify transaction")
    }

    const data = await response.json()

    if (data.status && data.data) {
      const { channel, authorization } = data.data

      return {
        paymentMode: channel, // 'card', 'bank', 'ussd', etc.
        cardType: authorization.card_type, // e.g., 'Visa', 'MasterCard'
        last4Digits: authorization.last4, // Last 4 digits of the card
      }
    } else {
      throw new Error("Invalid transaction data")
    }
  } catch (error) {
    console.error("Error verifying transaction:", error)
    return null
  }
}
