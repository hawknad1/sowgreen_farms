// "use client"
// import React from "react"
// import MiddleCard from "./MiddleCard"
// import Image from "next/image"
// import { useRouter } from "next/navigation"
// import { Button } from "../../ui/button"

// const MiddleCardAds = () => {
//   const router = useRouter()
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
//       <MiddleCard className="bg-[#004729] p-3">
//         <div className="w-full lg:max-w-xl flex flex-col justify-center">
//           <h1 className="text-xl sm:text-2xl md:text-lg lg:text-4xl text-white font-bold md:mb-2">
//             All <span className="text-[#F9ED5D]">Vegetables</span> &{" "}
//             <span className="text-[#F9ED5D]">
//               Fruits <span className="text-white">are 100% Organic</span>
//             </span>
//             {/* <br /> */}
//           </h1>
//         </div>
//         <div className="w-full">
//           <Image
//             src="/images/fruits.png"
//             height={100}
//             width={700}
//             className="bg-cover"
//             alt="Veggies"
//           />
//         </div>
//       </MiddleCard>
//       <MiddleCard className="bg-orange-100 p-3">
//         <div className="w-full lg:max-w-xl flex flex-col justify-center">
//           <h1 className="text-xl sm:text-2xl md:text-lg lg:text-4xl font-bold md:mb-2">
//             Grab up to{" "}
//             <span className="bg-red-500 text-lg lg:text-2xl text-white px-2 rounded-lg">
//               20% off
//             </span>{" "}
//             on fresh Vegetables
//             {/* <br /> */}
//           </h1>
//         </div>
//         <div className="w-full ">
//           <Image
//             src="/images/veg2.png"
//             height={100}
//             width={700}
//             className="bg-cover"
//             alt="Veggies"
//           />
//         </div>
//       </MiddleCard>
//     </div>
//   )
// }

// export default MiddleCardAds

"use client"
import React from "react"
import MiddleCard from "./MiddleCard"
import Image from "next/image"

const MiddleCardAds = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      <MiddleCard className="bg-[#004729] p-3">
        <div className="w-full lg:max-w-xl flex flex-col justify-center">
          <h1 className="text-xl sm:text-2xl md:text-lg lg:text-4xl text-white font-bold md:mb-2">
            All <span className="text-[#F9ED5D]">Vegetables</span> &{" "}
            <span className="text-[#F9ED5D]">
              Fruits <span className="text-white">are 100% Organic</span>
            </span>
            {/* <br /> */}
          </h1>
        </div>
        <div className="w-full">
          <Image
            src="/images/fruits.png"
            height={100}
            width={700}
            className="bg-cover"
            alt="Veggies"
          />
        </div>
      </MiddleCard>
      <MiddleCard className="bg-orange-100 p-3">
        <div className="w-full lg:max-w-xl flex flex-col justify-center">
          <h1 className="text-xl sm:text-2xl md:text-lg lg:text-4xl font-bold md:mb-2">
            Grab up to{" "}
            <span className="bg-red-500 text-lg lg:text-2xl text-white px-2 rounded-lg">
              20% off
            </span>{" "}
            on fresh Vegetables
            {/* <br /> */}
          </h1>
        </div>
        <div className="w-full ">
          <Image
            src="/images/veg2.png"
            height={100}
            width={700}
            className="bg-cover"
            alt="Veggies"
          />
        </div>
      </MiddleCard>
    </div>
  )
}

export default MiddleCardAds
