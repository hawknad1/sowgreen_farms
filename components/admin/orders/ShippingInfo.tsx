import { Order } from "@/types"
import ModifyShippingDialog from "./dialogs/ModifyShippingDialog"

export const ShippingInfo = ({
  shippingAddress,
}: {
  shippingAddress: Order["shippingAddress"]
}) => {
  if (!shippingAddress) return <p>No shipping address available</p>

  const { name, address, city, region, email, phone } = shippingAddress
  return (
    <div className="w-full border border-neutral-200 px-6 py-4 rounded-lg">
      <div className="flex justify-between">
        <h3 className="text-lg font-bold mb-2">Shipping Address</h3>

        <ModifyShippingDialog />
      </div>
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
