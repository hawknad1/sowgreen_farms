import { Button } from "@/components/ui/button"
import { date } from "@/lib/utils"

export const OrderInfo = ({ orderNumber }: { orderNumber: string }) => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-sm font-bold mb-3">Order Info</h2>
      <p className="text-sm font-medium text-neutral-500/80">
        Order number:{" "}
        <span className="text-black tracking-wide">#{orderNumber}</span>
      </p>
      <p className="text-sm font-medium text-neutral-500/80 mb-3">
        Date: <span className="text-black">{date}</span>
      </p>
    </div>
  )
}
