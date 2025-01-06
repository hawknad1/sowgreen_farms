export const transformCart = async (cart: any[]) => {
  // Fetch product details for each productId in the cart
  const productPromises = cart.map((item) =>
    fetch(`/api/products/${item.productId}`)
      .then((response) => response.json()) // Parse the JSON response
      .then((product) => ({
        ...item,
        product: {
          categoryName: product.categoryName,
          description: product.description,
          title: product.title,
        }, // Only include the specific properties you need
      }))
      .catch((error) => {
        console.error(`Error fetching product ${item.productId}:`, error)
        return { ...item, product: null } // Fallback if fetching fails
      })
  )

  // Wait for all product details to be fetched
  const cartWithProducts = await Promise.all(productPromises)

  // Transform the cart
  return cartWithProducts.map((item) => ({
    item: {
      price: item.price,
      productId: item.productId,
      quantity: item.quantity,
      unit: item.unit,
      variantId: item.variantId,
      weight: item.weight,
      product: item.product, // Include the filtered product details
    },
    quantity: item.quantity, // Top-level quantity
    total: (item.price * item.quantity).toFixed(2), // Total as a string
  }))
}
