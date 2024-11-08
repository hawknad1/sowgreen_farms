import { LoadImagesForm } from "@/components/forms/LoadImagesForm"
import React from "react"

const LoadImagesPage = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <LoadImagesForm productId={params.id} />
    </div>
  )
}

export default LoadImagesPage
