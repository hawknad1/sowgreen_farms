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
import { Search, X } from "lucide-react"
import Image from "next/image"

// Simple cache implementation
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
//           // ✨ FIX: The response is the array directly, not an object.
//           const products = await response.json()
//           // Cache the results
//           searchCache.set(debouncedQuery, products)
//           setProductSuggestions(products)
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

// Simple debounce hook
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

const searchCache = new Map<string, Product[]>()

// Helper function to calculate search relevance score
const getRelevanceScore = (product: Product, query: string): number => {
  const title = product.title.toLowerCase()
  const searchTerm = query.toLowerCase().trim()

  // Exact match gets highest score
  if (title === searchTerm) return 1000

  // Starts with query gets high score
  if (title.startsWith(searchTerm)) return 500

  // Word boundary match (e.g., "pine" matches "fresh pine")
  const words = title.split(/\s+/)
  if (words.some((word) => word === searchTerm)) return 400
  if (words.some((word) => word.startsWith(searchTerm))) return 300

  // Contains query gets lower score
  if (title.includes(searchTerm)) return 100

  return 0
}

// Sort products by relevance
const sortByRelevance = (products: Product[], query: string): Product[] => {
  return [...products].sort((a, b) => {
    const scoreA = getRelevanceScore(a, query)
    const scoreB = getRelevanceScore(b, query)
    return scoreB - scoreA
  })
}

// Highlight matching text
const HighlightMatch = ({ text, query }: { text: string; query: string }) => {
  if (!query.trim()) return <>{text}</>

  const regex = new RegExp(
    `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  )
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="font-semibold text-green-600">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

const Searchbar = ({ onClose }: { onClose?: () => void }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [productSuggestions, setProductSuggestions] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const debouncedQuery = useDebounce(searchQuery, 150)

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
        const cachedProducts = searchCache.get(debouncedQuery)!
        const sortedProducts = sortByRelevance(cachedProducts, debouncedQuery)
        setProductSuggestions(sortedProducts)
        setShowDropdown(true)
        return
      }

      setLoading(true)
      try {
        const response = await fetch(
          `/api/products?query=${encodeURIComponent(debouncedQuery)}`
        )
        if (response.ok) {
          const products = await response.json()

          // Sort by relevance before caching and displaying
          const sortedProducts = sortByRelevance(products, debouncedQuery)

          searchCache.set(debouncedQuery, products)
          setProductSuggestions(sortedProducts)
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

  const handleSubmit = () => {
    if (searchQuery.trim()) {
      setShowDropdown(false)
      if (onClose) {
        onClose()
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit()
    }
  }

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
      <div className="relative flex items-center w-full">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => searchQuery.trim() && setShowDropdown(true)}
          placeholder="Search products..."
          className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-300 rounded-full text-sm focus:border-green-600 focus:ring-2 focus:ring-green-600 focus:ring-opacity-20 outline-none transition-all"
          aria-label="Search products"
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-9 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
        <button
          type="button"
          onClick={handleSubmit}
          className="absolute right-2 p-1.5 text-green-600 hover:text-green-700 transition-colors"
          aria-label="Submit search"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>

      {showDropdown && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-96 overflow-hidden">
          {loading ? (
            <div className="p-3 space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : productSuggestions.length > 0 ? (
            <div className="overflow-y-auto max-h-96">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b border-gray-100">
                {productSuggestions.length}{" "}
                {productSuggestions.length === 1 ? "result" : "results"} found
              </div>
              <ul className="divide-y divide-gray-100">
                {productSuggestions.slice(0, 8).map((product) => {
                  const isExactMatch =
                    product.title.toLowerCase() ===
                    debouncedQuery.toLowerCase().trim()

                  return (
                    <li key={product.id}>
                      <button
                        onClick={() => {
                          setShowDropdown(false)
                          onClose?.()
                          window.location.href = `/products/${product.slug}`
                        }}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors group text-left"
                      >
                        {product.images && (
                          <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                              src={product.images[0]?.url}
                              height={25}
                              width={25}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-green-600 transition-colors">
                              <HighlightMatch
                                text={product.title}
                                query={debouncedQuery}
                              />
                            </p>
                            {/* {isExactMatch && (
                              <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                                Exact match
                              </span>
                            )} */}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {product.categoryName}
                          </p>
                        </div>
                        <Search className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors flex-shrink-0" />
                      </button>
                    </li>
                  )
                })}
              </ul>
              {productSuggestions.length > 8 && (
                <div className="px-3 py-2 text-xs text-center text-gray-500 bg-gray-50 border-t border-gray-100">
                  +{productSuggestions.length - 8} more results
                </div>
              )}
            </div>
          ) : debouncedQuery ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                No products found
              </p>
              <p className="text-xs text-gray-500">
                Try searching with different keywords
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default Searchbar
