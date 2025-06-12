// "use client"
// import { Button } from "@/components/ui/button"
// import Image from "next/image"
// import React from "react"
// import { ArrowLongRightIcon } from "@heroicons/react/20/solid"
// import { useRouter } from "next/navigation"

// const ProductsHeroBanner = () => {
//   const router = useRouter()

//   return (
//     <div className="hidden bg-[#004729] px-12 sm:flex justify-between h-80 rounded-xl mb-8">
//       <div className="w-full lg:max-w-xl flex flex-col justify-center">
//         <h1 className="text-2xl lg:text-5xl text-white font-bold lg:leading-[60px] mb-2">
//           All <span className="text-[#F9ED5D]">Fruits</span> and{" "}
//           <span className="text-[#F9ED5D]">Vegetables</span>
//           <br /> are 100% Organic
//         </h1>
//         <p className="text-white text-sm">
//           100% Pesticide and Herbicide Free. 100% Synthetic Fertilizer.
//         </p>
//         <p className="text-white text-sm">
//           100% Locally Grown & Produced In Ghana.
//         </p>
//         <Button
//           variant="ghost"
//           className="w-fit text-[#004729] flex items-center gap-x-1 mt-4 max-w-64 font-semibold text-sm bg-[#F9ED5D]"
//           onClick={() => router.push("/about")}
//         >
//           Learn More
//           <ArrowLongRightIcon className="w-5 h-5 mt-1" />
//         </Button>
//       </div>
//       <div className="relative w-[440px]">
//         <Image
//           src="/images/veg.png"
//           alt="produce"
//           fill
//           className="object-contain p-2"
//         />
//       </div>
//     </div>
//   )
// }

// export default ProductsHeroBanner

"use client"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"

const ProductsHeroBanner = () => {
  const router = useRouter()

  return (
    <div className="relative bg-[#004729] rounded-xl mb-8 overflow-hidden h-64 sm:h-72 md:h-80">
      <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-12 z-10">
        <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white leading-tight mb-2">
          All <span className="text-[#F9ED5D]">Fruits</span> and{" "}
          <span className="text-[#F9ED5D]">Vegetables</span>
          <br /> are 100% Organic
        </h1>
        <p className="text-white text-sm sm:text-base max-w-lg mb-4">
          100% Pesticide Free. Locally Grown & Produced In Ghana.
        </p>
        <Button
          onClick={() => router.push("/about")}
          className="w-fit bg-[#F9ED5D] hover:bg-[#F9ED5D]/90 text-[#004729] gap-2"
        >
          Learn More
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="absolute right-0 bottom-0 w-full sm:w-1/2 h-full">
        <Image
          src="/images/veg.png"
          alt="Organic produce"
          fill
          className="object-contain object-right-bottom p-4"
          priority
        />
      </div>
    </div>
  )
}

export default ProductsHeroBanner
