import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Order, Product, ProductOrder } from "@/types"
import { Input } from "@/components/ui/input"
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid"
import Image from "next/image"

interface EditOrderProps {
  orders: Order
}

const EditOrder = ({ orders }: EditOrderProps) => {
  const [orderItems, setOrderItems] = useState<ProductOrder[]>(
    orders.products || []
  )
  const [productSuggestions, setProductSuggestions] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

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
      const existingItem = orderItems.find(
        (item) => item.productId === selectedProduct.id
      )
      if (existingItem) {
        alert("Product already exists in the order.")
        return
      }

      setOrderItems((prev) => [
        ...prev,
        {
          id: `${selectedProduct.id}-${Date.now()}`,
          productId: selectedProduct.id,
          orderId: orders.id,
          quantity: 1,
          quantityTotal: (selectedProduct.price * 1).toString(), // Convert to string
          product: selectedProduct,
          order: orders,
        },
      ])

      setSelectedProduct(null)
      setSearchQuery("")
    }
  }

  const handleQuantityChange = (productId: string, quantity: number) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity,
              quantityTotal: (item.product.price * quantity).toString(), // Convert to string
            }
          : item
      )
    )
  }

  const handleRemoveItem = (productId: string) => {
    setOrderItems((prev) => prev.filter((item) => item.productId !== productId))
  }

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`/api/orders/${orders.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: orderItems }),
      })

      if (response.ok) {
        alert("Order updated successfully")
      } else {
        throw new Error("Failed to update order")
      }
    } catch (error) {
      console.error(error)
      alert("An error occurred while updating the order.")
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Edit Order Items</h3>
      <div>
        {orderItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b py-2"
          >
            <div className="flex gap-x-3">
              <Image
                src={item?.product?.imageUrl}
                alt={item?.product?.title}
                height={20}
                width={20}
                className="object-contain h-6 w-6"
              />
              <p className="font-medium">{item?.product?.title}</p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  handleQuantityChange(item.productId, Number(e.target.value))
                }
                className="w-16"
              />
              <Button
                variant="destructive"
                onClick={() => handleRemoveItem(item.productId)}
              >
                <TrashIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
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
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedProduct(product)
                    setSearchQuery(product.title)
                    setProductSuggestions([])
                  }}
                >
                  {product.title}
                </li>
              ))}
            </ul>
          )}
        </div>
        <Button
          onClick={handleAddItem}
          className="mt-2 flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Add Product
        </Button>
      </div>
      <Button onClick={handleSaveChanges} className="mt-4">
        Save Changes
      </Button>
    </div>
  )
}

export default EditOrder
