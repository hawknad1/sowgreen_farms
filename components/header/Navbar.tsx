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
//   const { data: session, status } = useSession()
//   const user = session?.user

//   if (status === "loading") {
//     return <div>Loading...</div> // Or a loading spinner
//   }

//   return (
//     <header className="bg-white w-full sticky py-4  top-0 left-0 right-0 z-50">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="flex h-16 items-center justify-between gap-2 lg:gap-4 lg:space-x-10">
//           {/* Logo Section */}
//           <div className="flex items-center gap-4 md:gap-12">
//             <a href="/" className="block text-teal-600">
//               <span className="sr-only">Home</span>
//               <Image
//                 src="/images/logo.png"
//                 alt="logo"
//                 width={80}
//                 height={80}
//                 className="object-cover w-20 md:w-40"
//               />
//             </a>
//           </div>

//           {/* Searchbar and Menu */}
//           <Searchbar />

//           <div className="hidden lg:flex items-center gap-4">
//             <TheMenu />
//           </div>

//           {/* User Actions */}
//           <div className="flex items-center gap-2 lg:gap-4 ">
//             <div className="hidden md:inline-flex">
//               {status === "authenticated" && user ? (
//                 <UserButton user={user} />
//               ) : (
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
//   const { data: session, status } = useSession()
//   const user = session?.user

//   return (
//     <header className="bg-white w-full sticky py-4 top-0 left-0 right-0 z-50">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="flex h-16 items-center justify-between gap-2 lg:gap-4 lg:space-x-10">
//           {/* Logo Section */}
//           <div className="flex items-center gap-4 md:gap-12">
//             <a href="/" className="block text-teal-600">
//               <span className="sr-only">Home</span>
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
import React from "react"
import SideSheet from "./SideSheet"
import Searchbar from "./Searchbar"
import TheMenu from "../TheMenu"
import SignInButton from "../buttons/SignInButton"
import SignUpButton from "../buttons/SignUpButton"
import UserButton from "./UserButton"
import { useSession } from "next-auth/react"
import { CartPopover } from "../CartPopover"

const Navbar = () => {
  const { data: session, status, update } = useSession()
  const user = session?.user

  return (
    <header className="bg-white w-full sticky py-4 top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2 lg:gap-4 lg:space-x-10">
          {/* Logo Section */}
          <div className="flex items-center gap-4 md:gap-12">
            <a href="/" className="block text-teal-600">
              <span className="sr-only">Home</span>
              <Image
                src="/images/logo.png"
                alt="logo"
                width={180}
                height={80}
                className="object-cover w-32 md:w-48 filter brightness-105 saturate-150"
              />
            </a>
          </div>

          {/* Searchbar and Menu */}
          <Searchbar />

          <div className="hidden lg:flex items-center gap-4">
            <TheMenu />
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="hidden md:inline-flex">
              {status === "loading" ? (
                // Show a loading skeleton or spinner while session is being fetched
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
              ) : status === "authenticated" && user ? (
                // Show UserButton if authenticated
                <UserButton user={user} />
              ) : (
                // Show SignInButton and SignUpButton if unauthenticated
                <div className="hidden md:flex items-center gap-3 lg:gap-4">
                  <SignInButton />
                  <SignUpButton />
                </div>
              )}
            </div>

            <CartPopover />
            <SideSheet />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
