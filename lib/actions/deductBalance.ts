export function deductBalance(
  balance: number,
  orderTotal: number
): {
  updatedBalance: number
  updatedOrderTotal: number
  remainingAmount: number
  proceedToPaystack: boolean
  deductedBalance: number
} {
  // Ensure that balance and orderTotal are fixed to 2 decimal places
  balance = parseFloat(balance?.toFixed(2))
  orderTotal = parseFloat(orderTotal?.toFixed(2))

  let updatedBalance = balance
  let remainingAmount = orderTotal
  let proceedToPaystack = false
  let updatedOrderTotal = orderTotal
  let deductedBalance = balance

  // Case 1: Balance covers the entire order
  if (updatedBalance >= orderTotal) {
    updatedBalance = parseFloat((updatedBalance - orderTotal).toFixed(2))
    remainingAmount = 0
    updatedOrderTotal = 0
    deductedBalance = updatedBalance
  }
  // Case 2: Balance covers part of the order
  else if (updatedBalance >= 0.1 && updatedBalance < orderTotal) {
    remainingAmount = parseFloat((orderTotal - updatedBalance).toFixed(2))
    updatedBalance = 0
    proceedToPaystack = true
    updatedOrderTotal = remainingAmount
    deductedBalance = updatedBalance
  }
  // Case 3: No balance available
  else {
    proceedToPaystack = true
    remainingAmount = 0
    // remainingAmount = orderTotal
    // deductedBalance = balance
  }

  return {
    updatedBalance,
    updatedOrderTotal,
    remainingAmount,
    proceedToPaystack,
    deductedBalance,
  }
}
