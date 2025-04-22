"use client"

import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
const ViewAll = () => {
  const router = useRouter()
  return (
    <div
      onClick={() => router.push("/products")}
      className="flex justify-center mt-7"
    >
      {/* <Button className="bg-[#004729] hover:bg-[#004729d4]">
        View All Products
      </Button> */}
      <button className="text-emerald-600 text-base md:text-lg hover:text-emerald-700 font-medium transition-colors">
        View All Products
      </button>
    </div>
  )
}

export default ViewAll
