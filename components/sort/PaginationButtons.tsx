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
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "../ui/dropdown-menu"
// import { Button } from "../ui/button"
// import { ChevronDown } from "lucide-react"

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
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="outline"
//                 className="w-full justify-between bg-[#184532] text-white focus-visible:ring-primary"
//               >
//                 {selected || "All Categories"}
//                 <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="max-h-[250px] w-full overflow-y-auto">
//               <DropdownMenuGroup>
//                 <DropdownMenuItem
//                   onSelect={() => handleCategoryChange("All Category")}
//                   className="focus:bg-primary/10"
//                 >
//                   All Categories
//                 </DropdownMenuItem>
//                 {categories?.map((cat) => (
//                   <DropdownMenuItem
//                     key={cat.id}
//                     onSelect={() => handleCategoryChange(cat.categoryName)}
//                     className="focus:bg-primary/10"
//                   >
//                     {cat.categoryName}
//                   </DropdownMenuItem>
//                 ))}
//               </DropdownMenuGroup>
//             </DropdownMenuContent>
//           </DropdownMenu>
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
import React from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const PaginationButtons = ({ categories }: { categories: any[] }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get("category") || "All Categories"

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("category", category)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-4 lg:gap-0">
      <div className="flex lg:flex-row items-center gap-4 w-full lg:w-auto">
        <div className="w-full lg:w-[200px]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between bg-[#184532] text-white focus-visible:ring-primary"
              >
                {selectedCategory}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-[250px] w-full overflow-y-auto">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onSelect={() => handleCategoryChange("All Category")}
                  className="focus:bg-primary/10"
                >
                  All Categories
                </DropdownMenuItem>
                {categories?.map((cat) => (
                  <DropdownMenuItem
                    key={cat.id}
                    onSelect={() => handleCategoryChange(cat.categoryName)}
                    className="focus:bg-primary/10"
                  >
                    {cat.categoryName}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="w-full lg:w-[150px]">
          <Select>
            <SelectTrigger className="w-full font-medium rounded-lg px-4">
              <SelectValue placeholder="Discounts" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Discounts</SelectItem>
                <SelectItem value="10">10% Off</SelectItem>
                <SelectItem value="20">20% Off</SelectItem>
                <SelectItem value="30">30% Off</SelectItem>
                <SelectItem value="50">50% Off</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default PaginationButtons
