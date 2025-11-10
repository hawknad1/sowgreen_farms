// This function assumes your API is running and accessible at the URL in your environment variables.
// It handles fetching from an external or internal API.
// const API_URL = process.env.API_URL || "http://localhost:1337" // Make sure this is set in your .env file!

export const dynamic = "force-dynamic" // Force dynamic rendering

export async function getPopularProducts() {
  try {
    // We fetch the popular products for the main product carousel
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/popular`
      // { cache: "no-store" }
    ) // Revalidate every hour
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    console.error("Failed to fetch popular products:", error)
    return []
  }
}

export async function getCategories() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`,
      { cache: "no-store" }
    )
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return []
  }
}

// NOTE: You likely don't need to fetch ALL orders and customer details on the homepage
// for every visitor. This data is usually fetched on a protected user-specific page.
// We will skip fetching them on the main page for performance reasons.
// If you need them for a logged-in user, this would be handled differently.
