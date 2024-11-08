"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormLabel } from "@/components/ui/form"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { CldUploadButton } from "next-cloudinary"
import { PhotoIcon } from "@heroicons/react/20/solid"
import { AddImagesSchema } from "@/schemas"

interface ProductProps {
  productId: string
}

export function LoadImagesForm({ productId }: ProductProps) {
  const router = useRouter()
  const [imageList, setImageList] = useState<
    { url: string; publicId: string }[]
  >([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch existing images on component load
  useEffect(() => {
    const fetchExistingImages = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`)
        if (res.ok) {
          const productData = await res.json()
          setImageList(productData.images || []) // Ensure fallback to empty array
        } else {
          toast.error("Failed to load existing images.")
        }
      } catch (error) {
        console.error("Error fetching images:", error)
        toast.error("An error occurred while fetching images.")
      }
    }

    fetchExistingImages()
  }, [productId])

  // Function to handle image removal
  const removeImage = useCallback(
    async (publicId: string) => {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/products/${productId}/images`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId }),
        })

        if (res.ok) {
          setImageList((prev) =>
            prev.filter((image) => image.publicId !== publicId)
          )
          toast.success("Image removed successfully!")
        } else {
          toast.error("Failed to remove image from the database.")
        }
      } catch (error) {
        console.error("Error removing image:", error)
        toast.error("An error occurred while removing the image.")
      } finally {
        setIsLoading(false)
      }
    },
    [productId]
  )

  const form = useForm<z.infer<typeof AddImagesSchema>>({
    resolver: zodResolver(AddImagesSchema),
    defaultValues: { images: [] },
  })

  async function onSubmit(values: z.infer<typeof AddImagesSchema>) {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: imageList,
        }),
      })

      if (res.ok) {
        router.push("/admin/products")
        toast.success("Product images added successfully!")
      } else {
        const errorData = await res.json()
        toast.error(errorData.message || "Failed to add product images.")
      }
    } catch (error) {
      console.error("Error adding product images:", error)
      toast.error("An error occurred while adding product images.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <div className="flex justify-center my-4">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
          <div className="w-[700px]">
            <FormLabel>Product Images</FormLabel>
            <FormControl>
              <CldUploadButton
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                className="h-44 w-full border-dotted border-2 mt-4 grid place-items-center bg-slate-100 rounded-md relative"
                onSuccess={(result: any) => {
                  const newImage = {
                    url: result?.info?.url,
                    publicId: result?.info?.public_id,
                  }

                  // Safely update the imageList by ensuring prev is always an array
                  setImageList((prev) => {
                    // Fallback to an empty array if prev is undefined or not iterable
                    const updatedList = Array.isArray(prev) ? prev : []
                    return [...updatedList, newImage]
                  })

                  toast.success("Image uploaded successfully!")
                }}
                onError={() => toast.error("Image upload failed.")}
              >
                <PhotoIcon className="h-6 w-6" />
                {isLoading && <p>Uploading...</p>}
              </CldUploadButton>
            </FormControl>

            <div className="grid grid-cols-3 gap-4 mt-4">
              {Array.isArray(imageList) &&
                imageList.map((image) => (
                  <div key={image.publicId} className="relative">
                    <Image
                      src={image.url}
                      alt="Uploaded Image"
                      width={100}
                      height={100}
                      className="object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image.publicId)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
                    >
                      ✕
                    </button>
                  </div>
                ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Images"}
          </Button>
        </form>
      </div>
    </Form>
  )
}
