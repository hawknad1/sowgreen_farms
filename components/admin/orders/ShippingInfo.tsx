import { Order } from "@/types"
import ModifyShippingDialog from "./dialogs/ModifyShippingDialog"

export const ShippingInfo = ({ order }: { order: Order }) => {
  if (!order?.shippingAddress) return <p>No shipping address available</p>

  const { name, address, city, region, email, phone } = order?.shippingAddress
  return (
    <div className="w-full border border-neutral-200 px-6 py-4 rounded-lg">
      <div className="flex justify-between flex-wrap">
        <h3 className="text-base lg:text-lg font-bold mb-2">
          Shipping Address
        </h3>

        <ModifyShippingDialog order={order} />
      </div>
      <div className="flex flex-col gap-y-1 mt-2 ">
        <p className="text-sm lg:text-base text-neutral-600">{name}</p>
        <p className="text-sm lg:text-base text-neutral-600">{address}</p>
        <div className="flex">
          <p className="text-sm lg:text-base text-neutral-600">{city}, </p>
          <p className="text-sm lg:text-base text-neutral-600">{region}</p>
        </div>
        <p className="text-sm lg:text-base text-neutral-600">{phone}</p>
        <p className="text-sm lg:text-base text-neutral-600">{email}</p>
      </div>
    </div>
  )
}
