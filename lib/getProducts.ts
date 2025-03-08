export async function getProducts() {
  const res = await fetch("/api/products", {
    method: "GET",
    cache: "no-store",
  })

  if (res.ok) {
    const products = await res.json()
    return products
  }
}
