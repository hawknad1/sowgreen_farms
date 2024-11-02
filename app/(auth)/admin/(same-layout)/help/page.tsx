import { initializePurchaseCounts } from "@/scripts/initializePurchase"
import React from "react"

const Help = () => {
  initializePurchaseCounts()
  console.log("it has run----")
  return <div>Help</div>
}

export default Help
