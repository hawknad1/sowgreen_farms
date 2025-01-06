"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { TrashIcon } from "@heroicons/react/20/solid"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Image from "next/image"
import { units } from "@/constants"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { AddProductSchema } from "@/schemas"
import CustomCloudinaryUpload from "../CustomCloudinaryUpload"

interface ProductDialogProps {
  currentStep: number
  setCurrentStep: (method: number) => void
  handlePrevStep: () => void
  handleNextStep: () => void
  isLastStep: boolean
  title: string
}

const PostProductForm = ({
  currentStep,
  setCurrentStep,
  handlePrevStep,
  handleNextStep,
  isLastStep,
  title,
}: ProductDialogProps) => {
  const [productImageUrl, setProductImageUrl] = useState("")
  const [publicId, setPublicId] = useState("")
  const [categories, setCategories] = useState([])

  const form = useForm<z.infer<typeof AddProductSchema>>({
    resolver: zodResolver(AddProductSchema),
    defaultValues: {
      title: "",
      description: "",
      discount: 0,
      isInStock: "",
      categoryName: "",
      quantity: 0,
      variants: [{ weight: 0, price: 0, unit: "", quantity: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  })

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

  const onSubmit = async (values: z.infer<typeof AddProductSchema>) => {
    console.log(values, "values")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Step 1: Basic Info */}
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
            <div className="flex w-full items-center justify-between">
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
                      <Textarea placeholder="Product description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {/* Step 2: Variants */}
        {currentStep === 2 && (
          <div className="space-y-4 max-h-[350px] overflow-y-scroll scrollbar-hide">
            <div className="flex w-full justify-between sticky top-0 z-10 bg-white border-b py-2 ">
              {/* <h2 className="text-lg font-medium">{title}</h2> */}
              <Button
                type="button"
                onClick={() =>
                  append({ weight: 0, price: 0, unit: "", quantity: 0 })
                }
                className=""
              >
                Add Variant
              </Button>
            </div>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center justify-between w-full"
              >
                <div className="flex gap-x-2.5">
                  <FormField
                    control={form.control}
                    name={`variants.${index}.price`}
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
                    name={`variants.${index}.weight`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Weight</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                </div>

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => remove(index)}
                  className="mb-4"
                >
                  <TrashIcon className="w-5 h-5" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Step 3: Image Upload */}
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
                    setProductImageUrl(result.secure_url)
                    setPublicId(result.public_id)
                  }}
                />
                {productImageUrl && (
                  <div className="mt-4">
                    <p>Uploaded Image:</p>
                    <img
                      src={productImageUrl}
                      alt="Uploaded"
                      className="w-24 h-24 object-cover"
                    />
                  </div>
                )}
              </>
            </FormControl>
            {publicId && (
              <button
                onClick={removeImage}
                className="bg-red-600 w-fit py-1 px-2 rounded-md text-white font-semibold"
              >
                Remove Image
              </button>
            )}
          </div>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && (
          <div>
            <p>Review all your details before submitting.</p>
            <div className="space-y-4">
              <h3>Review Your Details</h3>
              <p>
                <strong>Title:</strong> {form.getValues("title")}
              </p>
              <p>
                <strong>Category:</strong> {form.getValues("categoryName")}
              </p>
              <p>
                <strong>Quantity:</strong> {form.getValues("quantity")}
              </p>
              <p>
                <strong>In Stock:</strong>{" "}
                {form.getValues("isInStock") === "in-stock" ? "Yes" : "No"}
              </p>
              <p>
                <strong>Discount:</strong> {form.getValues("discount")}%
              </p>
              <p>
                <strong>Description:</strong> {form.getValues("description")}
              </p>
              <div>
                <strong>Variants:</strong>
                {form.getValues("variants").map((variant, index) => (
                  <div key={index} className="ml-4 mt-2">
                    <p>
                      Variant {index + 1}: Price: GHS {variant.price}, Weight:{" "}
                      {variant.weight} {variant.unit}, Quantity:{" "}
                      {variant.quantity}
                    </p>
                  </div>
                ))}
              </div>
              {productImageUrl && (
                <div>
                  <p>
                    <strong>Uploaded Image:</strong>
                  </p>
                  <Image
                    src={productImageUrl}
                    alt="Product Image"
                    width={100}
                    height={100}
                    className="object-cover mt-2"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-4">
          {currentStep > 1 && (
            <Button type="button" onClick={handlePrevStep} variant="outline">
              Previous
            </Button>
          )}
          {!isLastStep ? (
            <Button type="button" onClick={handleNextStep}>
              Next
            </Button>
          ) : (
            <Button type="submit">Submit</Button>
          )}
        </div>
      </form>
    </Form>
  )
}

export default PostProductForm
