"use client"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import React, { useRef, useState } from "react"

interface ChevronProps {
  children: React.ReactNode
  message: string
}

const ProductChevrons = ({ children, message }: ChevronProps) => {
  const containerRef = useRef(null)

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -200, // Adjust the scroll amount as needed
        behavior: "smooth",
      })
    }
  }

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: 200, // Adjust the scroll amount as needed
        behavior: "smooth",
      })
    }
  }
  return (
    <div className="flex flex-col items-center gap-x-6">
      <div className="flex items-center justify-between w-full">
        <h2 className="text-xl flex items-center text-sowgren_Color self-center sm:text-2xl md:text-3xl font-bold mb-4">
          {message}
        </h2>
        <div className="flex items-center gap-x-5">
          <div
            className="bg-slate-100 p-1 rounded-full cursor-pointer "
            onClick={scrollLeft}
          >
            <ChevronLeftIcon className="w-5 h-5 text-sowgren_Color" />
          </div>
          <div
            className="bg-slate-100 p-1 rounded-full cursor-pointer"
            onClick={scrollRight}
          >
            <ChevronRightIcon className="w-5 h-5 text-sowgren_Color" />
          </div>
        </div>
      </div>

      <div
        className="flex overflow-x-auto gap-x-2 scrollbar-hide overflow-hidden w-full"
        ref={containerRef}
      >
        {children}
      </div>
    </div>
  )
}

export default ProductChevrons
