"use client"
import Image from "next/image"
import React from "react"
import SideSheet from "./SideSheet"
import Searchbar from "./Searchbar"
import TheMenu from "../TheMenu"
import ShopBasketIcon from "../basket/ShopBasketIcon"
import SignInButton from "../buttons/SignInButton"
import SignUpButton from "../buttons/SignUpButton"
import { useSession } from "next-auth/react"
import { Skeleton } from "../ui/skeleton"
import UserButton from "./UserButton"
import { CartPopover } from "../CartPopover"

const Navbar = () => {
  const { data: session, status } = useSession()
  const user = session?.user

  if (status === "loading") {
    return <div>Loading...</div> // Or a loading spinner
  }

  return (
    <header className="bg-white border shadow-sm py-2 w-full">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2 lg:gap-4 lg:space-x-10 ">
          <div className=" md:flex md:items-center md:gap-12">
            <a className="block text-teal-600" href="/">
              <span className="sr-only">Home</span>
              <Image
                src="/images/logo.png"
                alt="logo"
                width={80}
                height={80}
                className="object-contain w-20 md:w-28"
              />
            </a>
          </div>

          <Searchbar />
          <div className="hidden lg:inline-flex">
            <TheMenu />
          </div>

          <div className="flex items-center gap-2 space-x-2 lg:gap-4">
            {status === "authenticated" && user ? (
              <UserButton user={user} />
            ) : (
              <div className="hidden md:flex items-center md:gap-3 lg:gap-4">
                <SignInButton />
                <SignUpButton />
              </div>
            )}
            <CartPopover />
            {/* <ShopBasketIcon /> */}
            <SideSheet />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar

// const Navbar = () => {
//   const { data: session, status } = useSession()
//   const user = session?.user

//   return (
//     <header className="bg-white border shadow-sm py-2 w-full">
//       <div className="mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex h-16 items-center justify-between gap-2 lg:gap-4 lg:space-x-10 ">
//           <div className=" md:flex md:items-center md:gap-12">
//             <a className="block text-teal-600" href="/">
//               <span className="sr-only">Home</span>
//               <Image
//                 src="/images/sowgreen.png"
//                 alt="logo"
//                 width={80}
//                 height={80}
//                 className="object-contain w-20"
//               />
//             </a>
//           </div>

//           <Searchbar />
//           <div className="hidden lg:inline-flex">
//             <TheMenu />
//           </div>

//           <div className="flex items-center gap-2 space-x-2 lg:gap-4">
//             {status === "loading" ? (
//               <Skeleton className="h-8 w-8 rounded-full" />
//             ) : user ? (
//               <UserButton user={user} />
//             ) : (
//               <div className="hidden md:flex items-center md:gap-3 lg:gap-4">
//                 <SignInButton />
//                 <SignUpButton />
//               </div>
//             )}
//             <ShopBasketIcon />
//             <SideSheet />
//           </div>
//         </div>
//       </div>
//     </header>
//   )
// }

// export default Navbar
