import { getCategory } from "@/lib/utils"
import React from "react"

const CategoryDetailPage = async ({ params }: { params: { id: string } }) => {
  const category = await getCategory(params.id)
  return <div>{category}</div>
}

export default CategoryDetailPage
