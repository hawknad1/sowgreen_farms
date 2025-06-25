"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { toast } from "react-hot-toast"
import { useMemo, useCallback, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { CldUploadButton } from "next-cloudinary"
import { PhotoIcon } from "@heroicons/react/20/solid"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

import { AddProductSchema } from "@/schemas"
import { Category } from "@/types"
import { units } from "@/constants"

export function AddProductForm() {
  const router = useRouter()
  const [productImageUrl, setProductImageUrl] = useState("")
  const [publicId, setPublicId] = useState("")
  const [categories, setCategories] = useState<Category[]>([])

  const form = useForm<z.infer<typeof AddProductSchema>>({
    resolver: zodResolver(AddProductSchema),
    defaultValues: useMemo(
      () => ({
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
        variants: [{ weight: 0.0, price: 0, unit: "", quantity: 0 }], // Default variant
      }),
      []
    ),
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  })

  // Fetch categories only once when the component mounts
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
        console.error("Error fetching categories:", error)
      }
    }
    getCategories()
  }, [])

  const removeImage = useCallback(
    async (e: React.FormEvent) => {
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
        console.error("Error removing image:", error)
      }
    },
    [publicId]
  )

  const onSubmit = async (values: z.infer<typeof AddProductSchema>) => {
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
            {/* Product Title */}
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
            {/* Category */}
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

        {/* Product Variants */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Product Variants</h2>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-x-4 items-center">
              {/* Weight */}
              <FormField
                control={form.control}
                name={`variants.${index}.weight`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Price */}
              <FormField
                control={form.control}
                name={`variants.${index}.price`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Unit */}
              <FormField
                control={form.control}
                name={`variants.${index}.unit`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Quantity */}
              <FormField
                control={form.control}
                name={`variants.${index}.quantity`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 font-medium"
              >
                Remove
              </button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() =>
              append({ weight: 0.0, price: 0, unit: "", quantity: 0 })
            }
          >
            Add Variant
          </Button>
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

        {/* Product Image */}
        <div>
          <FormLabel>Product Image</FormLabel>
          <FormControl>
            <CldUploadButton
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              className="h-44 w-full border-dotted border-2 mt-4 grid place-items-center bg-slate-100 rounded-md relative"
              onSuccess={(result: any) => {
                setProductImageUrl(result?.info?.url || "")
                setPublicId(result?.info?.public_id || "")
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

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
