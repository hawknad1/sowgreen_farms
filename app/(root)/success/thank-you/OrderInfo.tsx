import { Button } from "@/components/ui/button"

export const OrderInfo = ({ orderNumber }: { orderNumber: string }) => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-sm font-bold mb-3">Order Info</h2>
      <p className="text-sm font-medium text-neutral-500/80">
        Order number: # {orderNumber}
      </p>
      <p className="text-sm font-medium text-neutral-500/80 mb-3">
        Date: # {orderNumber}
      </p>
      <Button className="bg-slate-100 w-fit text-black py-0 hover:bg-slate-200/70 font-semibold">
        View Invoice
      </Button>
    </div>
  )
}
