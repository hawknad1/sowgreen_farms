"use client"
import React from "react"
import MiddleCard from "./MiddleCard"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "../../ui/button"

const MiddleCardAds = () => {
  const router = useRouter()
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      <MiddleCard className="bg-[#004729] p-3">
        <div className="w-full lg:max-w-xl flex flex-col justify-center">
          <h1 className="text-base sm:text-2xl md:text-lg lg:text-3xl text-white font-bold md:mb-2">
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
        <div className="w-full flex flex-col gap-y-4">
          <h1 className="text-base sm:text-2xl md:text-lg lg:text-2xl font-bold">
            Grab up to{" "}
            <span className="bg-red-500 text-white px-2 rounded-lg">
              20% off
            </span>{" "}
            on fresh Vegetables
          </h1>
          <Button
            onClick={() => router.push("/discount")}
            className="bg-red-500 text-white px-4 py-2 font-medium w-fit hover:bg-red-500/80"
          >
            Shop Sale
          </Button>
        </div>
        <div className="w-full">
          <Image
            src="/images/veg2.png"
            height={100}
            width={700}
            className=""
            alt="Veggies"
          />
        </div>
      </MiddleCard>
    </div>
  )
}

export default MiddleCardAds

// "use client"
// import React from "react"
// import MiddleCard from "./MiddleCard"
// import Image from "next/image"
// import { useRouter } from "next/navigation"
// import { Button } from "../../ui/button"

// const MiddleCardAds = () => {
//   const router = useRouter()

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full px-4 sm:px-6 lg:px-8">
//       {/* First Card */}
//       <MiddleCard className="bg-orange-100">
//         <div className="flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8 gap-4 sm:gap-6">
//           <div className="flex-1">
//             <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4">
//               Grab up to{" "}
//               <span className="bg-black text-white px-2 rounded-lg">
//                 20% off
//               </span>{" "}
//               on fresh vegetables
//             </h3>
//             <Button
//               onClick={() => router.push("/discount")}
//               className="bg-red-500 text-white px-6 py-3 font-medium hover:bg-red-600 transition-colors duration-200"
//             >
//               Shop Sale
//             </Button>
//           </div>
//           <div className="flex-1">
//             <Image
//               src="/images/veg2.png"
//               height={200}
//               width={400}
//               className="w-full h-auto object-contain"
//               alt="Fresh Vegetables"
//             />
//           </div>
//         </div>
//       </MiddleCard>

//       {/* Second Card */}
//       <MiddleCard className="bg-green-100">
//         <div className="flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8 gap-4 sm:gap-6">
//           <div className="flex-1">
//             <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4">
//               Everyday{" "}
//               <span className="bg-black text-white px-2 rounded-lg">fresh</span>{" "}
//               &{" "}
//               <span className="bg-black text-white px-2 rounded-lg">clean</span>{" "}
//               with our products
//             </h3>
//           </div>
//           <div className="flex-1">
//             <Image
//               src="/images/fruits.png"
//               height={200}
//               width={400}
//               className="w-full h-auto object-contain"
//               alt="Fresh Fruits"
//             />
//           </div>
//         </div>
//       </MiddleCard>
//     </div>
//   )
// }

// export default MiddleCardAds
