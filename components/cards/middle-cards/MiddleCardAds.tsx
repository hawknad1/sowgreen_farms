"use client"
import React from "react"
import MiddleCard from "./MiddleCard"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "../../ui/button"

const MiddleCardAds = () => {
  const router = useRouter()
  return (
    <div className="grid lg:grid-cols-2 gap-3">
      <MiddleCard className="bg-orange-100">
        <div>
          <h3 className="text-base sm:text-xl lg:text-2xl font-bold mb-4 max-w-[185px] sm:max-w-68 md:max-w-80">
            Grab up to{" "}
            <span className="bg-black text-white px-2 rounded-lg">20% off</span>{" "}
            on fresh vegetables
          </h3>
          <Button
            onClick={() => router.push("/discount")}
            className="bg-red-500 text-white px-4 py-2 font-medium hover:bg-red-500/80"
          >
            Shop Sale
          </Button>
        </div>
        <div className="">
          <Image
            src="/images/veg2.png"
            height={100}
            width={700}
            className="md:w-full w-52 h-[250px] object-contain"
            alt="Veggies"
          />
        </div>
      </MiddleCard>
      <MiddleCard className="bg-green-100">
        <h3 className="text-base sm:text-xl lg:text-2xl font-bold max-w-[185px] sm:max-w-68 md:max-w-[255px]">
          Everyday{" "}
          <span className="bg-black text-white px-2 rounded-lg">fresh</span> &{" "}
          <span className="bg-black text-white px-2 rounded-lg">clean</span>{" "}
          with our products
        </h3>
        <div className="">
          <Image
            src="/images/fruits.png"
            height={100}
            width={700}
            className="md:w-full w-52 h-[250px] object-contain"
            alt="Veggies"
          />
        </div>
      </MiddleCard>
    </div>
  )
}

export default MiddleCardAds
