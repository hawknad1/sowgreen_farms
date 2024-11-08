"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Product } from "@/types"

interface AddImageProps {
  product: Product
}

const AddImage = ({ product }: AddImageProps) => {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/admin/products/add-image/${product.id}`)
  }

  return (
    <Button onClick={handleClick} className="text-white p-2 rounded-md">
      Add Images
    </Button>
  )
}

export default AddImage
