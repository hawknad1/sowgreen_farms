import React from "react"

const customerDetails = ({ params }: { params: { id: string } }) => {
  return <div>customerDetails{params.id}</div>
}

export default customerDetails
