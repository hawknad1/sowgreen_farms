"use client"

import React, { useState } from "react"
import { SearchIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "../ui/input"
import { Form, FormControl, FormField, FormItem } from "../ui/form"
import { useForm } from "react-hook-form"
import { SearchSchema } from "@/schemas"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const SearchBarInput = () => {
  const form = useForm<z.infer<typeof SearchSchema>>({
    resolver: zodResolver(SearchSchema),
    defaultValues: {
      search: "",
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof SearchSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="search products" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export default SearchBarInput
