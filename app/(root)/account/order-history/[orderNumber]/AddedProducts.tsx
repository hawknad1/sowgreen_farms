"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Order, ProductOrder } from "@/types"
import Image from "next/image"
import { TrashIcon } from "@heroicons/react/24/solid"
import { formatCurrency } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface EditOrderProps {
  orders: Order
  setOrderItems: React.Dispatch<React.SetStateAction<ProductOrder[]>>
}

const AddedProducts = ({ orders, setOrderItems }: EditOrderProps) => {
  const [subtotal, setSubtotal] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const newSubtotal = orders.products.reduce((sum, item) => {
      return sum + item.price * item.quantity
    }, 0)
    setSubtotal(parseFloat(newSubtotal.toFixed(2)))
    setTotal(parseFloat((newSubtotal + orders.deliveryFee).toFixed(2)))
  }, [orders.products, orders.deliveryFee])

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity < 1) return
    setOrderItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity,
              quantityTotal: (item.price * quantity).toFixed(2),
            }
          : item
      )
    )
  }

  const handleRemoveItem = (productOrderId: string) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== productOrderId))
  }

  const handleVariantChange = (
    productId: string,
    selectedVariant: { price: number; weight: number; unit: string }
  ) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? {
              ...item,
              price: selectedVariant.price,
              weight: selectedVariant.weight,
              unit: selectedVariant.unit,
            }
          : item
      )
    )
  }

  return (
    <div className="flex flex-col justify-between max-h-[350px]">
      <div className="h-[250px] overflow-y-scroll">
        {[...orders.products].reverse().map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b py-2"
          >
            <div className="flex gap-x-3 items-center">
              <Image
                src={
                  item.product.imageUrl ||
                  item.product.images?.[0]?.url ||
                  "/placeholder-image.png"
                }
                alt={item.product.title || "Product Image"}
                height={40}
                width={40}
                className="object-contain h-16 w-16 bg-gray-100 p-1 rounded-md"
              />
              <div>
                <p className="font-semibold text-base text-black">
                  {item.product.title || "Untitled Product"}
                </p>
                <div className="flex items-center gap-x-2">
                  {item.product.variants && item.product.variants.length > 1 ? (
                    <Select
                      onValueChange={(value) => {
                        const selectedVariant = item.product.variants.find(
                          (variant) =>
                            variant?.weight?.toString() === value ||
                            (variant?.weight === null &&
                              variant?.price?.toString() === value)
                        )
                        if (selectedVariant) {
                          handleVariantChange(item.productId, selectedVariant)
                        }
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Weight" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Price/Weight</SelectLabel>
                          {item.product.variants.map((variant, index) => (
                            <SelectItem
                              key={index}
                              value={
                                variant?.weight?.toString() ||
                                (variant?.weight === null &&
                                  variant?.price?.toString())
                              }
                            >
                              {formatCurrency(variant.price, "GHS")}
                              {variant?.weight === 0 ||
                              variant?.weight === null ? (
                                ""
                              ) : (
                                <span className="text-sm text-neutral-400">{`/ ${
                                  variant?.weight < 1
                                    ? variant?.weight * 1000
                                    : variant?.weight
                                }${variant?.unit}`}</span>
                              )}{" "}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  ) : item.product.variants &&
                    item.product.variants.length === 1 ? (
                    <p className="text-sm text-neutral-600">
                      {`${formatCurrency(item.price, "GHS")} `}
                    </p>
                  ) : (
                    <p className="text-sm">
                      {formatCurrency(item?.price, "GHS")}{" "}
                      {item?.weight === 0 || item?.weight === null ? (
                        ""
                      ) : (
                        <span className="text-sm text-neutral-400">{`/ ${
                          item?.weight < 1 ? item?.weight * 1000 : item?.weight
                        }${item?.unit}`}</span>
                      )}{" "}
                    </p>
                  )}
                </div>
              </div>
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
              <p className="text-sm">
                <span>Subtotal</span> <br />
                <span>{formatCurrency(item.price * item.quantity, "GHS")}</span>
              </p>
              <Button
                variant="destructive"
                onClick={() => handleRemoveItem(item.id)}
                className="w-fit py-0 px-3"
              >
                <TrashIcon className="md:h-5 md:w-5 w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AddedProducts
