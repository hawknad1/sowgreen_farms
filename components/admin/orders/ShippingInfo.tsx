import { Order } from "@/types"
import ModifyShippingDialog from "./dialogs/ModifyShippingDialog"
import Card from "@/app/(root)/confirm-order/Card"

export const ShippingInfo = ({
  order,
  balance,
}: {
  order: Order
  balance: number
}) => {
  if (!order?.shippingAddress) return <p>No shipping address available</p>

  const { name, address, city, region, email, phone } = order?.shippingAddress
  return (
    <Card className="min-h-[210px] px-6 py-4">
      <div className="flex justify-between flex-wrap">
        <h3 className="text-base lg:text-lg font-bold mb-2">Address</h3>

        <ModifyShippingDialog order={order} balance={balance} />
      </div>
      <div className="flex flex-col gap-y-1 mt-2 lg:mt-1 ">
        <p className="text-sm lg:text-base text-neutral-600">{name}</p>
        <p className="text-sm lg:text-base text-neutral-600">{address}</p>
        <div className="flex">
          <p className="text-sm lg:text-base text-neutral-600">{city}, </p>
          <p className="text-sm lg:text-base text-neutral-600">{region}</p>
        </div>
        <p className="text-sm lg:text-base text-neutral-600">{phone}</p>
        <p className="text-sm lg:text-base text-neutral-600">{email}</p>
      </div>
    </Card>
  )
}
