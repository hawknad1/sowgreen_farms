"use client"

import React, { useState, useEffect } from "react"
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid"
import { Product } from "@/types"
import Image from "next/image"
import SkeletonItems from "../skeletons/SkeletonItems"
import Link from "next/link"

const Searchbar = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [productSuggestions, setProductSuggestions] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  // Fetch product suggestions
  useEffect(() => {
    const fetchProductSuggestions = async () => {
      if (searchQuery.trim().length === 0) {
        setProductSuggestions([])
        setShowDropdown(false)
        return
      }
      setLoading(true)
      try {
        const response = await fetch(`/api/products?query=${searchQuery}`)
        if (response.ok) {
          const data = await response.json()
          setProductSuggestions(data.products)
          setShowDropdown(true) // Show dropdown when suggestions are available
        } else {
          console.error("Failed to fetch product suggestions")
        }
      } catch (error) {
        console.error("Error fetching product suggestions:", error)
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(() => {
      fetchProductSuggestions()
    }, 100) // Add debounce delay to reduce API calls

    return () => clearTimeout(debounce) // Cleanup debounce
  }, [searchQuery])

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Delay hiding the dropdown to allow link clicks to register
    setTimeout(() => setShowDropdown(false), 150)
  }

  return (
    <div className="relative flex-1">
      <form className="flex relative bg-gray-100 rounded-full p-2 pl-3 flex-1 px-2 lg:px-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.trim() && setShowDropdown(true)} // Show dropdown when focused and query exists
          onBlur={handleBlur}
          placeholder="Search products"
          className="flex-1 bg-transparent outline-none text-sm lg:text-base"
        />
        <div className="absolute inset-y-0 right-2 flex items-center cursor-pointer">
          <MagnifyingGlassIcon className="lg:h-6 lg:w-6 h-5 w-5 text-gray-600" />
        </div>
      </form>

      {showDropdown && (
        <div
          className="absolute z-10 w-full bg-white border rounded-md shadow-lg max-h-fit scrollbar-hide overflow-y-auto mt-2"
          onMouseDown={(e) => e.preventDefault()} // Prevent blur on clicking suggestions
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <SkeletonItems key={index} />
            ))
          ) : productSuggestions.length > 0 ? (
            productSuggestions.slice(0, 4).map((product) => (
              <Link
                key={product.id}
                className="flex items-center space-x-4 p-1.5 rounded-md transition-colors cursor-pointer hover:bg-accent hover:text-accent-foreground"
                href={`/products/${product.id}`}
              >
                <div className="flex-shrink-0 h-12 w-12 md:h-14 md:w-14 bg-gray-200 rounded-md overflow-hidden">
                  <Image
                    src={product.images[0]?.url}
                    alt={product.title}
                    width={45}
                    height={45}
                    className="h-full w-full object-contain p-1"
                  />
                </div>
                <p className="text-sm md:text-base ">{product.title}</p>
              </Link>
            ))
          ) : (
            <div className="px-4 py-2 text-center">No products found</div>
          )}
        </div>
      )}
    </div>
  )
}

export default Searchbar
