import { Button } from "@/components/ui/button"
import { Product } from "@/types"
import { useState } from "react"
import debounce from "lodash/debounce"

const ProductSelection = ({ basket, addToBasket }: any) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/products?query=${searchQuery}`)
      const data = await response.json()
      setProducts(Array.isArray(data) ? data : []) // Ensure data is an array
    } catch (error) {
      console.error("Error fetching products:", error)
      setProducts([]) // Fallback to empty array
    }
  }

  const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    fetchProducts()
  }, 300)

  const handleAddToBasket = (product: Product) => {
    addToBasket(product)
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearch}
          className="border p-2 rounded"
        />
        <div className="grid grid-cols-2 gap-2 ">
          {Array.isArray(products) &&
            products.map((product: Product) => (
              <div
                key={product.id}
                className="flex justify-between items-center p-2 border rounded"
              >
                <span>{product.title}</span>
                <div className="flex">
                  <span>{product.weight}</span>
                  <span>{product.unit}</span>
                </div>
                <span>{product.price}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddToBasket(product)}
                >
                  Add
                </Button>
              </div>
            ))}
        </div>
      </div>
      <div className="mt-4">
        <h4>Basket</h4>
        <ul>
          {basket.map((item: any, index: number) => (
            <li key={index} className="flex justify-between">
              {item.title} (x{item.quantity})
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ProductSelection
