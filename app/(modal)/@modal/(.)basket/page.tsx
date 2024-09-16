"use client"

import BasketPopup from "@/components/basket/BasketPopup"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

const BasketInterception = () => {
  const router = useRouter()

  function onDismiss() {
    router.back()
  }
  return (
    <Dialog
      open
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onDismiss()
        }
      }}
    >
      <DialogContent className="h-4/5 w-full max-w-3xl m-8">
        <DialogHeader>
          <DialogTitle>Your Shopping Cart</DialogTitle>
        </DialogHeader>
        <div className="overflow-scroll scrollbar-hide">
          <BasketPopup />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BasketInterception
