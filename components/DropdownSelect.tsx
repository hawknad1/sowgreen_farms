"use client"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"

type Category = {
  id: string
  categoryName: string
}

interface DropdownSelectProps {
  setSelectedCategory: any
}

export default function DropdownSelect({
  setSelectedCategory,
}: DropdownSelectProps) {
  const [categories, setCategories] = useState<Category[]>([])
  async function getCategories() {
    try {
      const res = await fetch("http://localhost:3000/api/categories", {
        cache: "no-store",
        method: "GET",
      })
      if (res.ok) {
        const categories = await res.json()
        setCategories(categories)
        return categories
      }
    } catch (error) {
      console.log(error)
    }
    return null
  }

  useEffect(() => {
    getCategories()
  }, [])

  return (
    <Select>
      <SelectTrigger className="w-[180px] mt-2 mb-3">
        <SelectValue placeholder="Select Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Category</SelectLabel>
          {categories.map((cat) => (
            <SelectItem
              onChange={(e: any) => setSelectedCategory(e.target.value)}
              key={cat.id}
              value={cat.categoryName}
            >
              {cat.categoryName}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
