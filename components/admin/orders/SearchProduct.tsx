import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Order, Product, ProductOrder } from "@/types"
import { SquarePlusIcon } from "lucide-react"
import Image from "next/image"
import React, { useEffect, useState } from "react"

interface SearchOrdersProp {
  orders: Order
  onAddProduct?: (newProductOrder: ProductOrder) => void
}

const SearchProduct = ({ orders, onAddProduct }: SearchOrdersProp) => {
  const [productSuggestions, setProductSuggestions] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isProductSelected, setIsProductSelected] = useState(false)

  // Fetch product suggestions
  useEffect(() => {
    const fetchProductSuggestions = async () => {
      if (searchQuery.trim().length === 0 || isProductSelected) {
        setProductSuggestions([])
        return
      }
      try {
        const response = await fetch(`/api/products?query=${searchQuery}`)
        if (response.ok) {
          const data = await response.json()

          const products = data?.products as Product[]
          // setProductSuggestions(data.products)
          setProductSuggestions(
            products.filter((product) => product.isInStock !== "out-of-stock")
          )
        } else {
          console.error("Failed to fetch product suggestions")
        }
      } catch (error) {
        console.error("Error fetching product suggestions:", error)
      }
    }

    fetchProductSuggestions()
  }, [searchQuery, isProductSelected])

  const handleAddItem = () => {
    if (!selectedProduct) return

    const newProductOrder: ProductOrder = {
      id: `${selectedProduct.id}-${Date.now()}`,
      productId: selectedProduct.id,
      orderId: orders.id,
      quantity: 1, // Default quantity is 1
      price: selectedProduct.variants[0]?.price || 0,
      weight: selectedProduct.variants[0]?.weight || 0,
      unit: selectedProduct.variants[0]?.unit || "",
      quantityTotal: ((selectedProduct.variants[0]?.price || 0) * 1).toFixed(2), // Initial quantityTotal
      product: selectedProduct,
      available: true,
    }

    onAddProduct?.(newProductOrder)
    setSelectedProduct(null) // Reset selected product
    setSearchQuery("") // Clear search input
    setIsProductSelected(false) // Reset product selected state
  }

  return (
    <div className="mt-4">
      <div className="flex justify-between gap-x-2">
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Search for a product"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setIsProductSelected(false) // Reset product selected state when typing
            }}
            className="flex-1 w-full"
          />
          {productSuggestions?.length > 0 && (
            <div className="absolute z-10 w-full bg-white border rounded-md shadow-sm max-h-64 overflow-y-auto">
              {productSuggestions.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-x-2 px-4 py-2  hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedProduct(product)
                    setSearchQuery(product.title)
                    setProductSuggestions([])
                    setIsProductSelected(true) // Set product selected state
                  }}
                >
                  <div className="flex items-center gap-x-3">
                    <Image
                      src={product?.imageUrl || product?.images[0].url}
                      alt={product?.title}
                      width={35}
                      height={35}
                      className="h-16 w-16 object-contain bg-gray-100 p-1 rounded-md"
                    />

                    <div>
                      <p>{product?.title}</p>
                      <>
                        {product?.variants.length > 0 &&
                          product?.variants?.[0].weight && (
                            <p className="text-xs font-semibold text-neutral-500">{`${
                              product?.variants[0]?.weight < 1
                                ? product?.variants[0]?.weight * 1000
                                : product?.variants[0]?.weight
                            }${product?.variants[0]?.unit}`}</p>
                          )}
                      </>
                    </div>
                  </div>

                  <p className="font-bold">{`GHS ${product?.variants[0]?.price?.toFixed(
                    2
                  )}`}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <Button
          onClick={handleAddItem}
          className="mt-2 flex items-center gap-2"
        >
          <SquarePlusIcon className="h-5 w-5" />
          Add
        </Button>
      </div>
    </div>
  )
}

export default SearchProduct
