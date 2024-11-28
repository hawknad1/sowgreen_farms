// "use client"

// import * as React from "react"
// import { addDays, format } from "date-fns"
// import { CalendarIcon } from "lucide-react"
// import { DateRange } from "react-day-picker"
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Calendar } from "@/components/ui/calendar"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"

// interface DatePickerWithRangeProps {
//   date: DateRange | undefined
//   setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
//   className?: string
// }

// export function DatePicker({
//   className,
//   date,
//   setDate,
// }: DatePickerWithRangeProps) {
//   const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)

//   return (
//     <div className={cn("grid gap-2", className)}>
//       <Popover>
//         <PopoverTrigger asChild>
//           <Button
//             id="date"
//             variant={"outline"}
//             className={cn(
//               "w-[300px] justify-start text-left font-normal",
//               !date && "text-muted-foreground"
//             )}
//           >
//             <CalendarIcon />
//             {date?.from ? (
//               date.to ? (
//                 <>
//                   {format(date.from, "LLL dd, y")} -{" "}
//                   {format(date.to, "LLL dd, y")}
//                 </>
//               ) : (
//                 format(date.from, "LLL dd, y")
//               )
//             ) : (
//               <span>Pick a date</span>
//             )}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-0" align="start">
//           <Calendar
//             initialFocus
//             mode="range"
//             defaultMonth={date?.from}
//             selected={date}
//             onSelect={setDate}
//             numberOfMonths={2}
//           />
//         </PopoverContent>
//       </Popover>
//     </div>
//   )
// }

"use client"

import React from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useDateRangeStore } from "@/store"

export function DatePickerR() {
  const { dateRange, setDateRange } = useDateRangeStore()

  return (
    <div className="relative">
      <DatePicker
        selected={dateRange[0]}
        onChange={(range) => setDateRange(range || [null, null])}
        startDate={dateRange[0]}
        endDate={dateRange[1]}
        selectsRange
        inline
      />
    </div>
  )
}
