// "use client"
// import React, { useState, useEffect, useRef } from "react"
// import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid"
// import { Product } from "@/types"
// import Link from "next/link"
// import { useDebounce } from "@/hooks/useDebounce"

// // Simple cache implementation
// const searchCache = new Map<string, Product[]>()

// const Searchbar = ({ onClose }: { onClose?: () => void }) => {
//   const [searchQuery, setSearchQuery] = useState("")
//   const [productSuggestions, setProductSuggestions] = useState<Product[]>([])
//   const [loading, setLoading] = useState(false)
//   const [showDropdown, setShowDropdown] = useState(false)
//   const dropdownRef = useRef<HTMLDivElement>(null)
//   const inputRef = useRef<HTMLInputElement>(null)

//   // Reduced debounce time for faster response
//   const debouncedQuery = useDebounce(searchQuery, 150)

//   // Focus input when component mounts (for mobile)
//   useEffect(() => {
//     if (onClose && inputRef.current) {
//       inputRef.current.focus()
//     }
//   }, [onClose])

//   useEffect(() => {
//     const fetchProductSuggestions = async () => {
//       if (!debouncedQuery.trim()) {
//         setProductSuggestions([])
//         setShowDropdown(false)
//         return
//       }

//       // Check cache first
//       if (searchCache.has(debouncedQuery)) {
//         setProductSuggestions(searchCache.get(debouncedQuery)!)
//         setShowDropdown(true)
//         return
//       }

//       setLoading(true)
//       try {
//         const response = await fetch(
//           `/api/products?query=${encodeURIComponent(debouncedQuery)}`
//         )
//         if (response.ok) {
//           const data = await response.json()
//           // Cache the results
//           searchCache.set(debouncedQuery, data.products)
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
//     if (onClose) {
//       onClose()
//     }
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (searchQuery.trim()) {
//       // Handle search submission
//       setShowDropdown(false)
//       if (onClose) {
//         onClose()
//       }
//     }
//   }

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setShowDropdown(false)
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside)
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [])

//   return (
//     <div className="relative w-full" ref={dropdownRef}>
//       <form onSubmit={handleSubmit}>
//         <div className="relative flex items-center w-full">
//           <input
//             ref={inputRef}
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             onFocus={() => searchQuery.trim() && setShowDropdown(true)}
//             placeholder="Search products..."
//             className="w-full pl-4 pr-10 py-2 bg-white border border-gray-300 rounded-full text-sm focus:ring-0 outline-none "
//             aria-label="Search products"
//           />
//           {searchQuery ? (
//             <button
//               type="button"
//               onClick={handleClear}
//               className="absolute right-8 p-1 text-gray-400 hover:text-gray-600"
//               aria-label="Clear search"
//             >
//               <XMarkIcon className="h-4 w-4" />
//             </button>
//           ) : null}
//           <button
//             type="submit"
//             className="absolute right-1 p-1.5 text-sowgren_Color hover:text-primary/90 transition-colors"
//             aria-label="Submit search"
//           >
//             <MagnifyingGlassIcon className="h-4 w-4" />
//           </button>
//         </div>
//       </form>

//       {showDropdown && (
//         <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
//           {loading ? (
//             <div className="p-4 space-y-3">
//               {[...Array(3)].map((_, i) => (
//                 <div
//                   key={i}
//                   className="h-12 bg-gray-100 rounded animate-pulse"
//                 ></div>
//               ))}
//             </div>
//           ) : productSuggestions.length > 0 ? (
//             <ul>
//               {productSuggestions.slice(0, 5).map((product) => (
//                 <li key={product.id}>
//                   <Link
//                     href={`/products/${product.slug}`}
//                     className="flex items-center p-3 hover:bg-gray-50 transition-colors"
//                     prefetch={false}
//                     onClick={() => {
//                       setShowDropdown(false)
//                       onClose?.()
//                     }}
//                   >
//                     <div className="flex-grow">
//                       <p className="text-base font-medium text-gray-900 line-clamp-1">
//                         {product.title}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         {product.categoryName}
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
          // ✨ FIX: The response is the array directly, not an object.
          const products = await response.json()
          // Cache the results
          searchCache.set(debouncedQuery, products)
          setProductSuggestions(products)
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
            className="w-full pl-4 pr-10 py-2 bg-white border border-gray-300 rounded-full text-sm focus:ring-0 outline-none "
            aria-label="Search products"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-8 p-1 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          ) : null}
          <button
            type="submit"
            className="absolute right-1 p-1.5 text-sowgren_Color hover:text-primary/90 transition-colors"
            aria-label="Submit search"
          >
            <MagnifyingGlassIcon className="h-4 w-4" />
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
                    href={`/products/${product.slug}`}
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
