"use client"

import React, { useCallback, useEffect, useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "@/components/ui/textarea"
import { units } from "@/constants"
import { SquaresPlusIcon, TrashIcon } from "@heroicons/react/20/solid"
import CustomCloudinaryUpload from "@/components/CustomCloudinaryUpload"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { stepOneSchema, stepThreeSchema, stepTwoSchema } from "@/schemas"
import Image from "next/image"

// Combine all schemas for submission
const finalSchema = stepOneSchema.merge(stepTwoSchema).merge(stepThreeSchema)

type FormValues = z.infer<typeof finalSchema>

export const AddProductModal = () => {
  const [currentStep, setCurrentStep] = useState(1) // Tracks the current step
  const [formData, setFormData] = useState<Partial<FormValues>>({}) // Stores form data across steps
  const [categories, setCategories] = useState([])
  const [variations, setVariations] = useState([
    { price: 0, weight: "", unit: "" },
  ])

  const [productImageUrl, setProductImageUrl] = useState("")
  const [publicId, setPublicId] = useState("")
  const [imageList, setImageList] = useState<
    { url: string; publicId: string }[]
  >([])
  const [isLoading, setIsLoading] = useState(false)

  // const removeImage = async (e: React.FormEvent) => {
  //   e.preventDefault()

  //   try {
  //     const res = await fetch("/api/removeImage", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ publicId }),
  //     })

  //     if (res.ok) {
  //       setProductImageUrl("")
  //       setPublicId("")
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // Function to remove an image from the list
  const removeImage = (publicId: string) => {
    setImageList((prev) => prev.filter((image) => image.publicId !== publicId))
    toast.success("Image removed successfully!")
  }

  // const removeImage = useCallback(async (publicId: string) => {
  //   try {
  //     setIsLoading(true)
  //     const res = await fetch(`/api/removeImage`, {
  //       method: "DELETE",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ publicId }),
  //     })

  //     if (res.ok) {
  //       setImageList((prev) =>
  //         prev.filter((image) => image.publicId !== publicId)
  //       )
  //       toast.success("Image removed successfully!")
  //     } else {
  //       toast.error("Failed to remove image from the database.")
  //     }
  //   } catch (error) {
  //     console.error("Error removing image:", error)
  //     toast.error("An error occurred while removing the image.")
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }, [])

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

  const form = useForm<FormValues>({
    resolver: zodResolver(
      currentStep === 1
        ? stepOneSchema
        : currentStep === 2
        ? stepTwoSchema
        : stepThreeSchema
    ),
    defaultValues: {
      ...(formData as FormValues),
      imageUrl: formData.imageUrl || "",
      images: formData.images || [],
    },
    mode: "onChange",
  })

  // Handle next step
  const handleNext = (data: Partial<FormValues>) => {
    setFormData({ ...formData, ...data }) // Save current step data
    setCurrentStep((prev) => prev + 1)
  }

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1)
  }

  // Add a new variation row
  const addVariation = () => {
    setVariations([...variations, { price: 0, weight: "", unit: "" }])
  }

  // Remove a variation row
  const removeVariation = (index: number) => {
    // Unregister the fields for the removed variation
    form.unregister(`variants.${index}.price`)
    form.unregister(`variants.${index}.weight`)
    form.unregister(`variants.${index}.unit`)

    // Remove the variation from the state
    setVariations((prev) => prev.filter((_, i) => i !== index))
  }

  // Handle form submission
  const handleSubmit = async (data: FormValues) => {
    console.log({ ...data, imageUrl: productImageUrl }, "data")
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          imageUrl: productImageUrl,
          images: imageList,
        }),
      })

      if (res.ok) {
        // router.push("/admin/products")
        toast.success("Product added successfully!")
        window.location.reload()
      } else {
        const errorData = await res.json()
        toast.error(errorData.message || "Failed to add product")
      }
    } catch (error) {
      toast.error("An error occurred while adding the product")
      console.log("Error adding product:", error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="flex gap-x-2">
          <SquaresPlusIcon className="h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-6 bg-white">
        <DialogHeader>
          <DialogTitle>Multi-Step Product Form</DialogTitle>
        </DialogHeader>

        {/* Render the form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) =>
              currentStep === 3
                ? handleSubmit({ ...formData, ...data })
                : handleNext(data)
            )}
          >
            {currentStep === 1 && (
              <div className="space-y-4">
                {/* <h2 className="text-lg font-medium">{title}</h2> */}

                <div className="flex w-full justify-between gap-x-3">
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
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger className="mt-2 mb-3">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Category</SelectLabel>
                              {categories.map((cat) => (
                                <SelectItem
                                  key={cat.id}
                                  value={cat.categoryName}
                                >
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
                <div className="flex gap-x-2.5 w-full items-center justify-between">
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
                <div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Product description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <>
                <div className="space-y-4">
                  {variations.map((_, index) => (
                    <div
                      key={index}
                      className="flex w-full gap-x-1.5 items-center"
                    >
                      {/* Price Field */}
                      <FormField
                        name={`variants.${index}.price`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter price" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Weight Field */}
                      <FormField
                        name={`variants.${index}.weight`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Weight</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter weight" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Unit Field */}
                      <FormField
                        control={form.control}
                        name={`variants.${index}.unit`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Unit</FormLabel>
                            <Select
                              onValueChange={(value) => field.onChange(value)}
                            >
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
                      <div className="flex items-center gap-x-1">
                        {/* Add Variation Button */}
                        <Button
                          variant="default"
                          type="button"
                          onClick={addVariation}
                          className="mt-7"
                        >
                          <SquaresPlusIcon className="h-4 w-4" />
                        </Button>
                        {/* Remove Variation Button */}
                        <Button
                          variant="destructive"
                          type="button"
                          onClick={() => removeVariation(index)}
                          className="mt-7"
                        >
                          <TrashIcon className="w-5 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {currentStep === 3 && (
              <div>
                {/* <h2 className="text-lg font-medium">{title}</h2> */}
                <FormLabel>Product Image</FormLabel>
                <FormControl>
                  <>
                    <CustomCloudinaryUpload
                      uploadPreset={
                        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
                      }
                      onSuccess={(result: any) => {
                        const newImage = {
                          url: result?.secure_url,
                          publicId: result?.public_id,
                        }

                        setImageList((prev) => {
                          const updatedList = Array.isArray(prev) ? prev : []
                          return [...updatedList, newImage]
                        })

                        toast.success("Image uploaded successfully!")
                      }}
                    />
                    <div className="relative flex gap-x-2 mt-3">
                      {Array.isArray(imageList) &&
                        imageList.map((image) => (
                          <div
                            key={image.publicId}
                            className="relative flex bg-gray-100 rounded-sm"
                          >
                            <Image
                              src={image.url}
                              alt="Uploaded Image"
                              width={100}
                              height={100}
                              className="object-contain rounded-md h-24 w-24 p-1.5"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(image.publicId)}
                              className="absolute top-1 right-1 bg-red-600 text-white p-1 h-6 w-6 text-xs rounded-full"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                    </div>
                  </>
                </FormControl>
              </div>
            )}
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-4">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                >
                  Previous
                </Button>
              )}
              {currentStep === 3 ? (
                <Button type="submit">Submit</Button>
              ) : (
                <Button type="submit">Next</Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
