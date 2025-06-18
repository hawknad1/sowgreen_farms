// "use client"
// import React, { useEffect, useState } from "react"
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { getCategories } from "@/lib/utils"
// import { useCategoryState } from "@/hooks/state"
// import { Product } from "@/types"

// const PaginationButtons = () => {
//   const [categories, setCategories] = useState<Product[]>([])
//   const { selected, setSelected } = useCategoryState()

//   useEffect(() => {
//     const fetchCategories = async () => {
//       const categories = await getCategories()
//       setCategories(categories)
//     }
//     fetchCategories()
//   }, [])

//   // Handle category change
//   const handleCategoryChange = (value: string) => {
//     setSelected(value) // Update the selected state
//   }

//   return (
//     <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-4 lg:gap-0">
//       {/* Category and Discount Dropdowns */}
//       <div className="flex lg:flex-row items-center gap-4 w-full lg:w-auto">
//         {/* Categories Dropdown */}
//         <div className="w-full lg:w-[200px]">
//           <Select onValueChange={handleCategoryChange} value={selected}>
//             <SelectTrigger className="w-full bg-[#184532] rounded-lg px-4 font-medium text-white">
//               <SelectValue placeholder="All Categories" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectGroup>
//                 <SelectItem value="All Category">All Categories</SelectItem>
//                 {categories?.map((cat) => (
//                   <SelectItem value={cat.categoryName} key={cat.id}>
//                     {cat.categoryName}
//                   </SelectItem>
//                 ))}
//               </SelectGroup>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Discounts Dropdown */}
//         <div className="w-full lg:w-[150px]">
//           <Select>
//             <SelectTrigger className="w-full font-medium rounded-lg px-4">
//               <SelectValue placeholder="Discounts" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectGroup>
//                 <SelectItem value="all">All Discounts</SelectItem>
//                 <SelectItem value="10">10% Off</SelectItem>
//                 <SelectItem value="20">20% Off</SelectItem>
//                 <SelectItem value="30">30% Off</SelectItem>
//                 <SelectItem value="50">50% Off</SelectItem>
//               </SelectGroup>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default PaginationButtons

"use client"
import React, { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getCategories } from "@/lib/utils"
import { useCategoryState } from "@/hooks/state"
import { Product } from "@/types"
import { Loader2 } from "lucide-react"

interface PaginationButtonsProps {
  onDiscountChange?: (value: string) => void
  currentDiscount?: string
}

const PaginationButtons = ({
  onDiscountChange,
  currentDiscount = "all",
}: PaginationButtonsProps) => {
  const [categories, setCategories] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const { selected, setSelected } = useCategoryState()

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      try {
        const categories = await getCategories()
        setCategories(categories)
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  const handleCategoryChange = (value: string) => {
    setSelected(value)
  }

  const handleDiscountChange = (value: string) => {
    onDiscountChange?.(value)
  }

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-4 lg:gap-0">
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
        {/* Categories Dropdown */}
        <div className="w-full sm:w-[200px]">
          <Select
            onValueChange={handleCategoryChange}
            value={selected}
            disabled={loading}
          >
            <SelectTrigger className="w-full bg-[#184532] rounded-lg px-4 font-medium text-white hover:bg-[#184532]/90 transition-colors">
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                <SelectValue placeholder="All Categories" />
              )}
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              <SelectGroup>
                <SelectItem value="All Category">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem
                    value={cat.categoryName}
                    key={cat.id}
                    className="hover:bg-gray-100"
                  >
                    {cat.categoryName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Discounts Dropdown */}
        <div className="w-full sm:w-[180px]">
          <Select onValueChange={handleDiscountChange} value={currentDiscount}>
            <SelectTrigger className="w-full font-medium rounded-lg px-4 border-gray-300 hover:border-gray-400 transition-colors">
              <SelectValue placeholder="Discounts" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all" className="hover:bg-gray-100">
                  All Discounts
                </SelectItem>
                <SelectItem value="10" className="hover:bg-gray-100">
                  10% Off or more
                </SelectItem>
                <SelectItem value="20" className="hover:bg-gray-100">
                  20% Off or more
                </SelectItem>
                <SelectItem value="30" className="hover:bg-gray-100">
                  30% Off or more
                </SelectItem>
                <SelectItem value="50" className="hover:bg-gray-100">
                  50% Off or more
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default PaginationButtons
