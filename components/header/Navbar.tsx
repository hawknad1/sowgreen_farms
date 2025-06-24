// "use client"
// import Image from "next/image"
// import React from "react"
// import SideSheet from "./SideSheet"
// import Searchbar from "./Searchbar"
// import TheMenu from "../TheMenu"
// import SignInButton from "../buttons/SignInButton"
// import SignUpButton from "../buttons/SignUpButton"
// import UserButton from "./UserButton"
// import { useSession } from "next-auth/react"
// import { CartPopover } from "../CartPopover"

// const Navbar = () => {
//   const { data: session, status, update } = useSession()
//   const user = session?.user

//   return (
//     <header className="bg-white w-full sticky py-4 top-0 left-0 right-0 z-50">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="flex h-16 items-center justify-between gap-2 lg:gap-4 lg:space-x-10">
//           {/* Logo Section */}
//           <div className="flex items-center gap-4 md:gap-12">
//             <a href="/" className="block text-teal-600">
//               <span className="sr-only">Home---</span>
//               <Image
//                 src="/images/logo.png"
//                 alt="logo"
//                 width={180}
//                 height={80}
//                 className="object-cover w-32 md:w-48 filter brightness-105 saturate-150"
//               />
//             </a>
//           </div>

//           {/* Searchbar and Menu */}
//           <Searchbar />

//           <div className="hidden lg:flex items-center gap-4">
//             <TheMenu />
//           </div>

//           {/* User Actions */}
//           <div className="flex items-center gap-2 lg:gap-4">
//             <div className="hidden md:inline-flex">
//               {status === "loading" ? (
//                 // Show a loading skeleton or spinner while session is being fetched
//                 <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
//               ) : status === "authenticated" && user ? (
//                 // Show UserButton if authenticated
//                 <UserButton user={user} />
//               ) : (
//                 // Show SignInButton and SignUpButton if unauthenticated
//                 <div className="hidden md:flex items-center gap-3 lg:gap-4">
//                   <SignInButton />
//                   <SignUpButton />
//                 </div>
//               )}
//             </div>

//             <CartPopover />
//             <SideSheet />
//           </div>
//         </div>
//       </div>
//     </header>
//   )
// }

// export default Navbar

"use client"
import Image from "next/image"
import React, { useState } from "react"
import SideSheet from "./SideSheet"
import Searchbar from "./Searchbar"
import TheMenu from "../TheMenu"
import SignInButton from "../buttons/SignInButton"
import SignUpButton from "../buttons/SignUpButton"
import UserButton from "./UserButton"
import { useSession } from "next-auth/react"
import { CartPopover } from "../CartPopover"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid"
import Link from "next/link"
import { Heart } from "lucide-react"
import { useWishlistStore } from "@/store"

const Navbar = () => {
  const { data: session, status } = useSession()
  const user = session?.user
  const pathname = usePathname()
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const { wishlist } = useWishlistStore()

  return (
    <header className="bg-white w-full sticky top-0 left-0 right-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center">
            <SideSheet />
          </div>

          {/* Logo Section */}
          <motion.div
            className="flex items-center justify-center lg:justify-start min-w-[150px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <a href="/" className="block">
              <span className="sr-only">Home</span>
              <Image
                src="/images/logo.png"
                alt="logo"
                width={200}
                height={80}
                className="object-contain w-[180px] md:w-[180px]"
                priority
              />
            </a>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center justify-center mx-6">
            <TheMenu />
          </div>
          {/* <Link href="/wishlist" className="relative p-2">
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link> */}

          {/* User Actions */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Desktop Searchbar */}
            <div className="hidden md:flex min-w-[400px] max-w-[500px]">
              <Searchbar />
            </div>

            {/* Mobile Search Button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-sowgren_Color transition-colors"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              aria-label="Search"
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>

            {/* User/Auth Buttons */}
            <div className="flex items-center gap-3">
              {status === "loading" ? (
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
              ) : status === "authenticated" && user ? (
                <UserButton user={user} />
              ) : (
                <>
                  <div className="hidden md:flex items-center gap-3">
                    <SignInButton />
                    <SignUpButton />
                  </div>
                </>
              )}
              <CartPopover />
            </div>
          </div>
        </div>

        {/* Mobile Search Popover */}
        {showMobileSearch && (
          <div className="md:hidden pb-3 pt-2 px-4 w-full">
            <Searchbar onClose={() => setShowMobileSearch(false)} />
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar

// "use client"
// import Image from "next/image"
// import React from "react"
// import SideSheet from "./SideSheet"
// import Searchbar from "./Searchbar"
// import TheMenu from "../TheMenu"
// import SignInButton from "../buttons/SignInButton"
// import SignUpButton from "../buttons/SignUpButton"
// import UserButton from "./UserButton"
// import { useSession } from "next-auth/react"
// import { CartPopover } from "../CartPopover"
// import { motion } from "framer-motion"
// import { usePathname } from "next/navigation"

// const Navbar = () => {
//   const { data: session, status } = useSession()
//   const user = session?.user
//   const pathname = usePathname()

//   return (
//     <header className="bg-white w-full sticky top-0 left-0 right-0 z-50 border-b border-gray-100 shadow-sm">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="flex h-20 items-center justify-between gap-4">
//           {" "}
//           {/* Increased height */}
//           {/* Mobile Menu Button */}
//           <div className="flex lg:hidden items-center">
//             <SideSheet />
//           </div>
//           {/* Logo Section - Now larger */}
//           <motion.div
//             className="flex items-center justify-center lg:justify-start min-w-[150px]"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.3 }}
//           >
//             <a href="/" className="block">
//               <span className="sr-only">Home</span>
//               <Image
//                 src="/images/logo.png"
//                 alt="logo"
//                 width={200} // Increased size
//                 height={80} // Increased size
//                 className="object-contain w-[180px] md:w-[180px]" // Larger dimensions
//                 priority
//               />
//             </a>
//           </motion.div>
//           {/* Desktop Menu */}
//           <div className="hidden lg:flex items-center justify-center  mx-6">
//             <TheMenu />
//           </div>
//           {/* User Actions */}
//           <div className="flex items-center gap-4 md:gap-6">
//             {" "}
//             {/* Increased gap */}
//             <div className="hidden md:flex min-w-[200px] max-w-[500px]">
//               {" "}
//               {/* Wider constraints */}
//               <Searchbar />
//             </div>
//             {/* User/Auth Buttons */}
//             <div className="flex items-center gap-3">
//               {status === "loading" ? (
//                 <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
//               ) : status === "authenticated" && user ? (
//                 <UserButton user={user} />
//               ) : (
//                 <>
//                   <div className="hidden md:flex items-center gap-3">
//                     <SignInButton />
//                     <SignUpButton />
//                   </div>
//                 </>
//               )}

//               <CartPopover />
//             </div>
//           </div>
//         </div>

//         {/* Mobile Searchbar - Now full width */}
//         {(pathname === "/products" || pathname === "/category") && (
//           <div className="md:hidden pb-3 pt-2 px-4 w-full">
//             {" "}
//             <Searchbar />
//           </div>
//         )}
//       </div>
//     </header>
//   )
// }

// export default Navbar
