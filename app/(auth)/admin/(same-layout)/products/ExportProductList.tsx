import { Button } from "@/components/ui/button"
import { exportProducts } from "@/lib/actions/exports/exportProductList"

const ExportProeuctList = () => {
  const handleExport = async () => {
    try {
      // Fetch products from your API endpoint
      const response = await fetch("/api/products")
      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }
      const products = await response.json()
      console.log(products, "PRODUCTS")

      // Generate the Excel file
      const buffer = await exportProducts(products)

      // Convert the buffer to a Blob
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "products.xlsx" // Name of the downloaded file
      a.click()

      // Clean up the URL object
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting products:", error)
      alert("Failed to export products")
    }
  }

  return <Button onClick={handleExport}>Export</Button>
}

export default ExportProeuctList
