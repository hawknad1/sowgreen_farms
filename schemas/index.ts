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
  region: z.string({ message: "Region is required" }),
  city: z.string({ message: "City is required" }),
  address: z.string().min(5, { message: "Address is required!" }),
  phone: z.string().regex(phoneRegex, "Invalid Number!"),
})

export const RadioSchema = z.object({
  type: z.enum(["momo-pay", "credit-debit", "cash-on-delivery"], {
    required_error: "You need to select a payment type.",
  }),
})
