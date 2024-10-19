"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AddProductSchema } from "@/schemas"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Category } from "@/types"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Textarea } from "../ui/textarea"
import Image from "next/image"
import { CldUploadButton } from "next-cloudinary"
import { PhotoIcon } from "@heroicons/react/20/solid"
import { units } from "@/constants"

export function AddProductForm() {
  const router = useRouter()
  const [productImageUrl, setProductImageUrl] = useState("")
  const [publicId, setPublicId] = useState("")
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    async function getCategories() {
      try {
        const res = await fetch("/api/categories", {
          cache: "no-store",
          method: "GET",
        })
        if (res.ok) {
          const categories = await res.json()
          setCategories(categories)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getCategories()
  }, [])

  const removeImage = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch("/api/removeImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId }),
      })

      if (res.ok) {
        setProductImageUrl("")
        setPublicId("")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const form = useForm<z.infer<typeof AddProductSchema>>({
    resolver: zodResolver(AddProductSchema),
    defaultValues: {
      title: "",
      description: "",
      discount: 0,
      imageUrl: "",
      price: 0,
      unit: "",
      weight: 0.0,
      categoryName: "",
      quantity: 0,
      isInStock: "",
    },
  })

  async function onSubmit(values: z.infer<typeof AddProductSchema>) {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          imageUrl: productImageUrl,
        }),
      })

      if (res.ok) {
        router.push("/admin/products")
        toast.success("Product added successfully!")
      } else {
        const errorData = await res.json()
        toast.error(errorData.message || "Failed to add product")
      }
    } catch (error) {
      toast.error("An error occurred while adding the product")
      console.error("Error adding product:", error)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-2xl"
      >
        <div className="flex gap-x-2 w-full items-end">
          <div className="w-10/12 flex gap-x-2 justify-between">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value)}>
                    <SelectTrigger className="mt-2 mb-3">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Category</SelectLabel>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.categoryName}>
                            {cat.categoryName}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col gap-y-3 w-full">
          <div className="flex gap-x-2 justify-between w-full items-end">
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Weight</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Price (GHS)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Unit</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value)}>
                    <SelectTrigger className="mt-2 mb-3">
                      <SelectValue placeholder="Select Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Unit</SelectLabel>
                        {units.map((u, index) => (
                          <SelectItem key={index} value={u.unitSign}>
                            {u.unitTitle}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex gap-x-2.5">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isInStock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>In Stock</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-[180px] mt-2 mb-3">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>In Stock</SelectLabel>
                      <SelectItem value="in-stock">Yes</SelectItem>
                      <SelectItem value="out-of-stock">No</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount (%)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Product description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Product Image</FormLabel>
          <FormControl>
            <CldUploadButton
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              className="h-44 w-full border-dotted border-2 mt-4 grid place-items-center bg-slate-100 rounded-md relative"
              onSuccess={(result: any) => {
                setProductImageUrl(result?.info?.url)
                setPublicId(result?.info?.public_id)
              }}
            >
              <PhotoIcon className="h-6 w-6" />
              {productImageUrl && (
                <Image
                  src={productImageUrl}
                  alt="Image"
                  fill
                  className="absolute object-contain inset-0"
                />
              )}
            </CldUploadButton>
          </FormControl>
          {publicId && (
            <button
              onClick={removeImage}
              className="bg-red-600 w-fit p-2 rounded-md text-white font-semibold"
            >
              Remove Image
            </button>
          )}
        </div>

        <Button type="submit" className="w-full">
          Add Product
        </Button>
      </form>
    </Form>
  )
}
