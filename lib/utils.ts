import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetchProduct(productId: any) {
  const res = await fetch(`http://localhost:1337/api/products/${productId}`)
  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  return res.json()
}

export async function getCategories() {
  try {
    const res = await fetch(`${baseUrl}/api/categories`, {
      cache: "no-store",
      method: "GET",
    })
    if (res.ok) {
      const categories = await res.json()
      return categories
    }
  } catch (error) {
    console.log(error)
  }
  return null
}

export async function getCategory(params: string) {
  try {
    const res = await fetch(`${baseUrl}/api/categories/${params}`)
    if (res.ok) {
      const category = await res.json()
      return category
    }
  } catch (error) {
    console.log(error)
  }
  return null
}

export const now = new Date()

export const options: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
}

const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

const d = new Date()
let day = weekday[d.getDay() + 1]

export let tomorrow = new Date()
tomorrow.setDate(now.getDate() + 1)
export const nextDay = `${day}, ${tomorrow.toLocaleDateString(
  "en-US",
  options
)}`

export const date = now.toLocaleDateString("en-US", options)

export const timeOptions: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
}
export const time = now.toLocaleTimeString("en-US", timeOptions)

export const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}

import toast from "react-hot-toast"
import { Router } from "next/router"

export const handleDelete = async (
  productId: string,
  productName: string,
  router: Router
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/products/${productId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    if (!res.ok) throw new Error("Failed to delete product")

    toast.success(`${productName} deleted successfully!`)
  } catch (error) {
    toast.error("Error deleting product.")
    console.error("Delete product error:", error)
  }
}
