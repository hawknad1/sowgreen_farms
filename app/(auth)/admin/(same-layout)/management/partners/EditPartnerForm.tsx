import React, { useState } from "react"
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
import { AddPartnerSchema, UpdateCityandFeeSchema } from "@/schemas"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CitiesWithFees } from "@/types"
import { regions } from "@/constants"
import { PartnerType } from "./PartnerForm"
import { toast } from "sonner"

interface Props {
  partner?: PartnerType
}

const EditPartnerForm = ({ partner }: Props) => {
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<z.infer<typeof AddPartnerSchema>>({
    resolver: zodResolver(AddPartnerSchema),
    defaultValues: partner,
  })
  const onSubmit = async (values: z.infer<typeof AddPartnerSchema>) => {
    setIsSaving(true)
    try {
      const res = await fetch(`/api/management/partners/${partner.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        throw new Error("Couldnt update partner")
      }
      toast.success("Partner successfully updated")
      window.location.reload()
    } catch (error) {
      console.log(error)
    } finally {
      setIsSaving(false)
    }
  }
  // updateProduct(values)
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-wrap gap-4">
          {/* Region */}

          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[220px]">
                <FormLabel>Brand Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter brand name"
                    aria-label="Brand"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Owner */}
          <FormField
            control={form.control}
            name="owner"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[180px]">
                <FormLabel>Owner</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter owner"
                    aria-label="Owner"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[120px]">
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter phone"
                    aria-label="Phone"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isSaving} className="w-full">
          {isSaving ? (
            <span className="loading loading-infinity loading-md"></span>
          ) : (
            "Save changes"
          )}
        </Button>
      </form>
    </Form>
  )
}

export default EditPartnerForm
