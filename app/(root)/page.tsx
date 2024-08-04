import Head from "next/head"
import ProductCards from "@/components/cards/product/ProductCards"
import CategoryCards from "@/components/cards/category/CategoryCards"
import Testimonials from "@/components/Testimonials"

import Banner from "@/components/Banner"
import Middle from "@/components/Middle"
import ViewAll from "@/components/ViewAll"
import DeliveryCard from "@/components/cards/DeliveryCard"
import OrganicCard from "@/components/cards/OrganicCard"
import CategoryChevrons from "@/components/CategoryChevrons"
import ProductChevrons from "@/components/ProductChevrons"

export default function Home() {
  return (
    <div className="">
      <Head>
        <title>Growcer - Fresh Grocery Store</title>
      </Head>

      <main className="container mx-auto py-8 flex-1">
        <section className="bg-[#254336] rounded-lg">
          <Banner />
        </section>

        <section className="my-10">
          <CategoryChevrons>
            <CategoryCards />
          </CategoryChevrons>
        </section>

        <section className="my-8 flex flex-col md:flex-row gap-4">
          <Middle />
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
