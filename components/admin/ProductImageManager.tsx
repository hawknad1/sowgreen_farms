import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CldUploadButton } from "next-cloudinary"
import Image from "next/image"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Form, FormControl, FormLabel } from "../ui/form"
import { Button } from "../ui/button"
import { AddImagesSchema } from "@/schemas"
import { Product } from "@/types"
import { PhotoIcon } from "@heroicons/react/20/solid"

interface ProductProps {
  product: Product
}

const ProductImageManager = ({ product }: ProductProps) => {
  const [productImageUrl, setProductImageUrl] = useState("")
  const [publicId, setPublicId] = useState("")
  const router = useRouter()

  const form = useForm<z.infer<typeof AddImagesSchema>>({
    resolver: zodResolver(AddImagesSchema),
    defaultValues: { images: [] },
  })

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
        toast.success("Image removed successfully")
      } else {
        toast.error("Failed to remove image")
      }
    } catch (error) {
      console.error("Error removing image:", error)
      toast.error("An error occurred while removing the image")
    }
  }

  async function onSubmit(values: z.infer<typeof AddImagesSchema>) {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          images: [...product.images, productImageUrl], // Append new image
        }),
      })

      if (res.ok) {
        router.push("/admin/products")
        toast.success("Product Image added successfully!")
      } else {
        const errorData = await res.json()
        toast.error(errorData.message || "Failed to add product image")
      }
    } catch (error) {
      console.error("Error adding product image:", error)
      toast.error("An error occurred while adding the product image")
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-2xl"
      >
        <div>
          <FormLabel>Product Image</FormLabel>
          <FormControl>
            <CldUploadButton
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              className="h-44 w-full border-dotted border-2 mt-4 grid place-items-center bg-slate-100 rounded-md relative"
              onSuccess={(result: any) => {
                if (result?.info?.url && result?.info?.public_id) {
                  setProductImageUrl(result.info.url)
                  setPublicId(result.info.public_id)
                } else {
                  toast.error("Image upload failed. Try again.")
                }
              }}
              onError={() => {
                toast.error("Image upload error occurred.")
              }}
            >
              <PhotoIcon className="h-6 w-6" />
              {productImageUrl && (
                <Image
                  src={productImageUrl}
                  alt="Uploaded Image"
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

        <Button type="submit" className="text-white p-2 rounded-md">
          Save Product Images
        </Button>
      </form>
    </Form>
  )
}

export default ProductImageManager
