// import Image from "next/image"
// import React from "react"

// const DeliveryCard = () => {
//   return (
//     <div className="">
//       <div className="relative h-36 lg:h-60 flex items-center justify-between bg-emerald-500/15 rounded-xl">
//         <div className="absolute lg:top-6 lg:left-20 left-3 -bottom-4 sm:left-6 sm:-bottom-6">
//           <Image
//             src="/images/delivery.png"
//             width={100}
//             height={100}
//             alt="Delivery Man"
//             className="lg:h-64 lg:w-64 h-36 w-36 sm:w-40 sm:h-40"
//           />
//         </div>
//         <div className="absolute max-w-lg right-0 sm:right-16 lg:max-w-3xl lg:right-16 flex items-center">
//           <div className="w-full flex flex-col">
//             <h2 className="lg:text-5xl max-w-[250px] sm:max-w-[300px] lg:max-w-3xl text-base sm:text-xl font-semibold text-emerald-500 leading-normal tracking-wide">
//               We only deliver on Wednesdays & Saturdays
//             </h2>
//             <p className="text-neutral-500/60 font-medium tracking-wide text-base lg:text-xl ml-2">
//               from 10am to 8pm
//             </p>
//           </div>
//           <button className="border hidden md:inline-flex border-emerald-500 text-emerald-600 hover:underline rounded-tr-xl rounded-bl-xl text-sm lg:text-base w-36 lg:py-3 px-5 py-2.5  lg:px-5.5">
//             Learn more
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default DeliveryCard

// import Image from "next/image"
// import React from "react"

// const DeliveryCard = () => {
//   return (
//     <div className="px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto">
//       <div className="relative h-56 md:h-64 lg:h-80 xl:h-96 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-100">
//         {/* Background pattern */}
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute inset-0 bg-[url('/images/delivery-pattern.svg')] bg-repeat bg-[length:200px]"></div>
//         </div>

//         {/* Delivery Person Image - More dynamic */}
//         <div className="absolute left-0 bottom-0 w-1/2 max-w-md">
//           <div className="relative w-full h-full">
//             <Image
//               src="/images/delivery.png"
//               width={400}
//               height={400}
//               alt="Friendly delivery person with package"
//               className="object-contain object-left-bottom h-full w-full transition-all duration-500 hover:scale-105"
//               priority
//             />
//             {/* Floating badge */}
//             <div className="absolute left-8 top-8 bg-white rounded-full px-3 py-1 shadow-md flex items-center gap-1">
//               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
//               <span className="text-xs font-bold text-green-700">
//                 LIVE TRACKING
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Content - More detailed */}
//         <div className="absolute right-0 top-0 bottom-0 w-1/2 flex flex-col justify-center pr-6 sm:pr-8 md:pr-12 lg:pr-16">
//           <div className="text-right space-y-2 sm:space-y-3 md:space-y-4">
//             <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-green-800 leading-tight">
//               Fast & Reliable Delivery
//             </h2>

//             <div className="inline-flex items-center justify-end gap-2 bg-white/80 rounded-lg px-3 py-1.5 shadow-sm">
//               <span className="text-xs sm:text-sm font-medium text-green-700">
//                 Available Days:
//               </span>
//               <span className="text-sm sm:text-base font-bold text-green-600">
//                 Wed & Sat
//               </span>
//               <span className="w-1 h-1 bg-green-400 rounded-full"></span>
//               <span className="text-xs sm:text-sm font-medium text-green-700">
//                 10AM - 8PM
//               </span>
//             </div>

//             <p className="text-sm sm:text-base md:text-lg text-green-600/90 font-medium">
//               Your orders delivered fresh with care by our professional team
//             </p>

//             <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
//               <button className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg px-5 py-2.5 text-sm sm:text-base transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2">
//                 <span>Track Order</span>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-4 w-4"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 5l7 7-7 7"
//                   />
//                 </svg>
//               </button>
//               <button className="border border-green-600 text-green-700 hover:bg-green-50 font-medium rounded-lg px-5 py-2.5 text-sm sm:text-base transition-all duration-300 shadow-sm hover:shadow-md">
//                 Delivery Info
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Decorative elements */}
//         <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-green-200/20"></div>
//         <div className="absolute -right-5 -bottom-5 w-24 h-24 rounded-full bg-green-300/30"></div>
//       </div>
//     </div>
//   )
// }

// export default DeliveryCard

// import Image from "next/image"
// import React from "react"

// const DeliveryCard = () => {
//   return (
//     <div className="px-4 sm:px-6 lg:px-8 w-full">
//       <div className="relative h-48 md:h-56 lg:h-64 xl:h-72 flex items-center justify-between bg-emerald-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
//         {/* Delivery Person Image */}
//         <div className="absolute left-4 sm:left-6 md:left-8 lg:left-12 bottom-0">
//           <Image
//             src="/images/delivery.png"
//             width={160}
//             height={160}
//             alt="Delivery Person"
//             className="h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 lg:h-56 lg:w-56 object-contain object-bottom transition-transform duration-500 hover:scale-105"
//             priority
//           />
//         </div>

//         {/* Content */}
//         <div className="absolute right-4 sm:right-6 md:right-8 lg:right-12 flex flex-col items-end gap-2 sm:gap-3 md:gap-4">
//           <div className="text-right">
//             <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-emerald-700 leading-tight sm:leading-snug md:leading-normal">
//               We Deliver on Wednesdays & Saturdays
//             </h2>
//             <p className="text-sm sm:text-base md:text-lg text-emerald-600/80 font-medium mt-1 sm:mt-2">
//               10:00 AM - 8:00 PM
//             </p>
//           </div>

//           {/* Button - visible on all screens */}
//           <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 text-sm sm:text-base transition-colors duration-300 shadow-sm hover:shadow-md">
//             Learn More
//           </button>
//         </div>

//         {/* Decorative elements */}
//         <div className="absolute inset-0 overflow-hidden">
//           <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-emerald-100/50"></div>
//           <div className="absolute -right-5 -bottom-5 w-20 h-20 rounded-full bg-emerald-200/30"></div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default DeliveryCard

import Image from "next/image"
import { useRouter } from "next/navigation"
import React from "react"

// const DeliveryCard = () => {
//   const router = useRouter()
//   return (
//     <div className="px-4 sm:px-0 w-full max-w-7xl mx-auto">
//       <div className="relative h-auto min-h-[200px] sm:min-h-[250px] md:h-64 md:px-8 lg:h-80 flex flex-col md:flex-row items-center bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl overflow-hidden shadow-sm border border-emerald-100">
//         {/* Delivery Image - Now properly constrained */}
//         <div className="w-full md:w-1/2 h-48 sm:h-56 md:h-full relative">
//           <Image
//             src="/images/delivery.png"
//             fill
//             alt="Friendly delivery person with package"
//             className="object-contain object-bottom md:object-left-bottom"
//             priority
//             sizes="(max-width: 768px) 100vw, 50vw"
//           />
//         </div>

//         {/* Content Area - Reorganized for mobile */}
//         <div className="w-full md:w-1/2 lg:w-2/3 p-4 sm:p-6 md:p-8 flex flex-col justify-center">
//           <div className="text-center md:text-right space-y-3 sm:space-y-4">
//             <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-800">
//               Fast & Reliable Delivery
//             </h2>

//             <div className="flex flex-col sm:flex-row justify-center md:justify-end items-center gap-2">
//               <div className="bg-white/90 rounded-lg px-4 py-2 shadow-xs flex items-center gap-2">
//                 <span className="text-sm md:text-base font-medium text-green-700">
//                   Delivery Days:
//                 </span>
//                 <span className="font-bold text-green-600">Wed & Sat</span>
//                 <span className="hidden sm:block w-1 h-1 bg-green-400 rounded-full"></span>
//                 <span className="text-sm md:text-base font-medium text-green-700">
//                   10AM - 8PM
//                 </span>
//               </div>
//             </div>

//             <p className="text-sm sm:text-base text-green-600/90 font-medium max-w-prose md:ml-auto">
//               Fresh deliveries straight to your doorstep by our professional
//               team
//             </p>

//             <div className="flex flex-col sm:flex-row justify-center md:justify-end gap-3 pt-2">
//               <button
//                 onClick={() => router.push("/account/order-history")}
//                 className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg px-5 py-2.5 text-sm transition-all flex items-center justify-center gap-2"
//               >
//                 <span>Track Order</span>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-4 w-4"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 5l7 7-7 7"
//                   />
//                 </svg>
//               </button>
//               <button className="border border-green-600 text-green-700 hover:bg-green-50 font-medium rounded-lg px-5 py-2.5 text-sm transition-all">
//                 Learn more
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Desktop-only decorative elements */}
//         <div className="hidden md:block absolute -right-10 -top-10 w-40 h-40 rounded-full bg-green-200/20"></div>
//         <div className="hidden md:block absolute -right-5 -bottom-5 w-24 h-24 rounded-full bg-green-300/30"></div>
//       </div>
//     </div>
//   )
// }

const DeliveryCard = () => {
  const router = useRouter()

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
      <div className="relative h-auto min-h-[200px] sm:min-h-[250px] md:h-64 md:px-8 lg:h-80 flex flex-col md:flex-row items-center bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl overflow-hidden shadow-sm border border-emerald-100">
        {/* Image */}
        <div className="w-full md:w-1/2 h-48 sm:h-56 md:h-full relative">
          <Image
            src="/images/delivery.png"
            fill
            alt="Friendly delivery person with package"
            className="object-contain object-bottom md:object-left-bottom"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Content */}
        <div className="w-full md:w-2/3 lg:w-2/3 p-4 sm:p-6 md:p-8 flex flex-col justify-center">
          <div className="text-center md:text-left lg:text-right space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-5xl font-bold text-green-800 leading-tight">
              Fast & Reliable Delivery
            </h2>

            <div className="flex flex-col sm:flex-row justify-center md:justify-end items-center gap-2">
              <div className="bg-white/90 rounded-lg px-4 py-2 shadow-xs flex flex-wrap items-center gap-2">
                <span className="text-sm sm:text-base md:text-sm font-medium text-green-700">
                  Delivery Days:
                </span>
                <span className="font-bold text-sm text-green-600">
                  Wed & Sat
                </span>
                <span className="hidden sm:block w-1 h-1 bg-green-400 rounded-full"></span>
                <span className="text-sm sm:text-base md:text-sm font-medium text-green-700">
                  10AM - 8PM
                </span>
              </div>
            </div>

            <p className="text-sm lg:text-base text-green-600/90 font-medium max-w-prose mx-auto md:ml-auto md:mr-0">
              Fresh deliveries straight to your doorstep by our professional
              team
            </p>

            <div className="flex flex-col sm:flex-row justify-center md:justify-end gap-3 pt-2">
              <button
                onClick={() => router.push("/account/order-history")}
                className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg px-5 py-2.5  text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Track Order</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              <button className="border border-green-600 text-green-700 hover:bg-green-50 font-medium rounded-lg px-5 py-2.5 text-sm transition-all">
                Learn more
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="hidden md:block absolute -right-10 -top-10 w-40 h-40 rounded-full bg-green-200/20"></div>
        <div className="hidden md:block absolute -right-5 -bottom-5 w-24 h-24 rounded-full bg-green-300/30"></div>
      </div>
    </div>
  )
}

export default DeliveryCard
