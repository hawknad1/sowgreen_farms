"use client"
import Head from "next/head"
import ProductCards from "@/components/cards/product/ProductCards"
import CategoryCards from "@/components/cards/category/CategoryCards"
import Testimonials from "@/components/Testimonials"
import Banner from "@/components/Banner"
import ViewAll from "@/components/ViewAll"
import DeliveryCard from "@/components/cards/DeliveryCard"
import OrganicCard from "@/components/cards/OrganicCard"
import CategoryChevrons from "@/components/CategoryChevrons"
import ProductChevrons from "@/components/ProductChevrons"
import MiddleCardAds from "@/components/cards/middle-cards/MiddleCardAds"
import { useCustomerStore, useOrdersStore, useProductStore } from "@/store"
import React, { useEffect } from "react"

export default function Home() {
  const { setProductDetails, products, setLoading } = useProductStore()
  const { setOrderLoading, setOrderDetails } = useOrdersStore()
  const { setCustomerLoading, setCustomerDetails } = useCustomerStore()

  React.useEffect(() => {
    const OrdersData = async () => {
      try {
        const res = await fetch("/api/orders", {
          method: "GET",
          cache: "no-store",
        })
        if (res.ok) {
          const orders = await res.json()
          setOrderDetails(orders) // Use Zustand's setter
          setLoading(false) // Assuming `setIsLoading` is local state
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
          setCustomerDetails(address) // Use Zustand's setter
          setCustomerLoading(false) // Assuming `setIsLoading` is local state
        }
      } catch (error) {
        console.log(error)
      }
    }
    CustomerData()
  }, [setCustomerDetails])

  return (
    <div className="">
      <Head>
        <title>Growcer - Fresh Grocery Store</title>
      </Head>

      <section className="bg-[#254336] rounded-lg">
        <Banner />
      </section>
      <main className="container mx-auto py-8 flex-1">
        <section className="my-10">
          <CategoryChevrons>
            <CategoryCards />
          </CategoryChevrons>
        </section>

        <section className="my-8 flex flex-col md:flex-row gap-4">
          <MiddleCardAds />
        </section>

        <section className="my-8">
          <ProductChevrons>
            <ProductCards />
          </ProductChevrons>
          <ViewAll />
        </section>

        <section className="my-8 bg-[#E4DCCF] p-5 rounded-lg flex flex-col md:flex-row items-center ">
          <DeliveryCard />
        </section>

        <section className="my-8">
          <OrganicCard />
        </section>

        <section className="my-8 bg-gray-100 p-8 rounded-lg">
          <Testimonials />
        </section>
      </main>
    </div>
  )
}
