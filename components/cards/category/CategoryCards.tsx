// "use client"
// import CategoryCard from "./CategoryCard"
// import { useEffect, useState } from "react"
// import HomeCategorySkeleton from "../../skeletons/HomeCategorySkeleton"

// const CategoryCards = () => {
//   const [categoryList, setCategoryList] = useState([])
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     async function getCategories() {
//       try {
//         const res = await fetch("/api/categories", {
//           method: "GET",
//           cache: "no-store",
//         })

//         if (res.ok) {
//           const categories = await res.json()
//           setCategoryList(categories)
//           setIsLoading(false)
//         }
//       } catch (error) {
//         console.log(error)
//       }
//     }
//     getCategories()
//   }, [])

//   return (
//     <>
//       {isLoading ? (
//         <HomeCategorySkeleton />
//       ) : (
//         <div className="flex items-center space-x-4 w-max">
//           {categoryList.map((card) => (
//             <CategoryCard data={card} key={card.id} />
//           ))}
//         </div>
//       )}
//     </>
//   )
// }

// export default CategoryCards

// NO "use client" - This is now a presentational Server Component

import CategoryCard from "./CategoryCard"
import HomeCategorySkeleton from "../../skeletons/HomeCategorySkeleton"
import { Category } from "@/types"

// Define the props for this component
interface CategoryCardsProps {
  categories: Category[] // 2. TYPE the 'categories' prop as an array of Category
}

// It receives the list of categories as a prop from the main page
const CategoryCards = ({ categories }: CategoryCardsProps) => {
  if (!categories || categories.length === 0) {
    return <HomeCategorySkeleton />
  }

  return (
    <div className="flex w-max items-center space-x-4">
      {/* 3. The error on 'card' is now automatically fixed! */}
      {/* TypeScript knows that if 'categories' is a Category[], then 'card' must be a Category. */}
      {categories.map((card: Category) => (
        <CategoryCard data={card} key={card.id} />
      ))}
    </div>
  )
}

export default CategoryCards
