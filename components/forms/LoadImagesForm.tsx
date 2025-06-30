"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormLabel, FormMessage } from "@/components/ui/form"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { CldUploadButton } from "next-cloudinary"
import {
  PhotoIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline"
import { AddImagesSchema } from "@/schemas"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductProps {
  slug: string
}

interface ImageData {
  url: string
  publicId: string
}

export function LoadImagesForm({ slug }: ProductProps) {
  const router = useRouter()
  const [imageList, setImageList] = useState<ImageData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRemoving, setIsRemoving] = useState<string | null>(null)
  const [isFetching, setIsFetching] = useState(true)

  console.log(slug, "slug")

  // Fetch existing images on component load
  useEffect(() => {
    const fetchExistingImages = async () => {
      try {
        setIsFetching(true)
        const res = await fetch(`/api/products/${slug}`)
        if (res.ok) {
          const productData = await res.json()
          setImageList(
            Array.isArray(productData.images) ? productData.images : []
          )
        } else {
          toast.error("Failed to load existing images.")
        }
      } catch (error) {
        console.error("Error fetching images:", error)
        toast.error("An error occurred while fetching images.")
      } finally {
        setIsFetching(false)
      }
    }

    fetchExistingImages()
  }, [slug])

  // Function to handle image removal
  const removeImage = useCallback(
    async (publicId: string) => {
      try {
        setIsRemoving(publicId)
        const res = await fetch(`/api/products/${slug}/images`, {
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
          toast.error("Failed to remove image.")
        }
      } catch (error) {
        console.error("Error removing image:", error)
        toast.error("An error occurred while removing the image.")
      } finally {
        setIsRemoving(null)
      }
    },
    [slug]
  )

  const form = useForm<z.infer<typeof AddImagesSchema>>({
    resolver: zodResolver(AddImagesSchema),
    defaultValues: { images: [] },
  })

  async function onSubmit(values: z.infer<typeof AddImagesSchema>) {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/products/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: imageList }),
      })

      if (res.ok) {
        router.push("/admin/products")
        toast.success("Product images updated successfully!")
      } else {
        const errorData = await res.json()
        toast.error(errorData.message || "Failed to update product images.")
      }
    } catch (error) {
      console.error("Error updating product images:", error)
      toast.error("An error occurred while updating product images.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <div className="flex justify-center px-4 py-6">
        <Card className="w-full max-w-4xl">
          <CardContent className="p-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <FormLabel className="text-lg font-medium">
                  Product Images
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                  Upload and manage product images. First image will be used as
                  the main display.
                </p>

                <FormControl>
                  <CldUploadButton
                    uploadPreset={
                      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
                    }
                    options={{
                      multiple: true,
                      sources: ["local", "url", "camera"],
                      maxFiles: 10,
                    }}
                    className="h-48 w-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-accent/50 transition-colors cursor-pointer"
                    onSuccess={(result: any) => {
                      const newImage = {
                        url: result?.info?.secure_url,
                        publicId: result?.info?.public_id,
                      }
                      setImageList((prev) => [...prev, newImage])
                      toast.success("Image uploaded successfully!")
                    }}
                    onError={() => toast.error("Image upload failed.")}
                  >
                    <PhotoIcon className="h-10 w-10 text-muted-foreground" />
                    <div className="text-center">
                      <p className="font-medium">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-muted-foreground">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </CldUploadButton>
                </FormControl>
                <FormMessage />
              </div>

              {isFetching ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-md" />
                  ))}
                </div>
              ) : (
                <>
                  {imageList.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {imageList.map((image) => (
                        <div key={image.publicId} className="relative group">
                          <div className="aspect-square overflow-hidden rounded-md border">
                            <Image
                              src={image.url}
                              alt="Product image"
                              width={200}
                              height={200}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(image.publicId)}
                            disabled={isRemoving === image.publicId}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {isRemoving === image.publicId ? (
                              <ArrowPathIcon className="h-3 w-3 animate-spin" />
                            ) : (
                              <TrashIcon className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 rounded-md border border-dashed">
                      <p className="text-muted-foreground">
                        No images uploaded yet
                      </p>
                    </div>
                  )}
                </>
              )}

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  // onClick={() => router.push("/admin/products")}
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || imageList.length === 0}
                >
                  {isLoading ? (
                    <>
                      <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Form>
  )
}
