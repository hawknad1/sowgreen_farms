"use client"
import React, { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid"

const Searchbar = () => {
  const router = useRouter()
  const [search, setSearch] = useState("")

  // const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()

  //   const formData = new FormData(e.currentTarget)
  //   const name = formData.get("search") as string

  //   if (name) {
  //     router.push(`/products?name=${name}`)
  //   }
  // }
  console.log(search)

  return (
    <form
      className="flex relative bg-gray-100 rounded-full p-2 pl-3 flex-1 px-2 lg:px-4"
      // onSubmit={handleSearch}
    >
      <input
        type="text"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="search products"
        className="flex-1 bg-transparent outline-none text-sm lg:text-base"
      />
      <div className="bg-green-600 p-2 rounded-full absolute right-0.5 bottom-0">
        <MagnifyingGlassIcon className="lg:h-6 lg:w-6 h-5 w-5 cursor-pointer text-white" />
      </div>
    </form>
  )
}

export default Searchbar
