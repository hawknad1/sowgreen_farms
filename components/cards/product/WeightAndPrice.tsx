"use client"

import React, { useState, useEffect } from "react"
import { Product } from "@/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useVariantStore } from "@/store"

interface WeightAndPriceProps {
  product: Product
  onVariantChange: (price: number, weight: number) => void
}

const WeightAndPrice = ({ product }: WeightAndPriceProps) => {
  const { variants } = product

  const { setSelectedVariant } = useVariantStore()

  const handleVariantChange = (value: string) => {
    const selectedIndex = Number(value)
    const selectedVariant = variants[selectedIndex]
    if (selectedVariant) {
      setSelectedVariant(
        selectedVariant.price,
        selectedVariant.weight,
        selectedVariant.unit
      ) // Update Zustand store
    }
  }

  // Set the default variant (first variant) in Zustand on initial render.
  useEffect(() => {
    if (variants && variants.length > 0) {
      setSelectedVariant(
        variants[0].price,
        variants[0].weight,
        variants[0].unit
      )
    }
  }, [variants, setSelectedVariant])

  // Return early if no variants exist.
  if (!variants || variants.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Show dropdown if there are multiple variants */}
      <div className="flex items-center gap-x-3">
        <p className="font-bold">Weight</p>
        {variants.length > 1 ? (
          <Select
            onValueChange={handleVariantChange}
            // defaultValue={`${selectedVariantIndex}`}
          >
            <SelectTrigger className="max-w-[150px] border-gray-300 ">
              <SelectValue placeholder="Select Weight" />
            </SelectTrigger>
            <SelectContent>
              {variants.map((variant, index) => (
                <SelectItem key={index} value={`${index}`}>
                  {`${variant.weight}${variant.unit}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          // Display the default price and weight if there's only one variant.
          <p className="text-lg font-medium">
            {`${variants[0].weight}${variants[0].unit} - ${variants[0].price} GHS`}
          </p>
        )}
      </div>
    </div>
  )
}

export default WeightAndPrice
