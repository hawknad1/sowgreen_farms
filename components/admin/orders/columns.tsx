"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Order, Payment } from "@/types"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { options } from "@/lib/utils"
import { useRouter } from "next/navigation"

export const columns: ColumnDef<Order>[] = [
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
    accessorKey: "orderNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("orderNumber")}</div>,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
      return <div>{date.toLocaleDateString("en-US", options)}</div>
    },
    sortingFn: (rowA, rowB) => {
      const dateA = new Date(rowA.original.createdAt).getTime()
      const dateB = new Date(rowB.original.createdAt).getTime()
      return dateA - dateB // Ascending order
    },
  },

  {
    accessorKey: "shippingAddress.name",
    header: "Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.shippingAddress.name}</div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div
        className={`capitalize px-3 w-fit min-w-16 text-center py-0.5 rounded-3xl ${
          row.original.status === "processing" &&
          "text-yellow-500 bg-yellow-400/15 border border-yellow-300 tracking-wide"
        } 
         ${
           row.original.status === "confirmed" &&
           "text-emerald-500 bg-emerald-500/15 border border-emerald-300 tracking-wide"
         }
        ${
          row.original.status === "in-transit" &&
          "text-cyan-500 bg-cyan-400/15 border border-cyan-300 tracking-wide"
        }
         ${
           row.original.status === "cancelled" &&
           "text-red-500 bg-red-500/15 border border-red-300 tracking-wide"
         } ${
          row.original.status === "delivered" &&
          "text-indigo-500 bg-indigo-500/15 border border-indigo-300 tracking-wide"
        }`}
      >
        {row.getValue("status")}
      </div>
    ),
  },

  {
    accessorKey: "total",
    header: () => <div className="text-right">Total</div>,
    // cell: ({ row }) => {
    //   const amount = parseFloat(row.getValue("total"))
    //   const orderTotal = row.original.deliveryFee + amount

    //   // Format the amount as a currency
    //   const formatted = new Intl.NumberFormat("en-US", {
    //     style: "currency",
    //     currency: "GHS", // Adjust the currency as needed
    //   }).format(orderTotal)

    //   return <div className="text-right font-medium">{formatted}</div>
    // },
    cell: ({ row }) => {
      const total = parseFloat(row.getValue("total"))
      const orderTotal = row.original.deliveryFee + total
      const creditAppliedTotal = row.original.creditAppliedTotal
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "GHS",
      }).format(creditAppliedTotal > 0 ? creditAppliedTotal : orderTotal)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: function ActionCell({ row }) {
      const order = row.original
      const router = useRouter()

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push(`/admin/orders/${order.id}`)}
            >
              <Button>View order</Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
