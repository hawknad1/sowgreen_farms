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
      // Explicitly cast the value to a string
      const dateString = row.getValue("deliveryDate") as string

      // Preprocess the date string to make it parsable by the Date constructor
      const formattedDateString = dateString.replace(/(\d+)(st|nd|rd|th)/, "$1")

      // Append the current year to the date string (if not already present)
      const dateWithYear = formattedDateString.includes(",")
        ? `${formattedDateString}, ${new Date().getFullYear()}`
        : formattedDateString

      const date = new Date(dateWithYear)

      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
      return <div>{date.toLocaleDateString("en-UK", options)}</div>
    },
    sortingFn: (rowA, rowB) => {
      // Helper function to preprocess date strings
      const formatDateString = (dateString: string) => {
        const formatted = dateString.replace(/(\d+)(st|nd|rd|th)/, "$1")
        return formatted.includes(",")
          ? `${formatted}, ${new Date().getFullYear()}`
          : formatted
      }

      // Explicitly cast the values to strings
      const dateA = new Date(
        formatDateString(rowA.original.deliveryDate as string)
      ).getTime()
      const dateB = new Date(
        formatDateString(rowB.original.deliveryDate as string)
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
