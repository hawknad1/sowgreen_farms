import React from "react"
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Img,
  Hr,
} from "@react-email/components"
import { ShippingAddress } from "@/types"
import { date } from "@/lib/utils"

interface OrderConfirmationEmailProps {
  order: Order
}

export type Order = {
  id: string
  orderNumber: string
  referenceNumber: string
  total: number
  status: "processing" | "shipped" | "delivered"
  dispatchRider?: string
  deliveryMethod: string
  deliveryFee: number
  shippingAddress: ShippingAddress
  products: ProductOrder[]
  createdAt: string | Date
}

export type ProductOrder = {
  item: {
    id: string
    title: string
    categoryName: string
    description: string
    imageUrl: string
    price: number
    weight: number
    unit: string
    isInStock: string
    discount: number
    quantity: number
    purchaseCount: number
    createdAt: string
    updatedAt: string
  }
  total: number
  quantity: number
}

const OrderConfirmationEmail: React.FC<OrderConfirmationEmailProps> = ({
  order,
}) => {
  console.log(order?.createdAt, "date")
  return (
    <Html>
      <Head />
      <Preview>Your Order Has Been Confirmed!</Preview>
      <Body style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <Container
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            padding: "24px",
            maxWidth: "600px",
            margin: "0 auto",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Header */}
          <Heading
            style={{ fontSize: "24px", color: "#1f2937", marginBottom: "16px" }}
          >
            Order Confirmation
          </Heading>
          <Text
            style={{ fontSize: "18px", color: "#374151", marginBottom: "24px" }}
          >
            Hi {order?.shippingAddress.name},
          </Text>
          <Text style={{ color: "#4b5563", marginBottom: "24px" }}>
            Thank you for your purchase! Your order{" "}
            <strong>#{order?.orderNumber}</strong> has been successfully placed
            on {date}.
          </Text>

          {/* Order Summary */}
          <Section
            style={{ color: "#4b5563", fontSize: "14px", marginBottom: "24px" }}
          >
            <Text>
              <strong>Name:</strong> {order?.shippingAddress.name}
            </Text>
            <Text>
              <strong>Shipping Address:</strong>{" "}
              {order?.shippingAddress.address}, {order?.shippingAddress.city},{" "}
              {order?.shippingAddress.region}.
            </Text>
            <Text>
              <strong>Delivery Method:</strong> {order?.deliveryMethod}
            </Text>
          </Section>

          <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

          {/* Product List */}
          {/* Product List */}
          <Section style={{ marginBottom: "24px" }}>
            {order?.products?.length > 0 ? (
              order.products.map((product: ProductOrder, index) => (
                <table
                  key={index}
                  width="100%"
                  cellPadding="0"
                  cellSpacing="0"
                  style={{
                    width: "100%",
                    marginBottom: "16px",
                    borderBottom: "1px solid #e5e7eb",
                    paddingBottom: "16px",
                  }}
                >
                  <tbody>
                    <tr>
                      {/* Image */}
                      <td width="70" style={{ paddingRight: "16px" }}>
                        {product?.item?.imageUrl && (
                          <Img
                            src={product.item.imageUrl}
                            alt={product.item.title || "Product Image"}
                            width="60"
                            height="60"
                            style={{
                              display: "block",
                              backgroundColor: "#ffffff",
                              borderRadius: "8px",
                              objectFit: "contain",
                            }}
                          />
                        )}
                      </td>

                      {/* Title */}
                      <td style={{ textAlign: "left" }}>
                        <Text style={{ fontWeight: "600", color: "#1f2937" }}>
                          {product?.item?.title || "No Title"}
                        </Text>
                      </td>

                      {/* Quantity */}
                      <td style={{ textAlign: "center" }}>
                        <Text style={{ color: "#6b7280", fontSize: "14px" }}>
                          Qty {product.quantity}
                        </Text>
                      </td>

                      {/* Price */}
                      <td style={{ textAlign: "right" }}>
                        <Text style={{ fontWeight: "500", color: "#1d4ed8" }}>
                          {`GHS ${(
                            product.item.price * product.quantity
                          ).toFixed(2)}`}
                        </Text>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ))
            ) : (
              <Text style={{ color: "#4b5563" }}>
                No products in this order.
              </Text>
            )}
          </Section>

          {/* <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} /> */}

          {/* Pricing Summary */}
          <Section style={{ color: "#4b5563", fontSize: "14px" }}>
            <Text>
              <strong>Subtotal:</strong> {`GHS ${order.total.toFixed(2)}`}
            </Text>
            <Text>
              <strong>Shipping Fee:</strong>{" "}
              {`GHS ${order.deliveryFee.toFixed(2)}`}
            </Text>
            <Heading
              style={{ fontSize: "20px", color: "#1d4ed8", marginTop: "16px" }}
            >
              Total: {`GHS ${(order.total + order.deliveryFee).toFixed(2)}`}
            </Heading>
          </Section>

          <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

          {/* Footer */}
          <Text
            style={{
              fontSize: "12px",
              color: "#6b7280",
              marginTop: "32px",
              lineHeight: "1.5",
            }}
          >
            We appreciate your business and hope you enjoy your purchase. If you
            have any questions, feel free to reach out to our customer support.
          </Text>
          <Text
            style={{ fontSize: "12px", color: "#374151", marginTop: "16px" }}
          >
            Best regards, <br />
            Sowgreen Organic
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default OrderConfirmationEmail
