import { orderStatusCard } from "@/constants"
import { Order } from "@/types"

const StatusCards = ({
  orderStatus,
  orders,
}: {
  orderStatus?: typeof orderStatusCard
  orders?: Order
}) => (
  <div className="flex items-center gap-x-3 justify-between w-full overflow-scroll scrollbar-none">
    {orderStatus?.map(({ title, subTitle, status, icon: Icon }, index) => {
      const isCancelled = orders?.status === "cancelled"
      const isLastCard = index === orderStatus.length - 1

      // Determine the card styles
      const cardStyles = isCancelled
        ? isLastCard
          ? "border-2 border-red-500 bg-red-50"
          : "border border-gray-300 bg-gray-100 opacity-50"
        : status === orders?.status
        ? "border-2 border-emerald-500 shadow"
        : "border border-neutral-200 shadow-sm"

      // Determine text color for title
      const titleTextColor =
        isCancelled && isLastCard ? "text-red-500" : "text-black"

      // Adjust title and subtitle for the last card if cancelled
      const modifiedTitle = isCancelled && isLastCard ? "Cancelled" : title
      const modifiedSubTitle =
        isCancelled && isLastCard ? "Order Cancelled." : subTitle

      return (
        <div key={index} className="w-full">
          <div
            className={`${cardStyles} flex lg:gap-x-4 gap-x-2 items-center px-1.5 py-1 lg:py-2 lg:px-3 rounded-lg sm:w-auto cursor-pointer`}
          >
            <div
              className={`p-2 rounded-md ${
                isCancelled && isLastCard ? "bg-red-500" : "bg-green-400"
              }`}
            >
              <Icon className="text-white w-4 h-4 lg:w-6 lg:h-6" />
            </div>
            <div className="min-w-0">
              <h2
                className={`font-semibold text-sm lg:text-lg ${titleTextColor} whitespace-nowrap`}
              >
                {modifiedTitle}
              </h2>
              <p className="lg:text-sm hidden lg:inline-flex text-gray-500">
                {modifiedSubTitle}
              </p>
            </div>
          </div>
        </div>
      )
    }) || <p>No status available</p>}
  </div>
)

export default StatusCards
