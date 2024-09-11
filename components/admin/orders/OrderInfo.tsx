import { Order } from "@/types"

export const OrderInfo = ({ orders }: { orders: Order }) => {
  if (!orders) return null

  const { orderNumber, referenceNumber, total, deliveryMethod } = orders
  return (
    <div className="w-full">
      <h3 className="text-lg font-bold mb-2">Order Details</h3>
      <p className="font-medium">
        <span className="text-sm text-neutral-500">Order Number: </span>{" "}
        {orderNumber}
      </p>
      <p className="font-medium">
        <span className="text-sm text-neutral-500">Reference Number: </span>{" "}
        {referenceNumber}
      </p>
      <p className="font-medium">
        <span className="text-sm text-neutral-500">Order Total: </span> GHC{" "}
        {total}
      </p>
      <p className="font-medium">
        <span className="text-sm text-neutral-500">Delivery Method: </span>{" "}
        {deliveryMethod}
      </p>
    </div>
  )
}
