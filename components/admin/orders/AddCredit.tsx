import { Product } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../../ui/dialog"
import { Button } from "../../ui/button"
import EditProductForm from "../../forms/EditProductForm"
import { DollarSign } from "lucide-react"
import { Input } from "@/components/ui/input"
import AddCreditForm from "@/components/forms/AddCreditForm"

interface Props {
  product?: Product
}

const AddCredit = ({ product }: Props) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button className=" flex gap-x-1 text-xs lg:text-sm">
        <DollarSign className="h-4 w-4" />
        Credit
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[530px]">
      <DialogHeader>
        <DialogTitle>Send credit balance</DialogTitle>
        <DialogDescription>Send credit balance to customer!</DialogDescription>
      </DialogHeader>
      <AddCreditForm />
    </DialogContent>
  </Dialog>
)

export default AddCredit
