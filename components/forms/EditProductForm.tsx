"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
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
import { Category, Product } from "@/types"
import { useRouter } from "next/navigation"
import { units } from "@/constants"
import { useEffect, useState } from "react"
import { EditProductAdminSchema } from "@/schemas"
import { PartnerType } from "@/app/(auth)/admin/(same-layout)/management/partners/PartnerForm"
import { revalidatePath } from "next/cache"

interface ProductProps {
  product: Product
}

// const EditProductForm = ({ product }: ProductProps) => {
//   const [isLoading, setIsLoading] = useState(false)
//   const [categories, setCategories] = useState<Category[]>([])
//   const [partners, setPartners] = useState<PartnerType[]>([])
//   const [changeNote, setChangeNote] = useState("")

//   const router = useRouter()

//   const form = useForm<z.infer<typeof EditProductAdminSchema>>({
//     resolver: zodResolver(EditProductAdminSchema),
//     defaultValues: {
//       ...product,
//       price: product.price ? Number(product.price) : undefined, // Ensure price is included
//       variants: product.variants.map((variant) => ({
//         price: Number(variant.price),
//         weight: variant.weight ? Number(variant.weight) : undefined,
//         unit: variant.unit || undefined,
//         discountedPrice: variant.discountedPrice
//           ? Number(variant.discountedPrice)
//           : undefined,
//       })),
//     },
//   })
//   const { fields, append, remove } = useFieldArray({
//     control: form.control,
//     name: "variants",
//   })

//   // Fetch categories only once when the component mounts
//   useEffect(() => {
//     async function getCategories() {
//       try {
//         const res = await fetch("/api/categories", {
//           cache: "no-store",
//           method: "GET",
//         })
//         if (res.ok) {
//           const categories = await res.json()
//           setCategories(categories)
//         }
//       } catch (error) {
//         console.error("Error fetching categories:", error)
//       }
//     }
//     getCategories()
//   }, [])

//   // Fetch categories only once when the component mounts
//   useEffect(() => {
//     async function getPartners() {
//       try {
//         const res = await fetch("/api/management/partners", {
//           cache: "no-store",
//           method: "GET",
//         })
//         if (res.ok) {
//           const partners = await res.json()
//           setPartners(partners)
//         }
//       } catch (error) {
//         console.error("Error fetching partners:", error)
//       }
//     }
//     getPartners()
//   }, [])

//   const updateProduct = async (
//     values: z.infer<typeof EditProductAdminSchema>
//   ) => {
//     setIsLoading(true)
//     try {
//       // const res = await fetch(`/api/products/${product.slug}`, {
//       //   method: "PUT",
//       //   headers: { "Content-Type": "application/json" },
//       //   body: JSON.stringify(values),
//       // })

//       const res = await fetch(`/api/products/${product.slug}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...values,
//           changeNote, // Pass change note to API
//         }),
//       })

//       if (!res.ok) throw new Error("Failed to update product")

//       toast.success("Product updated successfully!")

//       window.location.reload()
//       router.push(`/admin/products/${product.slug}`)
//     } catch (error) {
//       console.error("Error updating product:", error)
//       toast.error("Error updating product.")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const onSubmit = async (values: z.infer<typeof EditProductAdminSchema>) => {
//     // updateProduct(values)
//     const updatedValues = {
//       ...values,
//       quantity: values.isInStock === "out-of-stock" ? 0 : values.quantity,
//     }
//     updateProduct(updatedValues)
//   }

//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="space-y-8 px-4 lg:px-0 max-w-4xl mx-auto"
//       >
//         {/* Top Section */}
//         <div className="grid grid-cols-1 gap-y-4">
//           <div className="flex w-full space-x-3">
//             <FormField
//               control={form.control}
//               name="title"
//               render={({ field }) => (
//                 <FormItem className="md:col-span-2 lg:col-span-4 w-full">
//                   <FormLabel>Product Name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Product name" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="categoryName"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   <FormLabel>Category</FormLabel>
//                   <Select
//                     onValueChange={(value) => field.onChange(value)}
//                     defaultValue={field.value}
//                   >
//                     <SelectTrigger className="mt-2 mb-3">
//                       <SelectValue placeholder="Select Category" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectGroup>
//                         <SelectLabel>Category</SelectLabel>
//                         {categories.map((cat) => (
//                           <SelectItem key={cat.id} value={cat.categoryName}>
//                             {cat.categoryName}
//                           </SelectItem>
//                         ))}
//                       </SelectGroup>
//                     </SelectContent>
//                   </Select>
//                 </FormItem>
//               )}
//             />
//             {/* <FormField
//               control={form.control}
//               name="partner"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   <FormLabel>Partner</FormLabel>
//                   <Select
//                     onValueChange={(value) => field.onChange(value)}
//                     defaultValue={
//                       typeof field.value === "string" ? field.value : ""
//                     }
//                   >
//                     <SelectTrigger className="mt-2 mb-3">
//                       <SelectValue placeholder="Select Category" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectGroup>
//                         <SelectLabel>Partner</SelectLabel>
//                         {partners.map((part) => (
//                           <SelectItem key={part.id} value={part.id}>
//                             {part.brand}
//                           </SelectItem>
//                         ))}
//                       </SelectGroup>
//                     </SelectContent>
//                   </Select>
//                 </FormItem>
//               )}
//             /> */}
//             <FormField
//               control={form.control}
//               name="changeNote"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Change Note (Optional)</FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="Reason for price change..."
//                       {...field}
//                       value={changeNote}
//                       onChange={(e) => setChangeNote(e.target.value)}
//                     />
//                   </FormControl>
//                   <FormDescription>
//                     Add a note explaining why you're changing the price
//                   </FormDescription>
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="partner"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   <FormLabel>Partner</FormLabel>
//                   <Select
//                     onValueChange={(value) => {
//                       const selectedPartner = partners.find(
//                         (p) => p.id === value
//                       )
//                       field.onChange(selectedPartner || null)
//                     }}
//                     value={field.value?.id || undefined} // Use undefined instead of empty string
//                   >
//                     <SelectTrigger className="mt-2 mb-3">
//                       <SelectValue placeholder="Select Partner" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectGroup>
//                         <SelectLabel>Partner</SelectLabel>
//                         {partners.map((part) => (
//                           <SelectItem key={part.id} value={part.id}>
//                             {part.brand}
//                           </SelectItem>
//                         ))}
//                       </SelectGroup>
//                     </SelectContent>
//                   </Select>
//                   {!field.value && (
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => field.onChange(null)}
//                     >
//                       Clear Selection
//                     </Button>
//                   )}
//                 </FormItem>
//               )}
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-2.5">
//             <FormField
//               control={form.control}
//               name="isInStock"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Availability</FormLabel>
//                   <Select
//                     // onValueChange={field.onChange}
//                     onValueChange={(value) => {
//                       field.onChange(value)
//                       // When out of stock is selected, set quantity to 0
//                       if (value === "out-of-stock") {
//                         form.setValue("quantity", 0)
//                       }
//                     }}
//                     defaultValue={field.value}
//                   >
//                     <SelectTrigger className="">
//                       <SelectValue placeholder="Stock" className="" />
//                     </SelectTrigger>
//                     <SelectContent className="">
//                       <SelectItem value="in-stock">In Stock</SelectItem>
//                       <SelectItem value="out-of-stock">Out Of Stock</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="discount"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Discount</FormLabel>
//                   <FormControl>
//                     <Input type="number" placeholder="Discount" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="quantity"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Quantity</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="number"
//                       placeholder="Quantity"
//                       {...field}
//                       className="w-full"
//                       disabled={form.watch("isInStock") === "out-of-stock"}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//         </div>

//         {/* Variants Section */}
//         <div className="space-y-4">
//           <FormLabel className="text-lg font-semibold">Variants</FormLabel>
//           <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4">
//             {fields.map((field, index) => (
//               <div key={field.id} className="space-y-4 p-4 rounded-lg border">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <FormField
//                     control={form.control}
//                     name={`variants.${index}.price`}
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Price</FormLabel>
//                         <FormControl>
//                           <Input type="number" placeholder="Price" {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name={`variants.${index}.weight`}
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Weight</FormLabel>
//                         <FormControl>
//                           <Input
//                             type="number"
//                             placeholder="Weight"
//                             {...field}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <div className="flex gap-4">
//                     <FormField
//                       control={form.control}
//                       name={`variants.${index}.unit`}
//                       render={({ field }) => (
//                         <FormItem className="flex-1">
//                           <FormLabel>Unit</FormLabel>
//                           <Select
//                             onValueChange={field.onChange}
//                             defaultValue={field.value}
//                           >
//                             <SelectTrigger>
//                               <SelectValue placeholder="Unit" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectGroup>
//                                 <SelectLabel>Units</SelectLabel>
//                                 {units.map((u, idx) => (
//                                   <SelectItem key={idx} value={u.unitSign}>
//                                     {u.unitTitle}
//                                   </SelectItem>
//                                 ))}
//                               </SelectGroup>
//                             </SelectContent>
//                           </Select>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <Button
//                       type="button"
//                       variant="destructive"
//                       onClick={() => remove(index)}
//                       className="self-end"
//                     >
//                       Remove
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <Button
//             type="button"
//             onClick={() =>
//               append({ price: 0, weight: undefined, unit: undefined })
//             }
//             className="w-full md:w-auto"
//           >
//             Add Variant
//           </Button>
//         </div>

//         {/* Description */}
//         <FormField
//           control={form.control}
//           name="description"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Description</FormLabel>
//               <FormControl>
//                 <Textarea
//                   placeholder="Product description"
//                   {...field}
//                   className="min-h-[120px]"
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Submit Button */}
//         <Button type="submit" className="w-full" disabled={isLoading}>
//           {isLoading ? (
//             <div className="flex items-center justify-center gap-2">
//               <span className="loading loading-spinner loading-sm" />
//               Saving...
//             </div>
//           ) : (
//             "Save changes"
//           )}
//         </Button>
//       </form>
//     </Form>
//   )
// }

// components/forms/EditProductForm.tsx

const EditProductForm = ({ product }: ProductProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [partners, setPartners] = useState<PartnerType[]>([])

  const router = useRouter()

  const form = useForm<z.infer<typeof EditProductAdminSchema>>({
    resolver: zodResolver(EditProductAdminSchema),
    defaultValues: {
      title: product.title,
      categoryName: product.categoryName,
      partnerId: product?.partner?.id || undefined,
      // price: product.price || undefined,
      discount: product.discount || undefined,
      quantity: product.quantity,
      isInStock: product.isInStock as "in-stock" | "out-of-stock",
      description: product.description,
      changeNote: "",
      variants: product.variants.map((variant) => ({
        price: Number(variant.price),
        weight: variant.weight ? Number(variant.weight) : undefined,
        unit: variant.unit || undefined,
        discountedPrice: variant.discountedPrice
          ? Number(variant.discountedPrice)
          : undefined,
      })),
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  })

  // Fetch categories
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

  // Fetch partners
  useEffect(() => {
    async function getPartners() {
      try {
        const res = await fetch("/api/management/partners", {
          cache: "no-store",
          method: "GET",
        })
        if (res.ok) {
          const partners = await res.json()
          setPartners(partners)
        }
      } catch (error) {
        console.error("Error fetching partners:", error)
      }
    }
    getPartners()
  }, [])

  const updateProduct = async (
    values: z.infer<typeof EditProductAdminSchema>
  ) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/products/${product.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!res.ok) throw new Error("Failed to update product")

      toast.success("Product updated successfully!")
      router.push(`/admin/products/${product.slug}`)
    } catch (error) {
      console.error("Error updating product:", error)
      toast.error("Error updating product.")
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (values: z.infer<typeof EditProductAdminSchema>) => {
    // const updatedValues = {
    //   ...values,
    //   quantity: values.isInStock === "out-of-stock" ? 0 : values.quantity,
    // }

    const updatedValues = {
      ...values,
      quantity: values.isInStock === "out-of-stock" ? 0 : values.quantity,
      price: values.price || null,
      discount: values.discount || null,
      partnerId: values.partnerId || null,
      // Ensure all fields are explicitly included
      title: values.title,
      description: values.description,
      categoryName: values.categoryName,
      isInStock: values.isInStock,
    }

    updateProduct(updatedValues)

    console.log(values, "values")
    console.log(updatedValues, "updatedValues")
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 px-4 lg:px-0 max-w-4xl mx-auto"
      >
        {/* Top Section */}
        <div className="grid grid-cols-1 gap-y-4">
          <div className="flex w-full space-x-3">
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
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="partnerId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Partner</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Partner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Partner</SelectLabel>
                        {partners.map((part) => (
                          <SelectItem key={part.id} value={part.id}>
                            {part.brand}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {field.value && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => field.onChange("")}
                    >
                      Clear Selection
                    </Button>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 w-full gap-2.5">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Base price"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
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
                  <FormLabel>Availability</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      if (value === "out-of-stock") {
                        form.setValue("quantity", 0)
                      }
                    }}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Stock" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-stock">In Stock</SelectItem>
                      <SelectItem value="out-of-stock">Out Of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Discount"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Quantity"
                      {...field}
                      disabled={form.watch("isInStock") === "out-of-stock"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Quantity"
                      {...field}
                      value={field.value || ""} // Handle null/undefined values
                      onChange={(e) =>
                        field.onChange(e.target.valueAsNumber || 0)
                      }
                      disabled={form.watch("isInStock") === "out-of-stock"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Change Note Field */}
        <FormField
          control={form.control}
          name="changeNote"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Change Note (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Reason for price change..." {...field} />
              </FormControl>
              <FormDescription>
                Add a note explaining why you're changing the price
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Variants Section */}
        <div className="space-y-4">
          <FormLabel className="text-lg font-semibold">Variants</FormLabel>
          <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4 p-4 rounded-lg border">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name={`variants.${index}.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Price"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`variants.${index}.weight`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Weight"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`variants.${index}.unit`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Units</SelectLabel>
                              {units.map((u, idx) => (
                                <SelectItem key={idx} value={u.unitSign}>
                                  {u.unitTitle}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => remove(index)}
                      className="w-full"
                    >
                      Remove
                    </Button>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name={`variants.${index}.discountedPrice`}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Discounted Price (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Discounted price"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
          <Button
            type="button"
            onClick={() =>
              append({
                price: 0,
                weight: undefined,
                unit: undefined,
                discountedPrice: undefined,
              })
            }
            className="w-full md:w-auto"
          >
            Add Variant
          </Button>
        </div>

        {/* Description */}
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
                  className="min-h-[120px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <span className="loading loading-spinner loading-sm" />
              Saving...
            </div>
          ) : (
            "Save changes"
          )}
        </Button>
      </form>
    </Form>
  )
}

export default EditProductForm
