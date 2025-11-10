// "use client"
// import React, { useEffect, useState } from "react"
// import { useCustomerStore, useOrdersStore, useProductStore } from "@/store"
// import Head from "next/head"
// import CategoryCards from "@/components/cards/category/CategoryCards"
// import Testimonials from "@/components/Testimonials"
// import DeliveryCard from "@/components/cards/DeliveryCard"
// import OrganicCard from "@/components/cards/OrganicCard"
// import CategoryChevrons from "@/components/CategoryChevrons"
// import MiddleCardAds from "@/components/cards/middle-cards/MiddleCardAds"
// import HeroBanner from "./HeroBanner"
// import CustomersWants from "@/components/cards/product/CustomersWants"
// import PartnerLogos from "./PartnerLogos"

// export default function Home() {
//   const { setLoading } = useProductStore()
//   const { setOrderDetails } = useOrdersStore()
//   const { setCustomerLoading, setCustomerDetails } = useCustomerStore()

//   const [productList, setProductList] = useState([])
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     async function getProductList() {
//       try {
//         const res = await fetch("/api/products", {
//           method: "GET",
//           cache: "no-store",
//         })

//         if (res.ok) {
//           const products = await res.json()
//           setProductList(products)
//           setIsLoading(false)
//         }
//       } catch (error) {
//         console.log(error)
//       }
//     }
//     getProductList()
//   }, [])

//   React.useEffect(() => {
//     const OrdersData = async () => {
//       try {
//         const res = await fetch("/api/orders", {
//           method: "GET",
//           cache: "no-store",
//         })
//         if (res.ok) {
//           const orders = await res.json()
//           setOrderDetails(orders)
//           setLoading(false)
//         }
//       } catch (error) {
//         console.log(error)
//       }
//     }
//     OrdersData()
//   }, [setOrderDetails])

//   React.useEffect(() => {
//     const CustomerData = async () => {
//       try {
//         const res = await fetch("/api/address", {
//           method: "GET",
//           cache: "no-store",
//         })
//         if (res.ok) {
//           const address = await res.json()
//           setCustomerDetails(address)
//           setCustomerLoading(false)
//         }
//       } catch (error) {
//         console.log(error)
//       }
//     }
//     CustomerData()
//   }, [setCustomerDetails])

//   return (
//     <div className="bg-white">
//       <Head>
//         <title>Sowgreen Organic - Fresh Grocery Store</title>
//         <meta
//           name="description"
//           content="Fresh organic fruits and vegetables delivered to your doorstep"
//         />
//       </Head>

//       <HeroBanner />

//       <main className="container mx-auto px-4 sm:px-6 py-8 flex-1">
//         {/* Categories Section */}
//         <section className="my-12">
//           <div className="">
//             <CategoryChevrons>
//               <CategoryCards />
//             </CategoryChevrons>
//           </div>
//         </section>

//         {/* Promo Cards Section */}
//         <section className="my-12">
//           <MiddleCardAds />
//         </section>

//         {/* Featured Products */}
//         <section className="my-12 w-full">
//           <CustomersWants message="Fresh Farm Produce" />
//         </section>

//         {/* Delivery Info */}
//         <section className="my-12">
//           <DeliveryCard />
//         </section>

//         {/* Organic Info */}
//         <section className="my-12">
//           <OrganicCard />
//         </section>

//         {/* Partner Logos */}
//         <PartnerLogos />

//         {/* Testimonials */}
//         <section className="my-12 bg-white p-6 sm:p-8 rounded-xl shadow-sm">
//           <Testimonials />
//         </section>
//       </main>
//     </div>
//   )
// }

// NO "use client" here! This is the root Server Component for the page.

import React from "react"
import dynamic from "next/dynamic"
import { getCategories, getPopularProducts } from "@/lib/data" // Step 1

// Import components that are ALWAYS visible (above the fold)
import HeroBanner from "./HeroBanner"
import CategoryChevrons from "@/components/CategoryChevrons"
import MiddleCardAds from "@/components/cards/middle-cards/MiddleCardAds"
import CustomersWants from "@/components/cards/product/CustomersWants"
import DeliveryCard from "@/components/cards/DeliveryCard"
import CategoryCards from "@/components/cards/category/CategoryCards"

// LAZY LOAD components that are below the fold
const OrganicCard = dynamic(() => import("@/components/cards/OrganicCard"))
const PartnerLogos = dynamic(() => import("./PartnerLogos"))
const Testimonials = dynamic(() => import("@/components/Testimonials"))

// Use the 'metadata' export for SEO instead of next/head in the App Router
export const metadata = {
  title: "Sowgreen Organic Farms - Fresh Grocery Store",
  description:
    "Fresh organic fruits and vegetables delivered to your doorstep.",
}

export default async function Home() {
  // Fetch data in parallel on the server before rendering
  const [popularProducts, categories] = await Promise.all([
    getPopularProducts(),
    getCategories(),
  ])

  return (
    <div className="bg-white">
      <HeroBanner />

      <main className="container mx-auto flex-1 px-4 py-8 sm:px-6">
        <section className="my-12">
          <CategoryChevrons>
            {/* We pass the fetched categories as a prop */}
            <CategoryCards categories={categories} />
          </CategoryChevrons>
        </section>

        <section className="my-12">
          <MiddleCardAds />
        </section>

        <section className="my-12 w-full">
          {/* We pass the fetched products as a prop */}
          <CustomersWants
            message="Fresh Farm Produce"
            initialProducts={popularProducts}
            showSkeleton={true} // Add this prop
          />
        </section>

        <section className="my-12">
          <DeliveryCard />
        </section>

        {/* These components will only load when they are about to be viewed */}
        <section className="my-12">
          <OrganicCard />
        </section>

        <PartnerLogos />

        <section className="my-12 rounded-xl bg-white p-6 shadow-sm sm:p-8">
          <Testimonials />
        </section>
      </main>
    </div>
  )
}
