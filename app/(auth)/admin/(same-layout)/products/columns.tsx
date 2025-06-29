"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Product } from "@/types"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation" // Ensure router is imported
import EditPartnerDialog from "../management/partners/EditPartnerDialog"
import DeletePartnerDialog from "../management/partners/DeletePartnerDialog"
import DeleteProductDialog from "@/components/admin/products/DeleteProductDialog"
import EditProduct from "@/components/admin/products/EditProduct"

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
            ? "indeterminate"
            : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "categoryName",
    header: "Category",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("categoryName")}</div>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      // const price = parseFloat(row.getValue("price"))
      const price = row.original.variants[0]?.price
      const formattedPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "GHS", // Currency formatted to GHC
      }).format(price)
      return <div className="capitalize">{formattedPrice}</div>
    },
  },
  {
    accessorKey: "isInStock",
    header: "In Stock",
    cell: ({ row }) => {
      const isInStock = row.original.isInStock === "in-stock" // Compare string to string
      return (
        <div
          className={`capitalize  text-center rounded-full ${
            isInStock
              ? "bg-emerald-500/15 w-[95px] text-emerald-500 px-3 py-0.5 font-medium"
              : "bg-gray-500/15 text-gray-500 w-[100px] text-sm px-1.5 py-0.5 font-medium"
          }`}
        >
          {isInStock ? "In Stock" : "Out of Stock"}
        </div>
      )
    },
  },

  {
    accessorKey: "discount",
    header: "Discount",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.discount <= 0 ? 0 : row.original.discount}
      </div>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => {
      const quantity = parseInt(row.getValue("quantity"))
      return <div className="capitalize">{quantity}</div>
    },
  },

  {
    accessorKey: "total",
    header: () => <div className="text-right">Total</div>,
    cell: ({ row }) => {
      const price = row.original.variants[0]?.price
      const quantity = parseInt(row.getValue("quantity"))

      // Ensure both price and quantity are valid numbers before calculation
      const total = !isNaN(price) && !isNaN(quantity) ? price * quantity : 0

      // Format the amount as a currency amount in GHC
      const formattedTotal = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "GHC", // Currency formatted to GHC
      }).format(total)

      return <div className="text-right font-medium">{formattedTotal}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: function ActionCell({ row }) {
      const product = row.original
      const router = useRouter()

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="lg:w-[200px] lg:p-2">
            <DropdownMenuLabel>Product Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push(`/admin/products/${product.id}`)}
            >
              <div className="flex justify-center items-center gap-2 w-full">
                <Eye className="h-4 w-4 text-gray-700" />
                <span className="text-sm text-black">View Product</span>
              </div>
            </Button>
            <DropdownMenuSeparator />

            {/* Prevent closing dropdown on Dialog trigger */}
            <div onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem asChild>
                <EditProduct
                  product={product}
                  className="w-full justify-start px-2 py-1.5 hover:bg-gray-100"
                  variant="ghost"
                />
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator />
            <div onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem asChild>
                <DeleteProductDialog product={product} />
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
