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
import { Product } from "@/types"
import { useRouter } from "next/navigation"
import { units } from "@/constants"
import { useState } from "react"

interface ProductProps {
  product: Product
}

const EditProductSchema = z.object({
  description: z.string(),
  title: z.string(),
  discount: z.coerce.number().optional(),
  quantity: z.coerce.number().positive().optional(),
  isInStock: z.string().optional(),
  variants: z
    .array(
      z.object({
        price: z.coerce.number().positive(),
        weight: z.coerce.number().positive().optional(),
        unit: z.string().optional(),
      })
    )
    .nonempty("At least one variation is required"),
})

const EditProductForm = ({ product }: ProductProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof EditProductSchema>>({
    resolver: zodResolver(EditProductSchema),

    defaultValues: {
      title: product.title,
      description: product.description,
      discount: product.discount,
      isInStock: product.isInStock,
      quantity: product.quantity,
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

  const updateProduct = async (values: z.infer<typeof EditProductSchema>) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!res.ok) throw new Error("Failed to update product")

      toast.success("Product updated successfully!")
      router.push(`/admin/products`)
    } catch (error) {
      console.error("Error updating product:", error)
      toast.error("Error updating product.")
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (values: z.infer<typeof EditProductSchema>) => {
    updateProduct(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-2xl"
      >
        <div className="md:flex md:gap-x-3 space-y-2 md:space-y-0">
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
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Discount</FormLabel>
                <FormControl>
                  <Input placeholder="Discount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="h-[200px] overflow-y-scroll scrollbar-thin">
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
            </div>
          ))}
          <Button
            type="button"
            onClick={() =>
              append({ price: 0, weight: undefined, unit: undefined })
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

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <span className="loading loading-infinity loading-md"></span>
          ) : (
            "  Save changes"
          )}
        </Button>
      </form>
    </Form>
  )
}

export default EditProductForm
