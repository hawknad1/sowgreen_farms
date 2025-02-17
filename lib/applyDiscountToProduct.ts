import { Product } from "@/types"

// export function applyDiscountToProduct(product: Product): Product {
//   // Check if discount is greater than 0
//   if (product.discount && product.discount > 0) {
//     // Iterate through each variant and calculate discountedPrice
//     const updatedVariants = product.variants.map((variant) => {
//       const discountedPrice =
//         variant.price - variant.price * (product.discount / 100)
//       return {
//         ...variant,
//         discountedPrice: parseFloat(discountedPrice.toFixed(2)), // Round to 2 decimal places
//       }
//     })

//     // Return the updated product object with discountedPrice added to variants
//     return {
//       ...product,
//       variants: updatedVariants,
//     }
//   }

//   // If no discount, return the product as is
//   return product
// }

export function applyDiscountToProducts(products: Product[]): Product[] {
  return products.map((product) => {
    if (product.discount && product.discount > 0) {
      const updatedVariants = product.variants.map((variant) => {
        const discountedPrice =
          variant.price - variant.price * (product.discount / 100)
        return {
          ...variant,
          discountedPrice: parseFloat(discountedPrice.toFixed(2)), // Round to 2 decimal places
        }
      })

      return {
        ...product,
        variants: updatedVariants,
      }
    }
    return product
  })
}
