export function deductBalance(
  balance: number,
  orderTotal: number
): { updatedBalance: number; updatedOrderTotal: number } {
  balance = parseFloat(balance?.toFixed(2))
  orderTotal = parseFloat(orderTotal?.toFixed(2))

  // If balance is greater than or equal to the order total, deduct the order total from the balance
  if (balance >= orderTotal && balance > 0) {
    balance -= orderTotal // Deduct full order total from balance
    orderTotal = 0 // Set order total to 0 after the deduction
    console.log(
      `Order placed successfully. Remaining balance: ${balance}, Order total is now: ${orderTotal}`
    )
  }
  // If balance is less than the order total, reduce the order total by the available balance
  else if (balance > 0 && balance < orderTotal) {
    orderTotal -= balance // Reduce order total by available balance
    balance = 0 // Set balance to 0 since it is fully used
    console.log(
      `Balance is less than the order total. Remaining balance: ${balance}, Updated order total: ${orderTotal}`
    )
  }
  // If no balance is available, leave the order total unchanged
  else {
    console.log("No balance available. Order total remains unchanged.")
  }

  // Return the updated balance and the updated order total
  return { updatedBalance: balance, updatedOrderTotal: orderTotal }
}

// Example usage
let currentBalance = 50
let orderTotal = 20

const { updatedBalance, updatedOrderTotal } = deductBalance(
  currentBalance,
  orderTotal
)
console.log(`Updated balance: ${updatedBalance}`)
console.log(`Updated order total: ${updatedOrderTotal}`)
