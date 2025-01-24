"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DispatchRider, Order } from "@/types"
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
import EditRiderDialog from "../dispatch-riders/EditRiderDialog"
import DeleteRiderDialog from "../dispatch-riders/DeleteRiderDialog"

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

  //   {
  //     accessorKey: "shippingAddress.name",
  //     header: ({ column }) => {
  //       return (
  //         <Button
  //           variant="ghost"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         >
  //           Customer Name
  //           <ArrowUpDown className="ml-2 h-4 w-4" />
  //         </Button>
  //       )
  //     },
  //     cell: ({ row }) => <div>{row.getValue("shippingAddress.name")}</div>,
  //   },
  {
    accessorKey: "shippingAddress.name",
    header: "Customer Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.shippingAddress.name}</div>
    ),
    enableHiding: false,
  },
  //   {
  //     accessorKey: "lastName",
  //     header: ({ column }) => {
  //       return (
  //         <Button
  //           variant="ghost"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         >
  //           First Name
  //           <ArrowUpDown className="ml-2 h-4 w-4" />
  //         </Button>
  //       )
  //     },
  //     cell: ({ row }) => <div>{row.getValue("lastName")}</div>,
  //   },

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
            {/* <div onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem asChild>
                <EditRiderDialog rider={rider} />
              </DropdownMenuItem>
            </div> */}

            {/* Prevent closing dropdown on Dialog trigger */}
            <Button onClick={() => router.push(`/admin/orders/${order?.id}`)}>
              View Order
            </Button>

            <DropdownMenuSeparator />

            <DropdownMenuSeparator />
            {/* <div onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem asChild>
                <DeleteRiderDialog location={rider} />
              </DropdownMenuItem>
            </div> */}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
