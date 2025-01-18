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
  deliveryMethod: z
    .string()
    .min(1, { message: "Delivery method is required!" }),
})

export const PaymentRadioSchema = z.object({
  type: z.enum(["momo-pay", "credit-debit", "cash-on-delivery"], {
    required_error: "You need to select a payment type.",
  }),
})

export const DeliveryRadioSchema = z.object({
  deliveryMethod: z.enum(
    ["wednesday-delivery", "saturday-delivery", "dzorwulu", "dubois", ""],
    {
      required_error: "You need to select a delivery method.",
    }
  ),

  // deliveryMethod: z.string().min(1, "You must select a delivery method."),
  // pickupOption: z.string().optional(),
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
  imageUrl: z.string().optional(),
  images: z
    .array(
      z.object({
        productImageUrl: z.string(),
        publicId: z.string(),
      })
    )
    .optional(),
  categoryName: z.string().min(1, { message: "Category is required!" }),
  isInStock: z.string(),
  quantity: z.coerce.number().positive().optional(),
  variants: z.array(
    z.object({
      weight: z.coerce.number().positive().optional(),
      price: z.coerce.number().positive().optional(),
      unit: z.string(),
      quantity: z.coerce.number().positive().optional(),
    })
  ),
})

// export const AddProductSchema = z.object({
//   title: z.string().min(2, { message: "Title is required!" }),
//   description: z.string().min(5, { message: "Description is required!" }),
//   discount: z.coerce.number().optional(),
//   imageUrl: z.string(),
//   images: z
//     .array(
//       z.object({
//         productImageUrl: z.string(),
//         publicId: z.string(),
//       })
//     )
//     .optional(),
//   price: z.coerce.number().positive().optional(),
//   weight: z.coerce.number().positive().optional(),
//   unit: z.string(),
//   categoryName: z.string().min(1, { message: "Category is required!" }),
//   quantity: z.coerce.number().positive().optional(),
//   isInStock: z.string(),
//   variants: z.array(
//     z.object({
//       weight: z.number().positive("Weight must be greater than 0"),
//       price: z.number().positive("Price must be greater than 0"),
//       unit: z.string().min(1, "Unit is required"),
//       quantity: z.number().int().positive("Quantity must be greater than 0"),
//     })
//   ),
// })

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

// export const UpdateStatusSchema = z.object({
//   status: z.string(),
//   dispatchRider: z.string().optional(),
// })

export const UpdateStatusSchema = z.object({
  status: z.enum([
    "processing",
    "confirmed",
    "in-transit",
    "delivered",
    "cancelled",
  ]),
  dispatchRider: z.string().optional(),
})

export const SearchSchema = z.object({
  search: z.string(),
})

export const AddImagesSchema = z.object({
  images: z.array(
    z.object({
      url: z.string().url(),
      publicId: z.string(),
    })
  ),
})

const ProductImageSchema = z.object({
  productImageUrl: z.string().url(), // URL validation for the image
  publicId: z.string(), // ID for managing the image
})

export const ImageSchema = z.object({
  images: z.string().url(), // URL validation for the image
})

export const CreditSchema = z
  .object({
    email: z.string().email("Invalid email address").nullable().optional(), // Allow null or undefined
    phone: z
      .string()
      .regex(/^[0-9]{10,15}$/, "Invalid phone number")
      .nullable()
      .optional(), // Allow null or undefined
    amount: z
      .string()
      .transform((val) => parseFloat(val)) // Transform string to a number
      .refine((val) => !isNaN(val) && val > 0, {
        message: "Amount must be a valid number greater than 0",
      }),
  })
  .refine((data) => data.email || data.phone, {
    message: "Either email or phone number must be provided",
    path: ["email"], // Show the error on the email field
  })

// // Define the main schema that includes an array of images
// export const AddImagesSchema = z.object({
//   images: z.array(ProductImageSchema), // Array of image objects
// })

export const EditOrderDetailSchema = z.object({
  deliveryMethod: z.string(),
  paymentAction: z.string(),
  deliveryDate: z.string(),
})

export const AddCityandFeeSchema = z.object({
  city: z.string().min(1, { message: "City is required!" }),
  deliveryFee: z.coerce.number(),
  region: z.string().min(1, { message: "Region is required!" }),
})

export const UpdateCityandFeeSchema = z.object({
  city: z.string().min(1, { message: "City is required!" }),
  deliveryFee: z.coerce.number(),
  region: z.string().min(1, { message: "Region is required!" }),
})

// export const UpdateRiderSchema = z.object({
//   gender: z.string().min(1, { message: "Gender is required!" }),
//   firstName: z.string(),
//   lastName: z.string().optional(),
//   phone: z.string().regex(phoneRegex, "Invalid Number!"),
// })

export const UpdateRiderSchema = z.object({
  firstName: z.string().nonempty("First Name is required"),
  lastName: z.string().nonempty("Last Name is required"),
  phone: z
    .string()
    .nonempty("Phone number is required")
    .regex(/^\d+$/, "Phone must be numeric"),
  gender: z.string().optional(),
})

export const AddLocationSchema = z.object({
  region: z.string().optional(),
  city: z.string().optional(),
  address: z.string().min(1, { message: "Address is required!" }),
})

export const AddOrderSchema = z.object({
  name: z.string().min(1, { message: "Name is required!" }),
  email: z.string().email({ message: "Email is required!" }),
  region: z.string().min(2, { message: "Region is required!" }),
  city: z.string().min(2, { message: "City is required!" }),
  address: z.string().min(5, { message: "Address is required!" }),
  phone: z.string().regex(phoneRegex, "Invalid Number!"),
  deliveryMethod: z
    .string()
    .min(1, { message: "Delivery method is required!" }),
})

export const stepOneSchema = z.object({
  title: z.string().min(2, { message: "Title is required!" }),
  description: z.string().min(5, { message: "Description is required!" }),
  categoryName: z.string().min(1, { message: "Category is required!" }),
  discount: z.coerce.number().optional(),
  isInStock: z.string(),
  quantity: z.coerce.number().positive().optional(),
})

export const stepTwoSchema = z.object({
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

export const stepThreeSchema = z.object({
  imageUrl: z.string().optional(),
  images: z
    .array(
      z.object({
        productImageUrl: z.string(),
        publicId: z.string(),
      })
    )
    .optional(),
})

// export const editDeliveryMethod = z.object({
//   address: z.string(),
//   city: z.string(),
//   region: z.string(),
//   deliveryMethod: z.string(),
//   deliveryFee: z.coerce.number(),
// })

export const editDeliveryMethod = z.object({
  address: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  deliveryMethod: z.string(),
  deliveryFee: z.coerce.number(),
  pickupOption: z.string().optional(), // Add pickupOption field
})
