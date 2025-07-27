// import {
//   accountLinks,
//   companyLinks,
//   footerLeftLinks,
//   helpfulLinks,
//   paymentLinks,
// } from "@/constants"
// import Image from "next/image"
// import Link from "next/link"
// import React from "react"
// import Subscribe from "./Subscribe"
// import Socials from "./Socials"
// import { Separator } from "../ui/separator"
// import { ChevronRight } from "lucide-react"
// import { ArrowLongRightIcon } from "@heroicons/react/24/outline"

// const Footer = () => {
//   return (
//     <>
//       <footer className="bg-sowgren_Color">
//         <div className="container px-6 py-10 mx-auto">
//           <div className="md:flex md:-mx-3 md:items-center md:justify-between ">
//             <h1 className="text-xl font-semibold tracking-tight text-gray-300 md:mx-3 xl:text-2xl">
//               Subscribe our newsletter to get update.
//             </h1>
//             <div className="mt-6 md:mx-3 shrink-0 md:mt-0 md:w-auto">
//               <a
//                 href="/sign-up"
//                 className="inline-flex items-center justify-center w-full px-4 py-2 text-sm text-sowgren_Color duration-300 bg-gray-200 rounded-lg gap-x-3 hover:bg-gray-300 focus:ring focus:ring-gray-300 focus:ring-opacity-80"
//               >
//                 <span>Sign Up Now</span>
//                 <ArrowLongRightIcon className="h-6 w-6" />
//               </a>
//             </div>
//           </div>
//           {/* <hr className="my-6 border-neutral-50 md:my-7 " /> */}
//           <div className="my-6 border-neutral-50 md:my-7 " />
//           {/* <Separator className="border-neutral-50" /> */}
//           <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//             <div className="">
//               <p className="font-semibold text-gray-300">Account</p>
//               <div className="gap-3 mt-4 flex flex-col">
//                 {accountLinks.map((acc) => (
//                   <Link
//                     key={acc.id}
//                     href={acc.href}
//                     className=" text-gray-300 transition-colors duration-300 hover:underline hover:text-gray-500"
//                   >
//                     {acc.title}
//                   </Link>
//                 ))}
//               </div>
//             </div>

//             <div className="">
//               <p className="font-semibold text-gray-300">Company</p>
//               <div className="gap-3 mt-4 flex flex-col">
//                 {companyLinks.map((com) => (
//                   <Link
//                     key={com.id}
//                     href={com.href}
//                     className=" text-gray-300 transition-colors duration-300 hover:underline hover:text-gray-500"
//                   >
//                     {com.title}
//                   </Link>
//                 ))}
//               </div>
//             </div>

//             <div className="">
//               <p className="font-semibold text-gray-300">Helpful Links</p>
//               <div className="gap-3 mt-4 flex flex-col">
//                 {helpfulLinks.map((com) => (
//                   <Link
//                     key={com.id}
//                     href={com.href}
//                     className=" text-gray-300 transition-colors duration-300 hover:underline hover:text-gray-500"
//                   >
//                     {com.title}
//                   </Link>
//                 ))}
//               </div>
//             </div>

//             <div className="">
//               <p className="font-medium text-gray-300">Payment Methods</p>
//               <div className="gap-y-2 mt-4 grid grid-cols-2">
//                 {paymentLinks.map((pay) => (
//                   <div
//                     key={pay.id}
//                     className="border-slate-300 bg-gray-200 border rounded-md w-20"
//                   >
//                     <Image
//                       src={pay.image}
//                       width={100}
//                       height={100}
//                       alt="Payment Logo"
//                       className="h-9 w-full object-contain rounded-lg"
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//           {/* <hr className="my-6 border-gray-200 dark:border-gray-700" /> */}
//           <div className="my-6 border-neutral-50 md:my-7 " />

//           <div className="flex flex-col items-center justify-between sm:flex-row">
//             <a href="/">
//               <Image
//                 src="/images/logo.png"
//                 height={100}
//                 width={100}
//                 className="w-[200px] object-contain"
//                 alt="logo"
//               />
//             </a>

//             <p className="mt-4 text-sm text-gray-400 sm:mt-0 dark:text-gray-300">
//               {/* © Copyright 2021. All Rights Reserved. */}
//               Copyright © 2025. ZOROASTIQUE Limited. All rights reserved.
//             </p>
//           </div>
//         </div>
//       </footer>
//     </>
//   )
// }

// export default Footer

import Image from "next/image"
import Link from "next/link"
import {
  Mail,
  Phone,
  MapPin,
  LinkedinIcon,
  CheckCircle,
  Lock,
  ShieldCheck,
} from "lucide-react"
import { companyLinks, paymentLinks, quickLinks } from "@/constants"
import { FaFacebook } from "react-icons/fa"
import { InstagramLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons"

// export default function Footer() {
//   return (
//     <footer className="bg-sowgren_Color text-white">
//       {/* Main Footer Content */}
//       <div className="container mx-auto px-8 py-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
//           {/* Company Info & Contact */}
//           <div className="lg:col-span-1">
//             <Link href="/" className="inline-block mb-6">
//               <Image
//                 src="/images/logo.png"
//                 alt="Sowgreen Logo"
//                 height={100}
//                 width={100}
//                 className="w-[200px] object-contain"
//               />
//             </Link>
//             {/* <p className="text-slate-300 text-sm leading-relaxed mb-6">
//               At Sowgreen Farms, we believe in providing the freshest produce
//               and groceries directly to your doorstep. Our mission is to make
//               healthy eating accessible and affordable for everyone.
//             </p> */}
//             <div className="space-y-3">
//               <div className="flex items-center gap-3 text-sm text-slate-300">
//                 <Phone className="h-4 w-4 text-blue-400" />
//                 <span>+ (233) 241 234 234</span>
//               </div>
//               <div className="flex items-center gap-3 text-sm text-slate-300">
//                 <Mail className="h-4 w-4 text-blue-400" />
//                 <span>info@sowgreenorganic.com</span>
//               </div>
//               <div className="flex items-center gap-3 text-sm text-slate-300">
//                 <MapPin className="h-4 w-4 text-blue-400" />
//                 <span>
//                   14 High Street, Sowgreen Farms Building,
//                   <br />
//                   Dzorwulu, Accra.
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Quick Links */}
//           <div>
//             <h3 className="font-semibold text-white mb-6">Quick Links</h3>
//             <ul className="space-y-3">
//               {quickLinks.map((link) => (
//                 <li>
//                   <Link
//                     href={link.href}
//                     className="text-slate-300 hover:text-white text-sm transition-colors duration-200"
//                   >
//                     {link.title}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Company Links */}
//           <div className="">
//             <h3 className="font-semibold text-white mb-6">Quick Links</h3>
//             <ul className="space-y-3">
//               {quickLinks.map((link) => (
//                 <li>
//                   <Link
//                     href={link.href}
//                     className="text-slate-300 hover:text-white text-sm transition-colors duration-200"
//                   >
//                     {link.title}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Secure Payments */}
//           <div className="">
//             <h3 className="font-semibold text-white mb-6">Secure Payments</h3>
//             <p className="text-slate-300 text-sm mb-4">
//               We accept all major payment methods
//             </p>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
//               {paymentLinks.map((pay) => (
//                 <div className="bg-white rounded-lg p-3 h-12 w-auto flex items-center justify-center">
//                   <Image
//                     src={pay.image}
//                     alt="Visa"
//                     width={100}
//                     height={100}
//                     className="bg-contain h-12 md:h-auto w-auto"
//                   />
//                 </div>
//               ))}
//             </div>
//             <div className="flex flex-col gap-2 text-xs text-slate-400">
//               <span className="flex items-center gap-2">
//                 🔒 256-bit SSL Encryption
//               </span>
//               <span className="flex items-center gap-2">
//                 ✓ PCI DSS Compliant
//               </span>
//               <span className="flex items-center gap-2">
//                 🛡️ Fraud Protection
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Bar */}
//       <div className="border-t border-slate-800">
//         <div className="container mx-auto px-4 py-6">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//             <div className="text-sm text-slate-400">
//               <span>
//                 © {new Date().getFullYear()} ZOROASTIQUE Limited. All rights
//                 reserved.
//               </span>
//             </div>
//             <div className="flex items-center gap-6 text-xs text-slate-400">
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-green-400 rounded-full"></div>
//                 <span>All systems operational</span>
//               </div>
//               <span>Trusted by our loyal customers nationwide</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   )
// }

export default function Footer() {
  return (
    <footer className="bg-sowgren_Color text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
          {/* Company Info & Contact - Reduced to 1 column width */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="inline-block mb-4 hover:opacity-90 transition-opacity"
            >
              <Image
                src="/images/logo.png"
                alt="Sowgreen Logo"
                width={160}
                height={80}
                className="w-[180px] object-contain"
              />
            </Link>
            <div className="space-y-2.5">
              <div className="flex items-start gap-3 text-sm text-slate-300 hover:text-white transition-colors">
                <Phone className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>+ (233) 241 234 234</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-300 hover:text-white transition-colors">
                <Mail className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>info@sowgreenorganic.com</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-300 hover:text-white transition-colors">
                <MapPin className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>
                  14 High Street, Sowgreen Farms Building,
                  <br />
                  Dzorwulu, Accra.
                </span>
              </div>
            </div>

            {/* Social Media */}
            {/* <div className="mt-6 flex items-center gap-4">
              {socialLinks.map((social) => (
                <Link
                  href={social.href}
                  key={social.name}
                  className="text-slate-300 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div> */}
          </div>

          {/* Quick Links - Reduced to 1 column width */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-white text-lg mb-4 pb-2 border-b border-slate-700">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links - Reduced to 1 column width */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-white text-lg mb-4 pb-2 border-b border-slate-700">
              Company
            </h3>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Secure Payments - Expanded to 2 column width */}
          <div className="sm:col-span-2 lg:col-span-2">
            <h3 className="font-semibold text-white text-lg mb-4 pb-2 border-b border-slate-700">
              Secure Payments
            </h3>
            <p className="text-slate-300 text-sm mb-4">
              We accept all major payment methods
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mb-6">
              {paymentLinks.map((pay) => (
                <div
                  key={pay.image}
                  className="bg-white rounded-lg p-2 h-12 flex items-center justify-center hover:shadow-md transition-shadow"
                >
                  <Image
                    src={pay.image}
                    alt={pay.image}
                    width={70} // Slightly larger
                    height={40}
                    className="object-contain h-full w-auto"
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-green-400" />
                <span>256-bit SSL Encryption</span>
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-green-400" />
                <span>PCI DSS Compliant</span>
              </span>
              <span className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-green-400" />
                <span>Fraud Protection</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
            <div className="text-slate-400 text-center md:text-left">
              © {new Date().getFullYear()} ZOROASTIQUE Limited. All rights
              reserved.
            </div>
            <div className="flex items-center flex-wrap justify-center gap-4 text-xs sm:text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <span>Trusted nationwide</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// export default function Footer() {
//   return (
//     <footer className="bg-sowgren_Color text-white">
//       {/* Main Footer Content */}
//       <div className="container mx-auto px-4 sm:px-6 py-8">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
//           {/* Company Info & Contact */}
//           <div className="lg:col-span-1">
//             <Link
//               href="/"
//               className="inline-block mb-4 hover:opacity-90 transition-opacity"
//             >
//               <Image
//                 src="/images/logo.png"
//                 alt="Sowgreen Logo"
//                 width={160}
//                 height={80}
//                 className="w-[180px] object-contain"
//               />
//             </Link>
//             <div className="space-y-2.5">
//               <div className="flex items-start gap-3 text-sm text-slate-300 hover:text-white transition-colors">
//                 <Phone className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
//                 <span>+ (233) 241 234 234</span>
//               </div>
//               <div className="flex items-start gap-3 text-sm text-slate-300 hover:text-white transition-colors">
//                 <Mail className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
//                 <span>info@sowgreenorganic.com</span>
//               </div>
//               <div className="flex items-start gap-3 text-sm text-slate-300 hover:text-white transition-colors">
//                 <MapPin className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
//                 <span>
//                   14 High Street, Sowgreen Farms Building,
//                   <br />
//                   Dzorwulu, Accra.
//                 </span>
//               </div>
//             </div>

//             {/* Social Media */}
//             <div className="mt-6 flex items-center gap-4">
//               {socialLinks.map((social) => (
//                 <Link
//                   href={social.href}
//                   key={social.name}
//                   className="text-slate-300 hover:text-white transition-colors"
//                   aria-label={social.name}
//                 >
//                   <social.icon className="h-5 w-5" />
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* Quick Links */}
//           <div>
//             <h3 className="font-semibold text-white text-lg mb-4 pb-2 border-b border-slate-700">
//               Quick Links
//             </h3>
//             <ul className="space-y-2.5">
//               {quickLinks.map((link) => (
//                 <li key={link.title}>
//                   <Link
//                     href={link.href}
//                     className="text-slate-300 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group"
//                   >
//                     <span className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
//                     {link.title}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Company Links */}
//           <div>
//             <h3 className="font-semibold text-white text-lg mb-4 pb-2 border-b border-slate-700">
//               Company
//             </h3>
//             <ul className="space-y-2.5">
//               {companyLinks.map((link) => (
//                 <li key={link.title}>
//                   <Link
//                     href={link.href}
//                     className="text-slate-300 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group"
//                   >
//                     <span className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
//                     {link.title}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Secure Payments */}
//           <div>
//             <h3 className="font-semibold text-white text-lg mb-4 pb-2 border-b border-slate-700">
//               Secure Payments
//             </h3>
//             <p className="text-slate-300 text-sm mb-4">
//               We accept all major payment methods
//             </p>
//             <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
//               {paymentLinks.map((pay) => (
//                 <div
//                   key={pay.id}
//                   className="bg-white rounded-lg p-2 h-12 flex items-center justify-center hover:shadow-md transition-shadow"
//                 >
//                   <Image
//                     src={pay.image}
//                     alt={pay.image}
//                     width={60}
//                     height={40}
//                     className="object-contain h-full w-auto"
//                   />
//                 </div>
//               ))}
//             </div>
//             <div className="flex flex-col gap-2 text-xs text-slate-400">
//               <span className="flex items-center gap-2">
//                 <ShieldCheck className="h-3.5 w-3.5 text-green-400" />
//                 <span>256-bit SSL Encryption</span>
//               </span>
//               <span className="flex items-center gap-2">
//                 <CheckCircle className="h-3.5 w-3.5 text-green-400" />
//                 <span>PCI DSS Compliant</span>
//               </span>
//               <span className="flex items-center gap-2">
//                 <Lock className="h-3.5 w-3.5 text-green-400" />
//                 <span>Fraud Protection</span>
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Bar */}
//       <div className="border-t border-slate-700">
//         <div className="container mx-auto px-4 sm:px-6 py-4">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
//             <div className="text-slate-400 text-center md:text-left">
//               © {new Date().getFullYear()} ZOROASTIQUE Limited. All rights
//               reserved.
//             </div>
//             <div className="flex items-center flex-wrap justify-center gap-4 text-xs sm:text-sm text-slate-400">
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//                 <span>All systems operational</span>
//               </div>
//               <span className="hidden sm:inline">•</span>
//               <span>Trusted nationwide</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   )
// }

const socialLinks = [
  { name: "Facebook", href: "#", icon: FaFacebook },
  { name: "Twitter", href: "#", icon: TwitterLogoIcon },
  { name: "Instagram", href: "#", icon: InstagramLogoIcon },
  { name: "LinkedIn", href: "#", icon: LinkedinIcon },
]
