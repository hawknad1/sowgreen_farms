"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Order } from "@/types"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { format, parse } from "date-fns"

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
    header: "Order #",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.orderNumber}</div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "deliveryDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Delivery Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const dateString = row.getValue("deliveryDate") as string

      // Remove the ordinal suffix (e.g., "nd" in "22nd")
      const cleanedDateString = dateString.replace(/(\d+)(st|nd|rd|th)/, "$1")

      // Parse the date string into a Date object
      const date = parse(cleanedDateString, "EEEE, MMM d, yyyy", new Date())

      // Format the date in a human-readable way (e.g., "22 Feb 2025")
      const formattedDate = format(date, "dd MMM yyyy")

      return <div>{formattedDate}</div>
    },
    sortingFn: (rowA, rowB) => {
      const formatDateString = (dateString: string) => {
        // Remove the ordinal suffix
        const cleanedDateString = dateString.replace(/(\d+)(st|nd|rd|th)/, "$1")
        return cleanedDateString
      }

      // Parse the date strings into Date objects
      const dateA = parse(
        formatDateString(rowA.original.deliveryDate as string),
        "EEEE, MMM d, yyyy",
        new Date()
      ).getTime()
      const dateB = parse(
        formatDateString(rowB.original.deliveryDate as string),
        "EEEE, MMM d, yyyy",
        new Date()
      ).getTime()

      return dateA - dateB // Ascending order
    },
  },
  {
    accessorKey: "shippingAddress.name",
    header: "Customer Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.shippingAddress.name}</div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <div className="capitalize">{`${row.original.shippingAddress.address}, ${row.original.shippingAddress.city}`}</div>
    ),
  },
  {
    accessorKey: "dispatchRider",
    header: "Dispatch Rider",
    cell: ({ row }) => (
      <div className="capitalize">{`${row.original.dispatchRider.firstName} ${row.original.dispatchRider.lastName}`}</div>
    ),
    filterFn: (row, columnId, filterValue) => {
      const riderName = row.original.dispatchRider.firstName.toLowerCase()
      return riderName.includes(filterValue.toLowerCase())
    },
  },
  {
    accessorKey: "total",
    header: () => <div className="text-right">Total</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total"))
      const orderTotal = row.original.deliveryFee + amount

      // Format the amount as a currency
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "GHS", // Adjust the currency as needed
      }).format(orderTotal)

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

            {/* Prevent closing dropdown on Dialog trigger */}
            <Button onClick={() => router.push(`/admin/orders/${order?.id}`)}>
              View Order
            </Button>

            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
