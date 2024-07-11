"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CldUploadButton } from "next-cloudinary";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { productValidation } from "@/lib/validations/product";

type Category = {
  id: string;
  categoryName: string;
};

const AddProduct = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [publicId, setPublicId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function getCategories() {
      try {
        const res = await fetch("/api/categories", {
          cache: "no-store",
          method: "GET",
        });
        if (res.ok) {
          const categories = await res.json();
          setCategories(categories);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getCategories();
  }, []);

  const form = useForm<z.infer<typeof productValidation>>({
    resolver: zodResolver(productValidation),
    defaultValues: {
      title: "",
      price: null,
      description: "",
      categoryName: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof productValidation>) => {
    try {
      const res = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          imageUrl,
        }),
      });
      if (res.ok) {
        router.push("/products");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeImage = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/removeImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId }),
      });

      if (res.ok) {
        setImageUrl("");
        setPublicId("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-auto p-8 max-w-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Product name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between space-x-5">
            <FormField
              control={form.control}
              name="categoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value)}>
                    <SelectTrigger className="w-[180px] mt-2 mb-3">
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
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input placeholder="Amount" type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Product description" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <div>
            <FormLabel>Product Image</FormLabel>
            <FormControl>
              <CldUploadButton
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                className="h-44 w-full border-dotted border-2 mt-4 grid place-items-center bg-slate-100 rounded-md relative"
                onSuccess={(result: any) => {
                  setImageUrl(result?.info?.url);
                  setPublicId(result?.info?.public_id);
                  console.log(result);
                }}
              >
                <PhotoIcon className="h-6 w-6" />
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt="Image"
                    fill
                    className="absolute object-contain inset-0"
                  />
                )}
              </CldUploadButton>
            </FormControl>
            {publicId && (
              <button
                onClick={removeImage}
                className="bg-red-600 w-fit p-2 rounded-md text-white font-semibold"
              >
                Remove Image
              </button>
            )}
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default AddProduct;
