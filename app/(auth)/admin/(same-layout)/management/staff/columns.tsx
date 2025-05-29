"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DispatchRider, Staff } from "@/types"
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
import EditStaffDialog from "./EditStaffDialog"
import DeleteStaffDialog from "./DeleteStaffDialog"

export const columns: ColumnDef<Staff>[] = [
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
    accessorKey: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("fullName")}</div>,
  },
  {
    accessorKey: "jobTitle",
    header: "Job Title",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("jobTitle")}</div>
    ),
  },

  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <div className="capitalize">{row.getValue("role")}</div>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("phone")}</div>
    ),
  },

  {
    id: "actions",
    enableHiding: false,
    cell: function ActionCell({ row }) {
      const staff = row.original
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
            <div onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem asChild>
                <EditStaffDialog staff={staff} />
              </DropdownMenuItem>
            </div>

            {/* Prevent closing dropdown on Dialog trigger */}
            {/* <Button
              onClick={() => router.push(`/admin/dispatch-riders/deliveries`)}
            >
              View Deliveries
            </Button> */}

            <DropdownMenuSeparator />

            <DropdownMenuSeparator />
            <div onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem asChild>
                <DeleteStaffDialog staff={staff} />
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
