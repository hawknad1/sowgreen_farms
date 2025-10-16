// components/ProductHistory.tsx
import { useState, useEffect } from "react"
import { format } from "date-fns"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Product } from "@/types"

interface ProductHistory {
  id: string
  productId: string
  fieldChanged: string
  oldValue: string | null
  newValue: string | null
  changedBy: string
  changeNote?: string
  createdAt: string
}

interface VariantHistory {
  id: string
  variantId: string
  oldPrice?: number | null
  newPrice?: number
  oldDiscounted?: number | null
  newDiscounted?: number | null
  oldWeight?: number | null
  newWeight?: number | null
  oldUnit?: string | null
  newUnit?: string | null
  changedBy: string
  changeNote?: string
  createdAt: string
}

interface ProductHistoryData {
  productHistory: ProductHistory[]
  variantHistory: VariantHistory[]
}

interface ProductHistoryProps {
  product: Product
}

const ProductHistory = ({ product }: ProductHistoryProps) => {
  const [historyData, setHistoryData] = useState<ProductHistoryData | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const productSlug = product?.slug

  useEffect(() => {
    async function fetchProductHistory() {
      try {
        setLoading(true)
        const res = await fetch(`/api/products/${productSlug}/history`)

        if (!res.ok) throw new Error("Failed to fetch product history")

        const data = await res.json()
        setHistoryData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchProductHistory()
  }, [productSlug])

  console.log(historyData, "historyData")

  const formatCurrency = (amount: number | null, currency: string = "GHS") => {
    if (amount === null || amount === undefined) return "N/A"
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPpp")
  }

  const getFieldDisplayName = (field: string) => {
    const fieldNames: { [key: string]: string } = {
      title: "Product Name",
      description: "Description",
      price: "Price",
      discount: "Discount",
      isInStock: "Stock Status",
      quantity: "Quantity",
      categoryName: "Category",
      partnerId: "Partner",
    }
    return fieldNames[field] || field
  }

  const formatValue = (field: string, value: string | null) => {
    if (value === null || value === undefined || value === "") return "Empty"

    if (field === "price" || field === "discount") {
      return formatCurrency(Number(value))
    }

    if (field === "isInStock") {
      return value === "in-stock" ? "In Stock" : "Out of Stock"
    }

    return value
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            Error loading product history: {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  const allHistory = [
    ...(historyData?.productHistory.map((history) => ({
      ...history,
      type: "product" as const,
    })) || []),
    ...(historyData?.variantHistory.map((history) => ({
      ...history,
      type: "variant" as const,
      fieldChanged: "variant",
    })) || []),
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <Card className=" ">
      <CardHeader className="">
        <CardTitle className="flex items-center gap-2">
          Product History
          <Badge variant="secondary">{allHistory.length} changes</Badge>
        </CardTitle>
        <CardDescription>
          Track all changes made to this product and its variants
        </CardDescription>
      </CardHeader>
      <CardContent>
        {allHistory.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No changes recorded yet
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {allHistory.map((history) => (
              <div
                key={history.id}
                className="flex items-start justify-between p-4 border rounded-lg"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {history.type === "product"
                        ? getFieldDisplayName(history.fieldChanged)
                        : "Variant"}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {history.type === "product" ? "Product" : "Variant"}
                    </Badge>
                  </div>

                  {history.type === "product" ? (
                    // Product history
                    <div className="text-sm">
                      <span className="text-muted-foreground">From: </span>
                      <span className="line-through">
                        {formatValue(history.fieldChanged, history.oldValue)}
                      </span>
                      <span className="text-muted-foreground mx-2">→</span>
                      <span className="font-medium">
                        {formatValue(history.fieldChanged, history.newValue)}
                      </span>
                    </div>
                  ) : (
                    // Variant history
                    <div className="space-y-1 text-sm">
                      {history.oldPrice !== undefined && (
                        <div>
                          <span className="text-muted-foreground">Price: </span>
                          <span className="line-through">
                            {formatCurrency(history.oldPrice)}
                          </span>
                          <span className="text-muted-foreground mx-2">→</span>
                          <span className="font-medium">
                            {formatCurrency(history.newPrice)}
                          </span>
                        </div>
                      )}

                      {history.oldWeight !== undefined && history.newWeight && (
                        <div>
                          <span className="text-muted-foreground">
                            Weight:{" "}
                          </span>
                          <span className="line-through">
                            {history.oldWeight || "Empty"}
                          </span>
                          <span className="text-muted-foreground mx-2">→</span>
                          <span className="font-medium">
                            {history.newWeight || "Empty"}
                          </span>
                        </div>
                      )}

                      {history.oldUnit !== undefined && history.newUnit && (
                        <div>
                          <span className="text-muted-foreground">Unit: </span>
                          <span className="line-through">
                            {history.oldUnit || "Empty"}
                          </span>
                          <span className="text-muted-foreground mx-2">→</span>
                          <span className="font-medium">
                            {history.newUnit || "Empty"}
                          </span>
                        </div>
                      )}

                      {history.oldDiscounted !== undefined &&
                        history.newDiscounted && (
                          <div>
                            <span className="text-muted-foreground">
                              Discounted:{" "}
                            </span>
                            <span className="line-through">
                              {formatCurrency(history.oldDiscounted)}
                            </span>
                            <span className="text-muted-foreground mx-2">
                              →
                            </span>
                            <span className="font-medium">
                              {formatCurrency(history.newDiscounted)}
                            </span>
                          </div>
                        )}
                    </div>
                  )}

                  {history.changeNote &&
                    history.changeNote !== "Variant updated" && (
                      <p className="text-sm text-muted-foreground">
                        Note: {history.changeNote}
                      </p>
                    )}

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>By: {history.changedBy}</span>
                    <span>{formatDate(history.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ProductHistory
