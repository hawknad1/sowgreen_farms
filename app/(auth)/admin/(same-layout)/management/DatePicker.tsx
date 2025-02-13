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
