"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CitiesWithFees, Order, Payment } from "@/types"
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
import DeleteLocationDialog from "./DeleteLocationDialog"
import EditLocationDialog from "./EditLocationDialog"

export const columns: ColumnDef<CitiesWithFees>[] = [
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
    accessorKey: "region",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Region
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("region")}</div>,
  },
  {
    accessorKey: "city",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          City
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("city")}</div>,
  },
  {
    accessorKey: "deliveryFee",
    header: () => <div className="text-right">Delivery Fee</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("deliveryFee"))
      // const orderTotal = row.original.deliveryFee + amount

      // Format the amount as a currency
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "GHS", // Adjust the currency as needed
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: function ActionCell({ row }) {
      const location = row.original
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
            <div onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem asChild>
                <EditLocationDialog location={location} />
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator />
            <div onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem asChild>
                <DeleteLocationDialog location={location} />
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
