// "use client"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { toast } from "react-hot-toast"
// import { Button } from "@/components/ui/button"
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { EditProductSchema } from "@/schemas"
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"
// import { Product } from "@/types"
// import { useRouter } from "next/navigation"
// import { units } from "@/constants"

// interface ProductProps {
//   product: Product
// }

// const EditProductForm = ({ product }: ProductProps) => {
//   const router = useRouter()
//   const form = useForm<z.infer<typeof EditProductSchema>>({
//     resolver: zodResolver(EditProductSchema),
//     defaultValues: {
//       description: product.description,
//       discount: product.discount,
//       isInStock: product.isInStock,
//       quantity: product.quantity,
//       title: product.title,
//       variants: product.variants.map((variant) => ({
//         price: Number(variant.price), // Coerces price to a number
//         weight: variant.weight ? Number(variant.weight) : undefined, // Coerces weight to a number or leaves undefined
//         unit: variant.unit || undefined, // Ensures unit is optional
//       })),
//     },
//   })

//   const updateProduct = async (values: z.infer<typeof EditProductSchema>) => {
//     try {
//       const res = await fetch(`/api/products/${product.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(values),
//       })

//       if (!res.ok) throw new Error("Failed to update product")

//       toast.success("Product updated successfully!")
//       router.push(`/admin/products`)
//     } catch (error) {
//       toast.error("Error updating product.")
//     }
//   }

//   const onSubmit = (values: z.infer<typeof EditProductSchema>) =>
//     updateProduct(values)

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         <div className="flex items-center justify-between gap-x-3">
//           <FormField
//             control={form.control}
//             name="title"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormLabel>Product Name</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Product name" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="isInStock"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormLabel>Availability</FormLabel>
//                 <Select
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Stock" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="in-stock">In Stock</SelectItem>
//                     <SelectItem value="out-of-stock">Out Of Stock</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="price"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormLabel>Price</FormLabel>
//                 <FormControl>
//                   <Input type="number" placeholder="Enter price" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <div className="flex items-center justify-between gap-x-3">
//           <FormField
//             control={form.control}
//             name="weight"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormLabel>Weight</FormLabel>
//                 <FormControl>
//                   <Input type="number" placeholder="Enter weight" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="unit"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormLabel>Unit</FormLabel>
//                 <Select onValueChange={(value) => field.onChange(value)}>
//                   <SelectTrigger className="mt-2 mb-3">
//                     <SelectValue placeholder="Select Unit" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectGroup>
//                       <SelectLabel>Unit</SelectLabel>
//                       {units.map((u, index) => (
//                         <SelectItem key={index} value={u.unitSign}>
//                           {u.unitTitle}
//                         </SelectItem>
//                       ))}
//                     </SelectGroup>
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="quantity"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormLabel>Quantity</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="number"
//                     placeholder="Available quantity"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="discount"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormLabel>Discount</FormLabel>
//                 <FormControl>
//                   <Input type="number" placeholder="Discount" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <FormField
//           control={form.control}
//           name="description"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Description</FormLabel>
//               <FormControl>
//                 <Textarea placeholder="Product Description" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <Button type="submit" className="w-full">
//           Save Changes
//         </Button>
//       </form>
//     </Form>
//   )
// }

// export default EditProductForm

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
import { EditProductSchema } from "@/schemas"
import { Product } from "@/types"
import { useRouter } from "next/navigation"
import { units } from "@/constants"

interface ProductProps {
  product: Product
}

const EditProductForm = ({ product }: ProductProps) => {
  const router = useRouter()

  const form = useForm<z.infer<typeof EditProductSchema>>({
    resolver: zodResolver(EditProductSchema),
    defaultValues: {
      description: product.description,
      discount: product.discount,
      isInStock: product.isInStock,
      quantity: product.quantity,
      title: product.title,
      variants: product.variants.map((variant) => ({
        price: Number(variant.price),
        weight: variant.weight ? Number(variant.weight) : undefined,
        unit: variant.unit || undefined,
      })),
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  })

  // const updateProduct = async (values: z.infer<typeof EditProductSchema>) => {
  //   console.log("Submitting values:", values) // Debugging submission
  //   try {
  //     const res = await fetch(`/api/products/${product.id}`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(values),
  //     })

  //     if (!res.ok) throw new Error("Failed to update product")

  //     toast.success("Product updated successfully!")
  //     router.push(`/admin/products`)
  //   } catch (error) {
  //     console.error("Error updating product:", error)
  //     toast.error("Error updating product.")
  //   }
  // }

  const onSubmit = (values: z.infer<typeof EditProductSchema>) => {
    console.log("Form submitted successfully!", values) // Debugging trigger
    // updateProduct(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)} // Ensure this is correctly set
        className="space-y-8"
      >
        {/* Basic Product Information */}
        <div className="flex items-center justify-between gap-x-3">
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
            name="isInStock"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Availability</FormLabel>
                <Select
                  onValueChange={field.onChange}
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
        </div>

        {/* Variants Section */}
        <div>
          <FormLabel className="text-lg font-semibold">Variants</FormLabel>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-center gap-x-3 border-b pb-4 mb-4"
            >
              <FormField
                control={form.control}
                name={`variants.${index}.price`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter price"
                        {...field}
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
                  <FormItem className="w-full">
                    <FormLabel>Weight</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter weight"
                        {...field}
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
                  <FormItem className="w-full">
                    <FormLabel>Unit</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Unit" />
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
              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(index)}
                className="self-end"
              >
                Remove
              </Button>
              <Button
                type="button"
                onClick={() =>
                  append({ price: 0, weight: undefined, unit: undefined })
                }
              >
                Add Variant
              </Button>
            </div>
          ))}
          {/* <Button
            type="button"
            onClick={() =>
              append({ price: 0, weight: undefined, unit: undefined })
            }
          >
            Add Variant
          </Button> */}
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Product Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </Form>
  )
}

export default EditProductForm
