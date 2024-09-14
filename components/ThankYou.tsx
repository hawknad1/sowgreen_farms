import { ProductOrder, ShippingAddress } from "@/types"
import React from "react"

interface ThankYouProps {
  orderNumber: string
  referenceNumber: string
  total: number
  deliveryMethod: string
  shippingAddress: ShippingAddress
  products: ProductOrder[]
}

const ThankYou = ({
  deliveryMethod,
  orderNumber,
  products,
  referenceNumber,
  shippingAddress,
  total,
}: ThankYouProps) => {
  return (
    <div>
      <h1>Thank You for Your Order</h1>
      <p>Order Number: {orderNumber}</p>
      <p>Reference Number: {referenceNumber}</p>
      <p>Total: ${total.toFixed(2)}</p>
      <p>Delivery Method: {deliveryMethod}</p>
      <p>
        Shipping Address: {shippingAddress.address}, {shippingAddress.city},{" "}
        {shippingAddress.region}
      </p>
      <div>
        <h2>Products Ordered</h2>
        {/* <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product?.order} - Quantity: {product.quantity}
            </li>
          ))}
        </ul> */}
      </div>
    </div>
  )
}

export default ThankYou
