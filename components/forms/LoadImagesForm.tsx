// "use client"

// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { toast } from "react-hot-toast"
// import { Button } from "@/components/ui/button"
// import { Form, FormControl, FormLabel } from "@/components/ui/form"
// import { useEffect, useState, useCallback } from "react"
// import { useRouter } from "next/navigation"
// import Image from "next/image"
// import { CldUploadButton } from "next-cloudinary"
// import { PhotoIcon } from "@heroicons/react/20/solid"
// import { AddImagesSchema } from "@/schemas"

// interface ProductProps {
//   productId: string
// }

// export function LoadImagesForm({ productId }: ProductProps) {
//   const router = useRouter()
//   const [imageList, setImageList] = useState<
//     { url: string; publicId: string }[]
//   >([])
//   const [isLoading, setIsLoading] = useState(false)

//   // Fetch existing images on component load
//   useEffect(() => {
//     const fetchExistingImages = async () => {
//       try {
//         const res = await fetch(`/api/products/${productId}`)
//         if (res.ok) {
//           const productData = await res.json()
//           setImageList(productData.images || []) // Ensure fallback to empty array
//         } else {
//           toast.error("Failed to load existing images.")
//         }
//       } catch (error) {
//         console.error("Error fetching images:", error)
//         toast.error("An error occurred while fetching images.")
//       }
//     }

//     fetchExistingImages()
//   }, [productId])

//   // Function to handle image removal
//   const removeImage = useCallback(
//     async (publicId: string) => {
//       try {
//         setIsLoading(true)
//         const res = await fetch(`/api/products/${productId}/images`, {
//           method: "DELETE",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ publicId }),
//         })

//         if (res.ok) {
//           setImageList((prev) =>
//             prev.filter((image) => image.publicId !== publicId)
//           )
//           toast.success("Image removed successfully!")
//         } else {
//           toast.error("Failed to remove image from the database.")
//         }
//       } catch (error) {
//         console.error("Error removing image:", error)
//         toast.error("An error occurred while removing the image.")
//       } finally {
//         setIsLoading(false)
//       }
//     },
//     [productId]
//   )

//   const form = useForm<z.infer<typeof AddImagesSchema>>({
//     resolver: zodResolver(AddImagesSchema),
//     defaultValues: { images: [] },
//   })

//   async function onSubmit(values: z.infer<typeof AddImagesSchema>) {
//     try {
//       setIsLoading(true)
//       const res = await fetch(`/api/products/${productId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           images: imageList,
//         }),
//       })

//       if (res.ok) {
//         router.push("/admin/products")
//         toast.success("Product images added successfully!")
//       } else {
//         const errorData = await res.json()
//         toast.error(errorData.message || "Failed to add product images.")
//       }
//     } catch (error) {
//       console.error("Error adding product images:", error)
//       toast.error("An error occurred while adding product images.")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <Form {...form}>
//       <div className="flex justify-center my-4">
//         <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
//           <div className="w-[700px]">
//             <FormLabel>Product Images</FormLabel>
//             <FormControl>
//               <CldUploadButton
//                 uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
//                 className="h-44 w-full border-dotted border-2 mt-4 grid place-items-center bg-slate-100 rounded-md relative"
//                 onSuccess={(result: any) => {
//                   const newImage = {
//                     url: result?.info?.url,
//                     publicId: result?.info?.public_id,
//                   }

//                   // Safely update the imageList by ensuring prev is always an array
//                   setImageList((prev) => {
//                     // Fallback to an empty array if prev is undefined or not iterable
//                     const updatedList = Array.isArray(prev) ? prev : []
//                     return [...updatedList, newImage]
//                   })

//                   toast.success("Image uploaded successfully!")
//                 }}
//                 onError={() => toast.error("Image upload failed.")}
//               >
//                 <PhotoIcon className="h-6 w-6" />
//                 {isLoading && <p>Uploading...</p>}
//               </CldUploadButton>
//             </FormControl>

//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 bg-red-100 gap-3 mt-4 mb-4">
//               {Array.isArray(imageList) &&
//                 imageList.map((image) => (
//                   <div key={image.publicId} className="relative">
//                     <Image
//                       src={image.url}
//                       alt="Uploaded Image"
//                       width={100}
//                       height={100}
//                       className="object-cover rounded-md w-44 h-24"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removeImage(image.publicId)}
//                       className="absolute top-1 right-1 bg-red-600 text-white text-xs w-6 h-6 rounded-full"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 ))}
//             </div>
//           </div>

//           <Button type="submit" className="w-full" disabled={isLoading}>
//             {isLoading ? "Adding..." : "Add Images"}
//           </Button>
//         </form>
//       </div>
//     </Form>
//   )
// }

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
  productId: string
}

interface ImageData {
  url: string
  publicId: string
}

export function LoadImagesForm({ productId }: ProductProps) {
  const router = useRouter()
  const [imageList, setImageList] = useState<ImageData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRemoving, setIsRemoving] = useState<string | null>(null)
  const [isFetching, setIsFetching] = useState(true)

  // Fetch existing images on component load
  useEffect(() => {
    const fetchExistingImages = async () => {
      try {
        setIsFetching(true)
        const res = await fetch(`/api/products/${productId}`)
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
  }, [productId])

  // Function to handle image removal
  const removeImage = useCallback(
    async (publicId: string) => {
      try {
        setIsRemoving(publicId)
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
          toast.error("Failed to remove image.")
        }
      } catch (error) {
        console.error("Error removing image:", error)
        toast.error("An error occurred while removing the image.")
      } finally {
        setIsRemoving(null)
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
