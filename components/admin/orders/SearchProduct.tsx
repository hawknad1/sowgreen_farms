import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Order, Product, ProductOrder } from "@/types"
import { PlusIcon } from "lucide-react"
import Image from "next/image"
import React, { useEffect, useState } from "react"

interface SearchOrdersProp {
  orders: Order
  onAddProduct: (newProductOrder: ProductOrder) => void
}

const SearchProduct = ({ orders, onAddProduct }: SearchOrdersProp) => {
  const [productSuggestions, setProductSuggestions] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

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

  const handleAddItem = () => {
    if (selectedProduct) {
      const newProductOrder: ProductOrder = {
        id: `${selectedProduct.id}-${Date.now()}`,
        productId: selectedProduct.id,
        orderId: orders.id,
        quantity: 1,
        quantityTotal: (selectedProduct.price * 1).toString(),
        product: selectedProduct,
        order: orders,
      }

      onAddProduct(newProductOrder)
      console.log(newProductOrder, "new product")
      setSelectedProduct(null)
      setSearchQuery("")
    }
  }

  return (
    <div className="mt-4">
      <h4 className="text-md font-semibold">Add New Product</h4>
      <div className="relative">
        <Input
          type="text"
          placeholder="Search for a product"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {productSuggestions?.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto">
            {productSuggestions.map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between gap-x-2 px-4 py-2  hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSelectedProduct(product)
                  setSearchQuery(product.title)
                  setProductSuggestions([])
                }}
              >
                <div className="flex items-center gap-x-3">
                  <Image
                    src={product?.imageUrl}
                    alt={product?.title}
                    width={25}
                    height={25}
                  />
                  <p>{product?.title}</p>
                  <p className="text-xs font-semibold text-neutral-500">{`${product?.weight} ${product?.unit}`}</p>
                </div>

                <p className="font-bold">{`GHS ${product?.price.toFixed(
                  2
                )}`}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Button onClick={handleAddItem} className="mt-2 flex items-center gap-2">
        <PlusIcon className="h-5 w-5" />
        Add Product
      </Button>
    </div>
  )
}

export default SearchProduct
