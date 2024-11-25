import { Product } from "@/types"
import React, { useEffect, useState } from "react"

const ProductSuggestions = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [productSuggestions, setProductSuggestions] = useState<Product[]>([])

  // Fetch product suggestions
  useEffect(() => {
    const fetchProductSuggestions = async () => {
      if (searchQuery.trim().length === 0) {
        setProductSuggestions([])
        return
      }
      try {
        const response = await fetch(`/api/products?query=${searchQuery}`)
        if (response.ok) {
          const data = await response.json()
          setProductSuggestions(data.products)
        } else {
          console.error("Failed to fetch product suggestions")
        }
      } catch (error) {
        console.error("Error fetching product suggestions:", error)
      }
    }

    fetchProductSuggestions()
  }, [searchQuery])

  return <div>ProductSuggestions</div>
}

export default ProductSuggestions
