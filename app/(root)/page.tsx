// "use client"

// import {
//   useCustomerStore,
//   useOrdersStore,
//   useProductStore,
//   useUserListStore,
// } from "@/store"
// import React, { useEffect, useState } from "react"
// import Head from "next/head"
// import ProductCards from "@/components/cards/product/ProductCards"
// import CategoryCards from "@/components/cards/category/CategoryCards"
// import Testimonials from "@/components/Testimonials"
// import ViewAll from "@/components/ViewAll"
// import DeliveryCard from "@/components/cards/DeliveryCard"
// import OrganicCard from "@/components/cards/OrganicCard"
// import CategoryChevrons from "@/components/CategoryChevrons"
// import ProductChevrons from "@/components/ProductChevrons"
// import MiddleCardAds from "@/components/cards/middle-cards/MiddleCardAds"
// import HeroBanner from "./HeroBanner"
// import { useBalance } from "@/context/BalanceContext"

// export default function Home() {
//   const { setProductDetails, products, setLoading } = useProductStore()
//   const { setOrderLoading, setOrderDetails } = useOrdersStore()
//   const { setCustomerLoading, setCustomerDetails } = useCustomerStore()

//   const [productList, setProductList] = useState([])
//   const [isLoading, setIsLoading] = useState(true)

//   // const { balance } = useUserListStore()
//   const { balance } = useBalance()

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
//           setOrderDetails(orders) // Use Zustand's setter
//           setLoading(false) // Assuming `setIsLoading` is local state
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
//           setCustomerDetails(address) // Use Zustand's setter
//           setCustomerLoading(false) // Assuming `setIsLoading` is local state
//         }
//       } catch (error) {
//         console.log(error)
//       }
//     }
//     CustomerData()
//   }, [setCustomerDetails])

//   return (
//     <div className="">
//       <Head>
//         <title>Sowgreen Organic - Fresh Grocery Store</title>
//       </Head>

//       <HeroBanner />
//       <main className=" md:container md:mx-auto py-8 px-3 flex-1">
//         <section className="my-10">
//           <CategoryChevrons>
//             <CategoryCards />
//           </CategoryChevrons>
//         </section>

//         <section className="my-8 flex flex-col md:flex-row gap-4">
//           <MiddleCardAds />
//         </section>

//         <section className="my-8 ">
//           <ProductChevrons message="Farm fresh products">
//             <ProductCards data={productList} isLoading={isLoading} />
//           </ProductChevrons>
//           <ViewAll />
//         </section>

//         <DeliveryCard />

//         <section className="my-8">
//           <OrganicCard />
//         </section>

//         <section className="my-8 bg-gray-100 p-8 rounded-lg">
//           <Testimonials />
//         </section>
//       </main>
//     </div>
//   )
// }

"use client"
import { useCustomerStore, useOrdersStore, useProductStore } from "@/store"
import React, { useEffect, useState } from "react"
import Head from "next/head"
import ProductCards from "@/components/cards/product/ProductCards"
import CategoryCards from "@/components/cards/category/CategoryCards"
import Testimonials from "@/components/Testimonials"
import ViewAll from "@/components/ViewAll"
import DeliveryCard from "@/components/cards/DeliveryCard"
import OrganicCard from "@/components/cards/OrganicCard"
import CategoryChevrons from "@/components/CategoryChevrons"
import ProductChevrons from "@/components/ProductChevrons"
import MiddleCardAds from "@/components/cards/middle-cards/MiddleCardAds"
import HeroBanner from "./HeroBanner"
import { useBalance } from "@/context/BalanceContext"
import CustomersWants from "@/components/cards/product/CustomersWants"

export default function Home() {
  const { setProductDetails, products, setLoading } = useProductStore()
  const { setOrderLoading, setOrderDetails } = useOrdersStore()
  const { setCustomerLoading, setCustomerDetails } = useCustomerStore()

  const [productList, setProductList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { balance } = useBalance()

  useEffect(() => {
    async function getProductList() {
      try {
        const res = await fetch("/api/products", {
          method: "GET",
          cache: "no-store",
        })

        if (res.ok) {
          const products = await res.json()
          setProductList(products)
          setIsLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getProductList()
  }, [])

  React.useEffect(() => {
    const OrdersData = async () => {
      try {
        const res = await fetch("/api/orders", {
          method: "GET",
          cache: "no-store",
        })
        if (res.ok) {
          const orders = await res.json()
          setOrderDetails(orders)
          setLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    OrdersData()
  }, [setOrderDetails])

  React.useEffect(() => {
    const CustomerData = async () => {
      try {
        const res = await fetch("/api/address", {
          method: "GET",
          cache: "no-store",
        })
        if (res.ok) {
          const address = await res.json()
          setCustomerDetails(address)
          setCustomerLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    CustomerData()
  }, [setCustomerDetails])

  return (
    <div className="bg-white">
      <Head>
        <title>Sowgreen Organic - Fresh Grocery Store</title>
        <meta
          name="description"
          content="Fresh organic fruits and vegetables delivered to your doorstep"
        />
      </Head>

      <HeroBanner />

      <main className="container mx-auto px-4 sm:px-6 py-8 flex-1">
        {/* Categories Section */}
        <section className="my-12">
          <div className="">
            <CategoryChevrons>
              <CategoryCards />
            </CategoryChevrons>
          </div>
        </section>

        {/* Promo Cards Section */}
        <section className="my-12">
          <MiddleCardAds />
        </section>

        {/* Featured Products */}
        <section className="my-12 w-full">
          {/* <ProductChevrons message="Fresh Farm Produce">
            <ProductCards data={productList} isLoading={isLoading} />
          </ProductChevrons> */}
          <CustomersWants message="Fresh Farm Produce" />
        </section>

        {/* Delivery Info */}
        <section className="my-12">
          <DeliveryCard />
        </section>

        {/* Organic Info */}
        <section className="my-12">
          <OrganicCard />
        </section>

        {/* Testimonials */}
        <section className="my-12 bg-white p-6 sm:p-8 rounded-xl shadow-sm">
          <Testimonials />
        </section>
      </main>
    </div>
  )
}
