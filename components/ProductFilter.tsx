import React, { useEffect, useState } from "react"
import PaginationButtons from "./sort/PaginationButtons"
import { useCategoryState } from "@/hooks/state"
import { Product } from "@/types"

const ProductFilter = () => {
  const { selected } = useCategoryState()

  return (
    <div className="mt-7 mb-7">
      <PaginationButtons />
    </div>
  )
}

export default ProductFilter
