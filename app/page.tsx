import MiddleCard from "@/components/MiddleCard";
import Head from "next/head";
import ProductCards from "@/components/ProductCards";
import PaginationButtons from "@/components/PaginationButtons";
import CategoryCards from "@/components/cards/CategoryCards";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import Testimonials from "@/components/Testimonials";
import OrganicCard from "@/components/OrganicCard";
import DeliveryCard from "../components/DeliveryCard";
import Banner from "@/components/Banner";
import Middle from "@/components/Middle";
import { Button } from "@/components/ui/button";
import ViewAll from "@/components/ViewAll";

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
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
              Shop By Category
            </h2>
            <div className="flex gap-2">
              <div className="bg-slate-100 p-1 rounded-full cursor-pointer">
                <ChevronLeftIcon className="size-5" />
              </div>
              <div className="bg-slate-100 p-1 rounded-full cursor-pointer">
                <ChevronRightIcon className="size-5" />
              </div>
            </div>
          </div>

          <CategoryCards />
        </section>

        <section className="my-8 flex flex-col md:flex-row gap-4">
          <Middle />
        </section>

        <section className="my-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
              Farm fresh products
            </h2>
            <div>
              <PaginationButtons />
            </div>
          </div>
          <ProductCards />
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
  );
}
