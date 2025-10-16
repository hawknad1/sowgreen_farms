"use client"

import React from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useDateRangeStore } from "@/store"

// export function DatePickerR() {
//   const { dateRange, setDateRange } = useDateRangeStore()

//   return (
//     <div className="relative">
//       <DatePicker
//         selected={dateRange[0]}
//         onChange={(range) => setDateRange(range || [null, null])}
//         startDate={dateRange[0]}
//         endDate={dateRange[1]}
//         selectsRange
//         inline
//       />
//     </div>
//   )
// }

import "../../../../../components/date-picker-custom.css" // Custom CSS file for additional styling

// export function DatePickerR() {
//   const { dateRange, setDateRange } = useDateRangeStore()

//   return (
//     <div className="w-full flex justify-center">
//       <style jsx global>{`
//         .react-datepicker {
//           font-family: inherit;
//           border: none;
//           box-shadow: none;
//           background-color: transparent;
//         }

//         .react-datepicker__header {
//           background-color: transparent;
//           border-bottom: 1px solid hsl(var(--border));
//           padding-top: 0.5rem;
//         }

//         .react-datepicker__current-month {
//           font-weight: 600;
//           color: hsl(var(--foreground));
//           margin-bottom: 0.5rem;
//         }

//         .react-datepicker__day-name {
//           color: hsl(var(--muted-foreground));
//           font-weight: 600;
//           width: 2.5rem;
//           line-height: 2.5rem;
//           font-size: 0.75rem;
//         }

//         .react-datepicker__day {
//           width: 2.5rem;
//           line-height: 2.5rem;
//           margin: 0.2rem;
//           border-radius: 0.375rem;
//           color: hsl(var(--foreground));
//           transition: all 0.15s ease;
//         }

//         .react-datepicker__day:hover {
//           background-color: hsl(var(--accent));
//           color: hsl(var(--accent-foreground));
//         }

//         .react-datepicker__day--selected,
//         .react-datepicker__day--keyboard-selected {
//           background-color: hsl(var(--primary));
//           color: hsl(var(--primary-foreground));
//           font-weight: 600;
//         }

//         .react-datepicker__day--in-range,
//         .react-datepicker__day--in-selecting-range {
//           background-color: hsl(var(--primary) / 0.15);
//           color: hsl(var(--foreground));
//           border-radius: 0;
//         }

//         .react-datepicker__day--range-start,
//         .react-datepicker__day--range-end {
//           background-color: hsl(var(--primary));
//           color: hsl(var(--primary-foreground));
//           font-weight: 600;
//         }

//         .react-datepicker__day--range-start {
//           border-top-right-radius: 0;
//           border-bottom-right-radius: 0;
//         }

//         .react-datepicker__day--range-end {
//           border-top-left-radius: 0;
//           border-bottom-left-radius: 0;
//         }

//         .react-datepicker__day--outside-month {
//           color: hsl(var(--muted-foreground));
//           opacity: 0.4;
//         }

//         .react-datepicker__day--disabled {
//           color: hsl(var(--muted-foreground));
//           opacity: 0.3;
//           cursor: not-allowed;
//         }

//         .react-datepicker__day--today {
//           font-weight: 700;
//           position: relative;
//         }

//         .react-datepicker__day--today::after {
//           content: "";
//           position: absolute;
//           bottom: 2px;
//           left: 50%;
//           transform: translateX(-50%);
//           width: 4px;
//           height: 4px;
//           border-radius: 50%;
//           background-color: hsl(var(--primary));
//         }

//         .react-datepicker__navigation {
//           top: 0.75rem;
//         }

//         .react-datepicker__navigation-icon::before {
//           border-color: hsl(var(--foreground));
//         }

//         .react-datepicker__month-container {
//           padding: 0.5rem;
//         }
//       `}</style>

//       <DatePicker
//         selected={dateRange[0]}
//         onChange={(range) => setDateRange(range || [null, null])}
//         startDate={dateRange[0]}
//         endDate={dateRange[1]}
//         selectsRange
//         inline
//       />
//     </div>
//   )
// }

export function DatePickerR() {
  const { dateRange, setDateRange } = useDateRangeStore()

  return (
    <div className="w-full flex justify-center">
      <style jsx global>{`
        .react-datepicker {
          font-family: inherit;
          border: none;
          box-shadow: none;
          background-color: transparent;
          font-size: 0.875rem;
        }

        .react-datepicker__header {
          background-color: transparent;
          border-bottom: 1px solid hsl(var(--border));
          padding-top: 0.5rem;
        }

        .react-datepicker__current-month {
          font-weight: 600;
          color: hsl(var(--foreground));
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .react-datepicker__day-name {
          color: hsl(var(--muted-foreground));
          font-weight: 600;
          width: 2rem;
          line-height: 2rem;
          font-size: 0.7rem;
        }

        .react-datepicker__day {
          width: 2rem;
          line-height: 2rem;
          margin: 0.15rem;
          border-radius: 0.25rem;
          color: hsl(var(--foreground));
          transition: all 0.15s ease;
          font-size: 0.8rem;
        }

        .react-datepicker__day:hover {
          background-color: hsl(var(--accent));
          color: hsl(var(--accent-foreground));
        }

        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          font-weight: 600;
        }

        .react-datepicker__day--in-range,
        .react-datepicker__day--in-selecting-range {
          background-color: hsl(var(--primary) / 0.15);
          color: hsl(var(--foreground));
          border-radius: 0;
        }

        .react-datepicker__day--range-start,
        .react-datepicker__day--range-end {
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          font-weight: 600;
        }

        .react-datepicker__day--range-start {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }

        .react-datepicker__day--range-end {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }

        .react-datepicker__day--outside-month {
          color: hsl(var(--muted-foreground));
          opacity: 0.4;
        }

        .react-datepicker__day--disabled {
          color: hsl(var(--muted-foreground));
          opacity: 0.3;
          cursor: not-allowed;
        }

        .react-datepicker__day--today {
          font-weight: 700;
          position: relative;
        }

        .react-datepicker__day--today::after {
          content: "";
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background-color: hsl(var(--primary));
        }

        .react-datepicker__navigation {
          top: 0.5rem;
          width: 1.5rem;
          height: 1.5rem;
        }

        .react-datepicker__navigation-icon::before {
          border-color: hsl(var(--foreground));
          height: 6px;
          width: 6px;
        }

        .react-datepicker__month-container {
          padding: 0.25rem;
        }

        .react-datepicker__month {
          margin: 0.25rem;
        }
      `}</style>

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
