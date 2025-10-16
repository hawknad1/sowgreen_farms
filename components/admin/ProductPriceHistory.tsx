// // components/ProductPriceHistory.tsx
// import { useState, useEffect } from "react"
// import { format } from "date-fns"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Skeleton } from "@/components/ui/skeleton"

// interface PriceHistory {
//   id: string
//   oldPrice: number | null
//   newPrice: number
//   changedBy: string
//   changeNote?: string
//   createdAt: string
//   variant?: {
//     weight?: number
//     unit?: string
//   }
// }

// interface PriceHistoryData {
//   productPriceHistory: PriceHistory[]
//   variantPriceHistory: (PriceHistory & {
//     variant: {
//       weight?: number
//       unit?: string
//     }
//   })[]
// }

// interface ProductPriceHistoryProps {
//   productSlug: string
// }

// const ProductPriceHistory = ({ productSlug }: ProductPriceHistoryProps) => {
//   const [priceHistory, setPriceHistory] = useState<PriceHistoryData | null>(
//     null
//   )
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     async function fetchPriceHistory() {
//       try {
//         setLoading(true)
//         const res = await fetch(`/api/products/${productSlug}/price-history`)

//         if (!res.ok) throw new Error("Failed to fetch price history")

//         const data = await res.json()
//         setPriceHistory(data)
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "An error occurred")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchPriceHistory()
//   }, [productSlug])

//   const formatCurrency = (amount: number | null, currency: string = "GHS") => {
//     if (amount === null) return "N/A"
//     return new Intl.NumberFormat("en-GH", {
//       style: "currency",
//       currency: currency,
//     }).format(amount) // assuming prices are stored in cents
//   }

//   const formatDate = (dateString: string) => {
//     return format(new Date(dateString), "PPpp")
//   }

//   if (loading) {
//     return (
//       <Card>
//         <CardHeader>
//           <Skeleton className="h-6 w-48" />
//           <Skeleton className="h-4 w-64" />
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {[...Array(3)].map((_, i) => (
//             <Skeleton key={i} className="h-20 w-full" />
//           ))}
//         </CardContent>
//       </Card>
//     )
//   }

//   if (error) {
//     return (
//       <Card>
//         <CardContent className="pt-6">
//           <div className="text-center text-red-600">
//             Error loading price history: {error}
//           </div>
//         </CardContent>
//       </Card>
//     )
//   }

//   const allHistory = [
//     ...(priceHistory?.productPriceHistory.map((history) => ({
//       ...history,
//       type: "product" as const,
//       variant: undefined,
//     })) || []),
//     ...(priceHistory?.variantPriceHistory.map((history) => ({
//       ...history,
//       type: "variant" as const,
//       variant: history.variant,
//     })) || []),
//   ].sort(
//     (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//   )

//   return (
//     <Card className="border-none shadow-none ">
//       <CardHeader className="py-4 px-0">
//         <CardTitle className="flex items-center  gap-2">
//           Price History
//           <Badge variant="secondary">{allHistory.length} changes</Badge>
//         </CardTitle>
//         <CardDescription>
//           Track all price changes for this product and its variants
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="px-0 py-4">
//         {allHistory.length === 0 ? (
//           <div className="text-center py-8 text-muted-foreground">
//             No price history available
//           </div>
//         ) : (
//           <div className="space-y-4 max-h-80 overflow-y-auto">
//             {allHistory.map((history) => (
//               <div
//                 key={history.id}
//                 className="flex items-start justify-between p-4 border rounded-lg"
//               >
//                 <div className="space-y-1 flex-1">
//                   <div className="flex items-center gap-2">
//                     <span className="font-medium">
//                       {formatCurrency(history.oldPrice)} →{" "}
//                       {formatCurrency(history.newPrice)}
//                     </span>
//                     <Badge variant="outline" className="text-xs">
//                       {history.type === "product" ? "Product" : "Variant"}
//                     </Badge>
//                     {history.type === "variant" && history.variant && (
//                       <Badge variant="secondary" className="text-xs">
//                         {history.variant.weight} {history.variant.unit}
//                       </Badge>
//                     )}
//                   </div>

//                   {history.changeNote && (
//                     <p className="text-sm text-muted-foreground">
//                       {history.changeNote}
//                     </p>
//                   )}

//                   <div className="flex items-center gap-4 text-xs text-muted-foreground">
//                     <span>By: {history.changedBy}</span>
//                     <span>{formatDate(history.createdAt)}</span>
//                   </div>
//                 </div>

//                 <div className="text-right">
//                   <Badge
//                     variant={
//                       (history.oldPrice || 0) > history.newPrice
//                         ? "default"
//                         : "destructive"
//                     }
//                     className="text-xs"
//                   >
//                     {(history.oldPrice || 0) > history.newPrice
//                       ? "Decrease"
//                       : "Increase"}
//                   </Badge>
//                   <div className="text-xs text-muted-foreground mt-1">
//                     {Math.abs(
//                       ((history.newPrice -
//                         (history.oldPrice || history.newPrice)) /
//                         (history.oldPrice || history.newPrice)) *
//                         100
//                     ).toFixed(1)}
//                     %
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }

// export default ProductPriceHistory
