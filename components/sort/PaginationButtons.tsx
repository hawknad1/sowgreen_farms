"use client"
import React, { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { getCategories } from "@/lib/utils"
import { useCategoryState } from "@/hooks/state"
import { Product } from "@/types"

const PaginationButtons = () => {
  const [categories, setCategories] = useState<Product[]>([])
  const { setSelected } = useCategoryState()

  useEffect(() => {
    const AllCategories = async () => {
      const categories = await getCategories()
      setCategories(categories)
    }
    AllCategories()
  }, [])

  return (
    <div className="flex items-center justify-between w-full">
      <div className="space-x-4 hidden md:inline-flex">
        <Select onValueChange={(value) => setSelected(value)}>
          <SelectTrigger className="w-[170px] bg-red-600 rounded-full px-4 font-medium text-white">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>All Categories</SelectLabel>
              {categories?.map((cat) => (
                <SelectItem value={cat.categoryName} key={cat.id}>
                  {cat.categoryName}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[120px] font-medium rounded-full px-4">
            <SelectValue placeholder="Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Price</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[140px] font-medium rounded-full px-4">
            <SelectValue placeholder="Discounts" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Discounts</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Select>
        <SelectTrigger className="w-[120px] font-medium rounded-full">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort by</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export default PaginationButtons
