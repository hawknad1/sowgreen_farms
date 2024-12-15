import React from "react"
import { PickupOptions } from "./PickupOptions"
import ExportButton from "./ExportButton"
import { DatePickerR } from "./DatePicker"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
// import { DatePickerWithRange } from "./DatePicker"

const Magagement = () => {
  return (
    <div className="bg-white">
      <div className="border border-neutral-200 w-fit m-4 p-2 rounded-lg">
        <PickupOptions />
      </div>

      {/* <ExportButton />
      <DatePickerWithRange /> */}
      {/* <DatePicker /> */}
      {/* <DatePickerR /> */}
    </div>
  )
}

export default Magagement
