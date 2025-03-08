"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ShippingAddress } from "@/types"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserType } from "./data-table"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"

export const columns: ColumnDef<UserType>[] = [
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
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Customer Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
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
      const orders = row.getValue("orders") as UserType["orders"]
      const address = orders[0]?.shippingAddress?.address || "N/A"
      return <div>{address}</div>
    },
  },
  {
    accessorKey: "orders",
    header: "Phone",
    cell: ({ row }) => {
      const orders = row.getValue("orders") as UserType["orders"]
      const phone = orders[0]?.shippingAddress?.phone || "N/A"
      return <div>{phone}</div>
    },
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => {
      const balance = parseFloat(row.getValue("balance"))
      return (
        <div
          className={`capitalize rounded-full w-full flex justify-center items-center py-1 font-medium px-1 ${
            balance > 0
              ? "text-emerald-500 bg-emerald-500/15"
              : "bg-neutral-500/15 text-neutral-500"
          }`}
        >
          {formatCurrency(balance, "GHS")}
        </div>
      )
    },
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
