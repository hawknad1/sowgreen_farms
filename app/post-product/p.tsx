"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CldUploadButton,
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
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

// const formSchema = z.object({
//   username: z.string().min(2, {
//     message: "Description must be at least 2 characters.",
//   }),
// });

type Category = {
  id: string;
  categoryName: string;
};

const AddProduct = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [publicId, setPublicId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [categoryName, setCategoryName] = useState("");
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
      description: "",
      price: 0,
      categoryName: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof productValidation>) => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          title,
          imageUrl,
          price,
          categoryName,
          description,
        }),
      });
      if (res.ok) {
        router.push("/");
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

  // const handleImageUpload = (result: CloudinaryUploadWidgetResults) => {
  //   if (result.event === "success") {
  //     const info = result.info;
  //     setImageUrl(info.secure_url);
  //     setPublicId(info.public_id);
  //   }
  // };

  console.log("This is Category Selected", categoryName);

  return (
    <div className="mx-auto p-8 max-w-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product name</FormLabel>
                <FormControl>
                  <Input
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="product name"
                    type="text"
                  />
                </FormControl>
                <div className="flex items-center justify-between space-x-5">
                  <div className="flex-1">
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        onChange={(e) => setPrice(e.target.valueAsNumber)}
                        placeholder="Price"
                        type="number"
                      />
                    </FormControl>
                  </div>
                  <div>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select onValueChange={setCategoryName}>
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
                    </FormControl>
                  </div>
                </div>
                <FormLabel>Product Description</FormLabel>
                <FormControl>
                  <Textarea
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Product description"
                  />
                </FormControl>

                <FormLabel className="">Product Image</FormLabel>
                <CldUploadButton
                  uploadPreset={
                    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
                  }
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
                {publicId && (
                  <button
                    onClick={removeImage}
                    className="bg-red-600 w-fit p-2 rounded-md text-white font-semibold"
                  >
                    Remove Image
                  </button>
                )}
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default AddProduct;
