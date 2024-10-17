import { Order } from "@/types"

export const ShippingInfo = ({
  shippingAddress,
}: {
  shippingAddress: Order["shippingAddress"]
}) => {
  if (!shippingAddress) return <p>No shipping address available</p>

  const { name, address, city, region, email, phone } = shippingAddress
  return (
    <div className="w-full">
      <h3 className="text-lg font-bold mb-2">Shipping Address</h3>
      <p>{name}</p>
      <p>{address}</p>
      <div className="flex">
        <p>{city}, </p>
        <p>{region}</p>
      </div>
      <p>{phone}</p>
      <p>{email}</p>
    </div>
  )
}
