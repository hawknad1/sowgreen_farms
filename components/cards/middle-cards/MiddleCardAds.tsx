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
import Image from "next/image"
import { useRouter } from "next/navigation"

// const MiddleCardAds = () => {
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

interface MiddleCardProps {
  children: React.ReactNode
  className?: string
}

const MiddleCard = ({ children, className }: MiddleCardProps) => (
  <div
    className={`relative overflow-hidden rounded-2xl hover:shadow-md  transition-all duration-300  ${className}`}
  >
    {children}
  </div>
)

const MiddleCardAds = () => {
  const router = useRouter()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Organic Produce Card */}
      <MiddleCard className="bg-gradient-to-br from-[#004729] to-[#006839] h-[220px] md:h-[200px]">
        <div className="relative h-full flex items-center">
          <div className="flex-1 z-10 px-6 py-4">
            <div className="inline-block bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full mb-2">
              <span className="text-[#F9ED5D] text-[10px] font-semibold tracking-wide uppercase">
                100% Certified
              </span>
            </div>
            <h2 className="text-xl md:text-2xl lg:text-3xl max-w-sm  text-white font-bold leading-tight mb-2">
              All <span className="text-[#F9ED5D]">Vegetables</span> &{" "}
              <span className="text-[#F9ED5D]">Fruits</span>{" "}
              <span className="text-white">are 100% Organic</span>
            </h2>
            <p className="text-white/80 text-xs md:text-sm mb-3">
              Farm-fresh, pesticide-free produce
            </p>
            {/* <button
              className="bg-[#F9ED5D] hover:bg-[#f5e84a] text-[#004729] font-semibold px-5 py-1.5 text-sm rounded-lg transition-all duration-200 hover:shadow-lg"
              aria-label="Shop organic produce"
            >
              Shop Now
            </button> */}
          </div>
          <div className="absolute right-0 bottom-0 w-[45%] md:w-[40%] h-full">
            <Image
              src="/images/fruits.png"
              alt="Fresh organic fruits and vegetables"
              width={400}
              height={300}
              className="w-full h-full object-contain object-center"
              priority={false}
            />
          </div>
        </div>
      </MiddleCard>

      {/* Discount Card */}
      <MiddleCard className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 h-[220px] md:h-[200px]">
        <div className="relative h-full flex items-center">
          <div className="flex-1 z-10 px-6 py-4">
            <div className="inline-flex items-center gap-1.5 bg-red-500 text-white px-3 py-1 rounded-full shadow-lg mb-2">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-bold text-xs">LIMITED OFFER</span>
            </div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-2">
              Grab up to{" "}
              <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-lg shadow-lg text-lg md:text-xl">
                20% OFF
              </span>
            </h2>
            <p className="text-base md:text-lg font-semibold text-gray-700 mb-3">
              on Fresh Vegetables
            </p>
            <button
              onClick={() => router.push("/discount")}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 text-sm rounded-lg transition-all duration-200 hover:shadow-lg"
              aria-label="View vegetable deals"
            >
              Grab the Deal
            </button>
          </div>
          <div className="absolute right-0 bottom-0 w-[45%] md:w-[40%] h-full">
            <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg rotate-12 z-10">
              FRESH
            </div>
            <Image
              src="/images/veg2.png"
              alt="Fresh vegetables on discount"
              width={400}
              height={300}
              className="w-full h-full object-contain object-center"
              priority={false}
            />
          </div>
        </div>
      </MiddleCard>
    </div>
  )
}

export default MiddleCardAds

// export default MiddleCardAds
