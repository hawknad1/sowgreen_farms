"use client"
import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Product } from "@/types"

const CategoryCard = ({ data }: { data: Product }) => {
  return (
    <Link
      href={{
        pathname: "/category",
        query: { q: data?.categoryName },
      }}
    >
      <div className="flex gap-4 w-max">
        <div className="flex flex-col md:flex gap-2">
          <div className="w-28 h-28 bg-[#F1EEDC] flex justify-center items-center rounded-lg shadow-sm">
            <Image
              src={data?.imageUrl}
              alt="image"
              width={100}
              height={100}
              className="object-contain h-24 w-24 flex"
            />
          </div>
          <p className="text-xs tracking-wide font-semibold text-sowgren_Color">
            {data?.categoryName}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default CategoryCard
