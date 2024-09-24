import { Button } from "@/components/ui/button"
import { PlusCircle, PlusIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AddProductForm } from "@/components/forms/AddProductForm"
import { useRouter } from "next/navigation"

const AddProduct = () => {
  const router = useRouter()
  return (
    <Button
      onClick={() => router.push("/admin/products/post")}
      className="flex gap-x-1.5"
    >
      Post Product
    </Button>
  )
}

export default AddProduct
