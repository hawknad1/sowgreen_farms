// import SignUpForm from "@/components/forms/SignUpForm"
// import { GoogleAuth } from "@/components/social-auths/GoogleAuth"
// import Image from "next/image"
// import React from "react"

// const Signup = () => {
//   return (
//     <div className="flex flex-col justify-center items-center p-14 md:p-8">
//       <div className="hidden lg:flex items-center justify-center mb-2">
//         <Image
//           src="/images/sowgreen.png"
//           alt="Sowgreen Logo"
//           height={100}
//           width={100}
//           className="object-contain"
//         />
//       </div>
//       <div className="border border-neutral-400 rounded-lg p-4 flex  flex-col gap-4 w-full sm:max-w-[400px] md:max-w-[450px] shadow-sm">
//         <div className="relative -mt-14 block lg:hidden">
//           <a
//             className="inline-flex size-16 items-center justify-center rounded-full bg-white sm:size-20"
//             href="#"
//           >
//             <Image
//               src="/images/sowgreen.png"
//               alt="Sowgreen Logo"
//               height={150}
//               width={150}
//               className="object-contain"
//             />
//           </a>

//           <h1 className="mt-2 text-xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
//             Welcome to Sowgreen Farms 🦑
//           </h1>
//         </div>
//         <div className="max-w-xs">
//           <p className="mt-4 leading-relaxed text-gray-500">
//             Create an account with us to get the best deals on fresh farm
//             produce.
//           </p>
//         </div>

//         <SignUpForm />

//         <div className="flex flex-col gap-2 mt-2">
//           <span className="flex items-center">
//             <span className="h-px flex-1 bg-black"></span>
//             <span className="shrink-0 px-6 text-gray-600">OR</span>
//             <span className="h-px flex-1 bg-black"></span>
//           </span>
//           <GoogleAuth />
//         </div>
//         <p className="text-sm text-neutral-600 mt-2">
//           Already have an account?{" "}
//           <a href="/sign-up" className="hover:underline">
//             Log In
//           </a>
//         </p>
//       </div>
//     </div>
//   )
// }

// export default Signup

import SignUpForm from "@/components/forms/SignUpForm"
import { GoogleAuth } from "@/components/social-auths/GoogleAuth"
import Image from "next/image"
import Link from "next/link"
import React from "react"

const Signup = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-6 bg-gray-50">
      {/* Logo Section */}
      <div className="flex items-center justify-center mb-6">
        <Image
          src="/images/sowgreen.png"
          alt="Sowgreen Logo"
          height={100}
          width={100}
          className="object-contain"
          priority // Ensures the logo loads quickly
        />
      </div>

      {/* Sign Up Card */}
      <div className="border border-neutral-300 rounded-lg p-6 sm:p-8 flex flex-col gap-6 w-full sm:max-w-[400px] md:max-w-[450px] bg-white shadow-lg">
        {/* Heading and Description */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome to Sowgreen Farms
          </h1>
          <p className="text-neutral-500 text-sm mt-2">
            Create an account with us to get the best deals on fresh farm
            produce.
          </p>
        </div>

        {/* Sign Up Form */}
        <SignUpForm />

        {/* Divider */}
        <div className="flex items-center">
          <span className="h-px flex-1 bg-neutral-300"></span>
          <span className="shrink-0 px-4 text-sm text-neutral-500">OR</span>
          <span className="h-px flex-1 bg-neutral-300"></span>
        </div>

        {/* Google Auth */}
        <div className="flex justify-center">
          <GoogleAuth />
        </div>

        {/* Log In Link */}
        <p className="text-sm text-neutral-600 text-center">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-teal-600 hover:text-teal-700 hover:underline transition-colors duration-200"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
