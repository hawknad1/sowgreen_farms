import React from "react"

interface PaginationButtonsProps {
  productsPerPage: number
  totalProducts: number
  currentPage: number
  paginate: (pageNumber: number) => void
}

const PaginationPageButton: React.FC<PaginationButtonsProps> = ({
  productsPerPage,
  totalProducts,
  currentPage,
  paginate,
}) => {
  const totalPages = Math.ceil(totalProducts / productsPerPage)

  const handlePrevious = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1)
    }
  }

  return (
    <div className="flex justify-between gap-2 mt-12 w-full ">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-md ${
          currentPage === 1
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-[#184532] text-white font-medium text-sm hover:bg-[#184532cf]"
        }`}
      >
        Previous
      </button>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-md ${
          currentPage === totalPages
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-[#184532] text-white font-medium text-sm hover:bg-[#184532cf]"
        }`}
      >
        Next
      </button>
    </div>
  )
}

export default PaginationPageButton

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

//   const handleCategoryChange = (value: string) => {
//     setSelected(value)
//   }

//   return (
//     <div className="flex flex-col sm:flex-row gap-4 w-full">
//       {/* Categories Dropdown */}
//       <Select onValueChange={handleCategoryChange} value={selected}>
//         <SelectTrigger className="bg-[#184532] text-white">
//           <SelectValue placeholder="All Categories" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectGroup>
//             <SelectItem value="All Category">All Categories</SelectItem>
//             {categories?.map((cat) => (
//               <SelectItem key={cat.id} value={cat.categoryName}>
//                 {cat.categoryName}
//               </SelectItem>
//             ))}
//           </SelectGroup>
//         </SelectContent>
//       </Select>

//       {/* Discounts Dropdown */}
//       <Select>
//         <SelectTrigger>
//           <SelectValue placeholder="Discounts" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectGroup>
//             <SelectItem value="all">All Discounts</SelectItem>
//             <SelectItem value="10">10% Off</SelectItem>
//             <SelectItem value="20">20% Off</SelectItem>
//             <SelectItem value="30">30% Off</SelectItem>
//             <SelectItem value="50">50% Off</SelectItem>
//           </SelectGroup>
//         </SelectContent>
//       </Select>
//     </div>
//   )
// }

// export default PaginationButtons
