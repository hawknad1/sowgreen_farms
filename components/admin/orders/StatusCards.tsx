import { orderStatusCard } from "@/constants"
import { Order } from "@/types"

const StatusCards = ({
  orderStatus,
  orders,
}: {
  orderStatus?: typeof orderStatusCard
  orders?: Order
}) => (
  <div className="flex items-center gap-x-3 justify-between w-full ">
    {orderStatus?.map(({ title, subTitle, status, icon: Icon }, index) => (
      <div key={index} className="w-full">
        <div
          className={`   ${
            status === orders?.status
              ? "border-2 border-emerald-500 shadow "
              : "border border-neutral-200 shadow-sm"
          } flex gap-x-4 items-center py-2 px-3 rounded-lg  sm:w-auto`}
        >
          <div className={`p-2 rounded-md bg-green-400`}>
            <Icon className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">{title}</h2>
            <p className="text-sm text-gray-500">{subTitle}</p>
          </div>
        </div>
      </div>
    )) || <p>No status available</p>}
  </div>
)

export default StatusCards
