import * as z from "zod"

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email is required!" }),
  password: z.string().min(1, { message: "Password is required!" }),
})

export const RegisterSchema = z.object({
  name: z.string().min(1, { message: "Name is required!" }),
  email: z.string().email({ message: "Email is required!" }),
  password: z.string().min(6, { message: "Minimum 6 characters!" }),
})

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
)

const schema = z.object({
  phone: z.string().regex(phoneRegex, "Invalid Number!"),
})

export const CheckoutSchema = z.object({
  name: z.string().min(1, { message: "Name is required!" }),
  email: z.string().email({ message: "Email is required!" }),
  country: z.string({ message: "Country is required" }),
  region: z.string().min(2, { message: "Region is required!" }),
  city: z.string().min(2, { message: "City is required!" }),
  address: z.string().min(5, { message: "Address is required!" }),
  phone: z.string().regex(phoneRegex, "Invalid Number!"),
})

export const PaymentRadioSchema = z.object({
  type: z.enum(["momo-pay", "credit-debit", "cash-on-delivery"], {
    required_error: "You need to select a payment type.",
  }),
})

export const DeliveryRadioSchema = z.object({
  deliveryMethod: z.enum(
    ["same-day-delivery", "next-day-delivery", "dzorwulu", "dubois"],
    {
      required_error: "You need to select a delivery method.",
    }
  ),
})

export const DriverRadioSchema = z.object({
  dispatchRider: z.enum(
    ["pick-up", "Nana Kwame", "John Doe", "Kwaku D", "Julius Oppong"],
    {
      required_error: "You need to select a dispatch rider.",
    }
  ),
})

export const AddProductSchema = z.object({
  title: z.string().min(2, { message: "Title is required!" }),
  description: z.string().min(5, { message: "Description is required!" }),
  discount: z.coerce.number().optional(),
  imageUrl: z.string(),
  price: z.coerce.number().positive().optional(),
  weight: z.coerce.number().positive().optional(),
  unit: z.string(),
  categoryName: z.string().min(1, { message: "Category is required!" }),
  quantity: z.coerce.number().positive().optional(),
  isInStock: z.string(),
})

export const EditProductSchema = z.object({
  title: z.string().optional(),
  description: z
    .string()
    .min(5, { message: "Description is required!" })
    .optional(),
  discount: z.coerce.number().optional(),
  price: z.coerce.number().positive().optional(),
  weight: z.coerce.number().optional(),
  unit: z.string(),
  quantity: z.coerce.number().positive().optional(),
  isInStock: z.string().optional(),
})

export const UpdateStatusSchema = z.object({
  status: z.string(),
  dispatchRider: z.string(),
})

export const SearchSchema = z.object({
  search: z.string(),
})
