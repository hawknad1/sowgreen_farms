"use client"

import React, { useEffect, useState } from "react"
import CustomerDetail from "../CustomerDetail"
import { CustomerDetailType } from "@/types"

const CustomerDetailsPage = ({ params }: { params: { id: string } }) => {
  const [customerDetails, setCustomerDetails] =
    useState<CustomerDetailType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const emailFromParams = decodeURIComponent(params.id)

  console.log(customerDetails, "customerDetails")

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const response = await fetch(`/api/address/${emailFromParams}`, {
          method: "GET",
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error(
            `Failed to fetch data: ${response.status} ${response.statusText}`
          )
        }

        const customerData = await response.json()
        setCustomerDetails(customerData)
        console.log(customerData, "customerData")
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomerDetails()
  }, [emailFromParams])

  if (isLoading) {
    return <p>Loading customer details...</p>
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>
  }

  return (
    <div>
      {customerDetails ? (
        <CustomerDetail customerData={customerDetails} />
      ) : (
        <p>No customer details available.</p>
      )}
    </div>
  )
}

export default CustomerDetailsPage
