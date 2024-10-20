"use client"
import React from "react"
import { Button } from "./ui/button"
import { ShoppingBagIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"

const Banner = () => {
  const router = useRouter()
  return (
    <section className="relative bg-[url(https://images.unsplash.com/photo-1553695142-4bb5259028e2?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] h-[450px] bg-cover bg-no-repeat bg-bottom">
      <div className=" flex justify-start py-24 px-8 h-full">
        <div className="max-w-xl text-start py-6 ltr:sm:text-left rtl:sm:text-right">
          <h1 className="text-3xl flex flex-col gap-y-1 font-extrabold sm:text-5xl ">
            <span className="bg-[#FFEADD] p-2 rounded-sm">
              Don't Miss Out On Our
            </span>
            <strong className="block font-extrabold text-green-700 bg-[#FFF8E8] p-2 rounded-sm">
              Organic Farm Produce.
            </strong>
          </h1>

          <p className="mt-4 max-w-lg sm:text-xl/relaxed bg-[#EE4E4E] font-bold text-white rounded-sm w-fit px-2">
            Save up to 10% off on your first buy
          </p>

          <div className="mt-8 flex flex-wrap gap-4 text-center">
            <Button
              onClick={() => router.push("/products")}
              className="bg-white flex items-center gap-1 hover:bg-neutral-200 text-black font-semibold shadow-lg"
            >
              <ShoppingBagIcon className="h-4 w-4" />
              Shop now
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Banner
