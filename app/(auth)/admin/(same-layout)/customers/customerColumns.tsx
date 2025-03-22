"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { UserDetailType } from "@/types"
import UpdateBalanceDialog from "./UpdatedBalanceDialog"

export const columns: ColumnDef<UserDetailType>[] = [
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Customer Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "orders",
    header: "Address",
    cell: ({ row }) => {
      const orders = row.getValue("orders") as UserDetailType["orders"]
      // const orders = row.getValue("orders") as Order[]

      const address = orders[0]?.shippingAddress?.address || "N/A"
      return <div>{address}</div>
    },
  },
  {
    accessorKey: "orders",
    header: "Phone",
    cell: ({ row }) => {
      const orders = row.getValue("orders") as UserDetailType["orders"]
      const phone = orders[0]?.shippingAddress?.phone || "N/A"
      return <div>{phone}</div>
    },
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => (
      <div
        className={`capitalize ${
          row.original.balance > 0
            ? "text-emerald-500 bg-emerald-500/15 border-emerald-300/15"
            : row.original.balance < 0
            ? "text-red-500 bg-red-500/15 border-red-300/15"
            : "bg-neutral-500/15 border-neutral-200"
        } rounded-full flex justify-start items-center px-3 w-fit border tracking-wide`}
      >
        {formatCurrency(row.original.balance, "GHS")}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const customer = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="gap-1.5 flex flex-col">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <div onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem asChild>
                <UpdateBalanceDialog customer={customer} />
              </DropdownMenuItem>
            </div>

            <Link href={`/admin/customers/${customer.email}`}>
              <Button
                className="bg-black text-white"
                // onClick={() =>
                //   router.push(`/admin/customers/${customer.email}`)
                // }
              >
                Customer Details
              </Button>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
