import { orderStatusCard } from "@/constants"

const StatusCard = ({
  orderStatus,
}: {
  orderStatus: typeof orderStatusCard
}) => (
  <div className="flex items-center justify-between w-full flex-wrap">
    {orderStatus.map(({ title, subTitle, icon: Icon }, index) => (
      <div
        key={index}
        className="border border-neutral-200 flex gap-x-4 items-center py-2 px-3 rounded-lg shadow-sm w-full sm:w-auto"
      >
        <div className="bg-red-400 p-2 rounded-md">
          <Icon className="text-white w-6 h-6" />
        </div>
        <div>
          <h2 className="font-semibold text-lg">{title}</h2>
          <p className="text-sm text-gray-500">{subTitle}</p>
        </div>
      </div>
    ))}
  </div>
)

export default StatusCard
