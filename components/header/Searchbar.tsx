// "use client"

// import React, { useState, useEffect } from "react"
// import { MagnifyingGlassIcon } from "@heroicons/react/20/solid"
// import { Product } from "@/types"
// import Image from "next/image"
// import SkeletonItems from "../skeletons/SkeletonItems"
// import Link from "next/link"

// const Searchbar = () => {
//   const [searchQuery, setSearchQuery] = useState("")
//   const [productSuggestions, setProductSuggestions] = useState<Product[]>([])
//   const [loading, setLoading] = useState(false)
//   const [showDropdown, setShowDropdown] = useState(false)

//   // Fetch product suggestions
//   useEffect(() => {
//     const fetchProductSuggestions = async () => {
//       if (searchQuery.trim().length === 0) {
//         setProductSuggestions([])
//         setShowDropdown(false)
//         return
//       }
//       setLoading(true)
//       try {
//         const response = await fetch(`/api/products?query=${searchQuery}`)
//         if (response.ok) {
//           const data = await response.json()
//           setProductSuggestions(data.products)
//           setShowDropdown(true) // Show dropdown when suggestions are available
//         } else {
//           console.error("Failed to fetch product suggestions")
//         }
//       } catch (error) {
//         console.error("Error fetching product suggestions:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     const debounce = setTimeout(() => {
//       fetchProductSuggestions()
//     }, 100) // Add debounce delay to reduce API calls

//     return () => clearTimeout(debounce) // Cleanup debounce
//   }, [searchQuery])

//   const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
//     // Delay hiding the dropdown to allow link clicks to register
//     setTimeout(() => setShowDropdown(false), 150)
//   }

//   return (
//     <div className="relative flex-1">
//       <form className="flex relative bg-gray-100 rounded-full p-2 pl-3 flex-1 px-2 lg:px-4">
//         <input
//           type="text"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           onFocus={() => searchQuery.trim() && setShowDropdown(true)} // Show dropdown when focused and query exists
//           onBlur={handleBlur}
//           placeholder="Search products"
//           className="flex-1 bg-transparent outline-none text-sm lg:text-base"
//         />
//         <div className="absolute inset-y-0 right-1 top-0.5 flex items-center cursor-pointer bg-sowgren_Color rounded-full w-fit p-1.5 h-fit">
//           <MagnifyingGlassIcon className="lg:h-6 lg:w-6 h-5 w-5 text-white" />
//         </div>
//       </form>

//       {showDropdown && (
//         <div
//           className="absolute z-10 w-full bg-white border rounded-md shadow-lg max-h-fit scrollbar-hide overflow-y-auto mt-2"
//           onMouseDown={(e) => e.preventDefault()} // Prevent blur on clicking suggestions
//         >
//           {loading ? (
//             Array.from({ length: 4 }).map((_, index) => (
//               <SkeletonItems key={index} />
//             ))
//           ) : productSuggestions.length > 0 ? (
//             productSuggestions.slice(0, 4).map((product) => (
//               <Link
//                 key={product.id}
//                 className="flex items-center space-x-4 p-1.5 rounded-md transition-colors cursor-pointer hover:bg-accent hover:text-accent-foreground"
//                 href={`/products/${product.id}`}
//               >
//                 <div className="flex-shrink-0 h-12 w-12 md:h-14 md:w-14 bg-gray-200 rounded-md overflow-hidden">
//                   <Image
//                     src={product.images[0]?.url}
//                     alt={product.title}
//                     width={45}
//                     height={45}
//                     className="h-full w-full object-contain p-1"
//                   />
//                 </div>
//                 <p className="text-sm md:text-base ">{product.title}</p>
//               </Link>
//             ))
//           ) : (
//             <div className="px-4 py-2 text-center">No products found</div>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }

// export default Searchbar

"use client"
import React, { useState, useEffect, useRef } from "react"
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid"
import { Product } from "@/types"
import Link from "next/link"
import { useDebounce } from "@/hooks/useDebounce"

// Simple cache implementation
const searchCache = new Map<string, Product[]>()

const Searchbar = ({ onClose }: { onClose?: () => void }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [productSuggestions, setProductSuggestions] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Reduced debounce time for faster response
  const debouncedQuery = useDebounce(searchQuery, 150)

  // Focus input when component mounts (for mobile)
  useEffect(() => {
    if (onClose && inputRef.current) {
      inputRef.current.focus()
    }
  }, [onClose])

  useEffect(() => {
    const fetchProductSuggestions = async () => {
      if (!debouncedQuery.trim()) {
        setProductSuggestions([])
        setShowDropdown(false)
        return
      }

      // Check cache first
      if (searchCache.has(debouncedQuery)) {
        setProductSuggestions(searchCache.get(debouncedQuery)!)
        setShowDropdown(true)
        return
      }

      setLoading(true)
      try {
        const response = await fetch(
          `/api/products?query=${encodeURIComponent(debouncedQuery)}`
        )
        if (response.ok) {
          const data = await response.json()
          // Cache the results
          searchCache.set(debouncedQuery, data.products)
          setProductSuggestions(data.products)
          setShowDropdown(true)
        }
      } catch (error) {
        console.error("Error fetching product suggestions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProductSuggestions()
  }, [debouncedQuery])

  const handleClear = () => {
    setSearchQuery("")
    setShowDropdown(false)
    if (onClose) {
      onClose()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Handle search submission
      setShowDropdown(false)
      if (onClose) {
        onClose()
      }
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center w-full">
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim() && setShowDropdown(true)}
            placeholder="Search products..."
            className="w-full pl-5 pr-12 py-3 bg-white border border-gray-300 rounded-full text-base"
            aria-label="Search products"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-12 p-1.5 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          ) : null}
          <button
            type="submit"
            className="absolute right-2 p-2 bg-sowgren_Color rounded-full text-white hover:bg-primary/90 transition-colors"
            aria-label="Submit search"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
        </div>
      </form>

      {showDropdown && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-gray-100 rounded animate-pulse"
                ></div>
              ))}
            </div>
          ) : productSuggestions.length > 0 ? (
            <ul>
              {productSuggestions.slice(0, 5).map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/products/${product.id}`}
                    className="flex items-center p-3 hover:bg-gray-50 transition-colors"
                    prefetch={false}
                    onClick={() => {
                      setShowDropdown(false)
                      onClose?.()
                    }}
                  >
                    <div className="flex-grow">
                      <p className="text-base font-medium text-gray-900 line-clamp-1">
                        {product.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {product.categoryName}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : debouncedQuery ? (
            <div className="p-4 text-center text-gray-500 text-base">
              No products found
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default Searchbar

// "use client"
// import React, { useState, useEffect } from "react"
// import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid"
// import { Product } from "@/types"
// import Image from "next/image"
// import SkeletonItems from "../skeletons/SkeletonItems"
// import Link from "next/link"
// import { useDebounce } from "@/hooks/useDebounce"

// const Searchbar = () => {
//   const [searchQuery, setSearchQuery] = useState("")
//   const [productSuggestions, setProductSuggestions] = useState<Product[]>([])
//   const [loading, setLoading] = useState(false)
//   const [showDropdown, setShowDropdown] = useState(false)
//   const debouncedQuery = useDebounce(searchQuery, 300)

//   useEffect(() => {
//     const fetchProductSuggestions = async () => {
//       if (!debouncedQuery.trim()) {
//         setProductSuggestions([])
//         setShowDropdown(false)
//         return
//       }

//       setLoading(true)
//       try {
//         const response = await fetch(
//           `/api/products?query=${encodeURIComponent(debouncedQuery)}`
//         )
//         if (response.ok) {
//           const data = await response.json()
//           setProductSuggestions(data.products)
//           setShowDropdown(true)
//         }
//       } catch (error) {
//         console.error("Error fetching product suggestions:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchProductSuggestions()
//   }, [debouncedQuery])

//   const handleClear = () => {
//     setSearchQuery("")
//     setShowDropdown(false)
//   }

//   return (
//     <div className="relative w-full">
//       <div className="relative items-center hidden md:flex md:w-[350px]">
//         <input
//           type="text"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           onFocus={() => searchQuery.trim() && setShowDropdown(true)}
//           onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
//           placeholder="Search products..."
//           className="w-full pl-5 pr-12 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent text-base" // Larger padding and text
//           aria-label="Search products"
//         />
//         {searchQuery ? (
//           <button
//             onClick={handleClear}
//             className="absolute right-12 p-1.5 text-gray-400 hover:text-gray-600"
//             aria-label="Clear search"
//           >
//             <XMarkIcon className="h-5 w-5" /> {/* Larger icon */}
//           </button>
//         ) : null}
//         <button
//           type="submit"
//           className="absolute right-2 p-2 bg-primary rounded-full text-white hover:bg-primary/90 transition-colors"
//           aria-label="Submit search"
//         >
//           <MagnifyingGlassIcon className="h-5 w-5" /> {/* Larger icon */}
//         </button>
//       </div>

//       {showDropdown && (
//         <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
//           {loading ? (
//             <div className="p-4">
//               {Array.from({ length: 3 }).map((_, i) => (
//                 <SkeletonItems key={i} />
//               ))}
//             </div>
//           ) : productSuggestions.length > 0 ? (
//             <ul>
//               {productSuggestions.slice(0, 5).map((product) => (
//                 <li key={product.id}>
//                   <Link
//                     href={`/products/${product.id}`}
//                     className="flex items-center p-4 hover:bg-gray-50 transition-colors"
//                   >
//                     <div className="flex-shrink-0 h-14 w-14 bg-gray-100 rounded-md overflow-hidden mr-4">
//                       {" "}
//                       {/* Larger thumbnail */}
//                       <Image
//                         src={
//                           product.images[0]?.url || "/placeholder-product.jpg"
//                         }
//                         alt={product.title}
//                         width={40}
//                         height={40}
//                         className="h-full w-full object-cover"
//                       />
//                     </div>
//                     <div>
//                       <p className="text-base font-medium text-gray-900">
//                         {product.title}
//                       </p>
//                     </div>
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           ) : debouncedQuery ? (
//             <div className="p-4 text-center text-gray-500 text-base">
//               No products found
//             </div>
//           ) : null}
//         </div>
//       )}
//     </div>
//   )
// }

// export default Searchbar
