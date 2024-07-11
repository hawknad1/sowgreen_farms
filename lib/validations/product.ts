import * as z from "zod";

export const productValidation = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  price: z.number().positive({ message: "Price must be a positive number" }),
  description: z.string().optional(),
  categoryName: z.string().min(1, { message: "Category is required" }),
  // imageUrl: z
  //   .string()
  //   .url({ message: "Image URL must be a valid URL" })
  //   .optional(),
});
