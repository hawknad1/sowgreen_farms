"use client"

import { useState } from "react"
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
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { AddCityandFeeSchema, AddPartnerSchema } from "@/schemas"
import { regions } from "@/constants"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export type PartnerType = {
  id: string
  brand: string
  owner?: string
  phone: string
}

const PartnerForm = () => {
  const [partner, setPartner] = useState<PartnerType | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof AddPartnerSchema>>({
    resolver: zodResolver(AddPartnerSchema),
    defaultValues: {
      brand: "",
      owner: "",
      phone: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof AddPartnerSchema>) => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/management/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const { error } = await response.json()
        return error
      }

      const newPartner = await response.json()
      setPartner(newPartner)

      form.reset()
      toast.success("Partner added")
      window.location.reload()
    } catch (error) {
      console.error("Error adding city:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-wrap gap-4">
          {/* Brand */}
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
        <Button
          variant="sowgreen"
          type="submit"
          disabled={isSaving}
          className="w-full"
        >
          {isSaving ? (
            <span className="loading loading-infinity loading-md"></span>
          ) : (
            "Add Partner"
          )}
        </Button>
      </form>
    </Form>
  )
}

export default PartnerForm
