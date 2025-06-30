"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import React from "react"

const DeliveryCard = () => {
  const router = useRouter()

  return (
    <div className="w-full sm:px-6 md:px-8 max-w-7xl mx-auto">
      <div className="relative h-auto min-h-[200px] sm:min-h-[250px] md:h-64 md:px-8 lg:h-80 flex flex-col md:flex-row items-center bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl overflow-hidden shadow-sm border border-emerald-100">
        {/* Image */}
        <div className="w-full md:w-1/2 h-48 sm:h-56 md:h-full relative">
          <Image
            src="/images/delivery.png"
            fill
            alt="Friendly delivery person with package"
            className="object-contain object-bottom md:object-left-bottom"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Content */}
        <div className="w-full md:w-2/3 lg:w-2/3 p-4 sm:p-6 md:p-8 flex flex-col justify-center">
          <div className="text-center md:text-left lg:text-right space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-5xl font-bold text-green-800 leading-tight">
              Fast & Reliable Delivery
            </h2>

            <div className="flex flex-col sm:flex-row justify-center md:justify-end items-center gap-2">
              <div className="bg-white/90 rounded-lg px-4 py-2 shadow-xs flex flex-wrap items-center gap-2">
                <span className="text-sm sm:text-base md:text-sm font-medium text-green-700">
                  Delivery Days:
                </span>
                <span className="font-bold text-sm text-green-600">
                  Wed & Sat
                </span>
                <span className="hidden sm:block w-1 h-1 bg-green-400 rounded-full"></span>
                <span className="text-sm sm:text-base md:text-sm font-medium text-green-700">
                  10AM - 8PM
                </span>
              </div>
            </div>

            <p className="text-sm lg:text-base text-green-600/90 font-medium max-w-prose mx-auto md:ml-auto md:mr-0">
              Fresh deliveries straight to your doorstep by our professional
              team
            </p>

            <div className="flex flex-col sm:flex-row justify-center md:justify-end gap-3 pt-2">
              <button
                onClick={() => router.push("/account/order-history")}
                className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg px-5 py-2.5  text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Track Order</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              <button className="border border-green-600 text-green-700 hover:bg-green-50 font-medium rounded-lg px-5 py-2.5 text-sm transition-all">
                Learn more
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="hidden md:block absolute -right-10 -top-10 w-40 h-40 rounded-full bg-green-200/20"></div>
        <div className="hidden md:block absolute -right-5 -bottom-5 w-24 h-24 rounded-full bg-green-300/30"></div>
      </div>
    </div>
  )
}

export default DeliveryCard
