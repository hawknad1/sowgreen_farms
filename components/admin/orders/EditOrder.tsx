import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Order, ProductOrder } from "@/types"
import { Input } from "@/components/ui/input"
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid"
import Image from "next/image"
import SearchProduct from "./SearchProduct"
import { toast } from "react-hot-toast"

interface EditOrderProps {
  orders: Order
}

const EditOrder = ({ orders }: EditOrderProps) => {
  const [orderItems, setOrderItems] = useState<ProductOrder[]>(
    orders.products || []
  )
  const [subtotal, setSubtotal] = useState(0)
  const [total, setTotal] = useState(0)
  const [isSaving, setIsSaving] = useState(false) // Disable button while saving

  useEffect(() => {
    const newSubtotal = orders.products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    setSubtotal(parseFloat(newSubtotal.toFixed(2)))
    setTotal(newSubtotal)
    // setTotal(parseFloat((newSubtotal + orders.deliveryFee).toFixed(2)))
  }, [orders.products, orders.deliveryFee])

  // const handleQuantityChange = (productId: string, quantity: number) => {
  //   setOrderItems((prev) =>
  //     prev.map((item) =>
  //       item.productId === productId
  //         ? {
  //             ...item,
  //             quantity,
  //             quantityTotal: (item.product.price * quantity).toString(),
  //           }
  //         : item
  //     )
  //   )
  // }

  const handleQuantityChange = (productId: string, quantity: number) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    )
  }

  const handleToggleOutOfStock = (productId: string) => {
    setOrderItems((prevOrderItems) =>
      prevOrderItems.map((item) =>
        item.productId === productId
          ? {
              ...item,
              available: !item.available,
              quantityTotal: !item.available
                ? (item.product.variants[0]?.price * item.quantity).toString()
                : "0",
            }
          : item
      )
    )
  }

  const handleRemoveItem = (productOrderId: string) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== productOrderId))
  }

  const handleAddProduct = (newProductOrder: ProductOrder) => {
    if (
      orderItems.some((item) => item.productId === newProductOrder.productId)
    ) {
      toast.error("Product already exists in the order!")
      return
    }
    setOrderItems((prev) => [...prev, newProductOrder])
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/orders/${orders.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: orderItems.map((item) => ({
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            quantityTotal: item.quantityTotal,
            available: item.available,
          })),
          subtotal,
          total,
          deliveryFee: orders.deliveryFee,
        }),
      })

      if (response.ok) {
        toast.success("Order updated successfully!")
        window.location.reload()
      } else {
        const { message } = await response.json()
        toast.error(`Failed to update order: ${message}`)
      }
    } catch (error) {
      toast.error("An error occurred while updating the order!")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-1">
      <h3 className="text-lg font-semibold">Edit Order Items</h3>
      <div className="max-h-[220px] overflow-scroll scrollbar-hide">
        {orderItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b py-2"
          >
            <div className="flex gap-x-3 items-center">
              <Image
                src={item?.product?.images[0]?.url}
                alt={item?.product?.title}
                height={20}
                width={20}
                className="object-contain h-6 w-6"
              />
              <p
                className={`font-medium line-clamp-1 ${
                  item.available === false ? "line-through text-red-500" : ""
                }`}
              >
                {item?.product?.title}
              </p>
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
                disabled={item.available === false}
              />
              <Button
                onClick={() => handleToggleOutOfStock(item.productId)}
                variant={item.available === false ? "outline" : "secondary"}
              >
                {item.available === false ? "In Stock" : "Out of Stock"}
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleRemoveItem(item.id)}
              >
                <TrashIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <SearchProduct orders={orders} onAddProduct={handleAddProduct} />
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm font-semibold">Subtotal: {subtotal}</p>
        <p className="text-sm font-semibold">
          Delivery Fee: {orders.deliveryFee}
        </p>
        <p className="text-lg font-bold">Total: {total}</p>
      </div>
      <Button
        onClick={handleSaveChanges}
        className="mt-4 w-full"
        disabled={isSaving}
      >
        {isSaving ? (
          <span className="loading loading-spinner loading-md"></span>
        ) : (
          "Update order"
        )}
      </Button>
    </div>
  )
}

export default EditOrder
