import Image from "next/image"
import React from "react"

const DeliveryCard = () => {
  return (
    <div className="">
      <div className="relative h-36 lg:h-60 flex items-center justify-between bg-emerald-500/15 rounded-xl">
        <div className="absolute lg:top-6 lg:left-20 left-3 -bottom-4 sm:left-6 sm:-bottom-6">
          <Image
            src="/images/delivery.png"
            width={100}
            height={100}
            alt="Delivery Man"
            className="lg:h-64 lg:w-64 h-36 w-36 sm:w-40 sm:h-40"
          />
        </div>
        <div className="absolute max-w-lg right-0 sm:right-16 lg:max-w-3xl lg:right-16 flex items-center">
          <div className="w-full flex flex-col">
            <h2 className="lg:text-5xl max-w-[250px] sm:max-w-[300px] lg:max-w-3xl text-base sm:text-xl font-semibold text-emerald-500 leading-normal tracking-wide">
              We only deliver on Wednesdays & Saturdays
            </h2>
            <p className="text-neutral-500/60 font-medium tracking-wide text-base lg:text-xl ml-2">
              from 10am to 8pm
            </p>
          </div>
          <button className="border hidden md:inline-flex border-emerald-500 text-emerald-600 hover:underline rounded-tr-xl rounded-bl-xl text-sm lg:text-base w-36 lg:py-3 px-5 py-2.5  lg:px-5.5">
            Learn more
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeliveryCard
