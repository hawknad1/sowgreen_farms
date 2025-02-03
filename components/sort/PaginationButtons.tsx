// "use client"
// import React, { useEffect, useState } from "react"
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"

// import { getCategories } from "@/lib/utils"
// import { useCategoryState } from "@/hooks/state"
// import { Product } from "@/types"

// const PaginationButtons = () => {
//   const [categories, setCategories] = useState<Product[]>([])
//   const { setSelected } = useCategoryState()

//   useEffect(() => {
//     const AllCategories = async () => {
//       const categories = await getCategories()
//       setCategories(categories)
//     }
//     AllCategories()
//   }, [])

//   return (
//     <div className="flex items-center justify-center lg:justify-between w-full">
//       <div className="flex items-center gap-x-3">
//         <Select onValueChange={(value) => setSelected(value)}>
//           <SelectTrigger className="lg:w-[170px] w-[145px] bg-[#184532] rounded-lg lg:px-4 font-medium text-white">
//             <SelectValue placeholder="All Categories" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectGroup>
//               <SelectLabel>All Categories</SelectLabel>
//               {categories?.map((cat) => (
//                 <SelectItem value={cat.categoryName} key={cat.id}>
//                   {cat.categoryName}
//                 </SelectItem>
//               ))}
//             </SelectGroup>
//           </SelectContent>
//         </Select>
//         <Select>
//           <SelectTrigger className="w-[120px] font-medium rounded-full px-4">
//             <SelectValue placeholder="Discounts" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectGroup>
//               <SelectLabel>Discounts</SelectLabel>
//               <SelectItem value="apple">Apple</SelectItem>
//               <SelectItem value="banana">Banana</SelectItem>
//               <SelectItem value="blueberry">Blueberry</SelectItem>
//               <SelectItem value="grapes">Grapes</SelectItem>
//               <SelectItem value="pineapple">Pineapple</SelectItem>
//             </SelectGroup>
//           </SelectContent>
//         </Select>
//       </div>
//       <Select>
//         <SelectTrigger className="w-[120px] font-medium rounded-full hidden lg:inline-flex">
//           <SelectValue placeholder="Sort by" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectGroup>
//             <SelectLabel>Sort by</SelectLabel>
//             <SelectItem value="apple">Apple</SelectItem>
//             <SelectItem value="banana">Banana</SelectItem>
//             <SelectItem value="blueberry">Blueberry</SelectItem>
//             <SelectItem value="grapes">Grapes</SelectItem>
//             <SelectItem value="pineapple">Pineapple</SelectItem>
//           </SelectGroup>
//         </SelectContent>
//       </Select>
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

const PaginationButtons = () => {
  const [categories, setCategories] = useState<Product[]>([])
  const { setSelected } = useCategoryState()

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories()
      setCategories(categories)
    }
    fetchCategories()
  }, [])

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-4 lg:gap-0">
      {/* Category and Discount Dropdowns */}
      <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto">
        {/* Categories Dropdown */}
        <div className="w-full lg:w-[200px]">
          <Select onValueChange={(value) => setSelected(value)}>
            <SelectTrigger className="w-full bg-[#184532] rounded-lg px-4 font-medium text-white">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem value={cat.categoryName} key={cat.id}>
                    {cat.categoryName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Discounts Dropdown */}
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

      {/* Sort By Dropdown */}
      {/* <div className="w-full lg:w-[150px]">
        <Select>
          <SelectTrigger className="w-full font-medium rounded-lg px-4">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest Arrivals</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div> */}
    </div>
  )
}

export default PaginationButtons
