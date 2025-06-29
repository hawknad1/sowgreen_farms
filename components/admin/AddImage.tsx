// "use client"

// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Product } from "@/types"

// interface AddImageProps {
//   product: Product
// }

// const AddImage = ({ product }: AddImageProps) => {
//   const router = useRouter()

//   const handleClick = () => {
//     router.push(`/admin/products/add-image/${product.id}`)
//   }

//   return (
//     <Button onClick={handleClick} className="text-white p-2 rounded-md">
//       Add Images
//     </Button>
//   )
// }

// export default AddImage

"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Product } from "@/types"
import { ImagePlus } from "lucide-react"

interface AddImageProps {
  product: Product
}

const AddImage = ({ product }: AddImageProps) => {
  const router = useRouter()

  return (
    <Button
      onClick={() => router.push(`/admin/products/add-image/${product.id}`)}
      variant="outline"
      className="gap-2 flex-1 sm:flex-initial w-full"
    >
      <ImagePlus className="h-4 w-4" />
      <span>Manage Images</span>
    </Button>
  )
}

export default AddImage
