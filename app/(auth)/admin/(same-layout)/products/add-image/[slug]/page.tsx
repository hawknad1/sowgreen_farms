import { LoadImagesForm } from "@/components/forms/LoadImagesForm"
import React from "react"

const LoadImagesPage = ({ params }: { params: { slug: string } }) => {
  return (
    <div>
      <LoadImagesForm slug={params.slug} />
    </div>
  )
}

export default LoadImagesPage
