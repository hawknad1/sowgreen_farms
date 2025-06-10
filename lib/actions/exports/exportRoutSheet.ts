import { formatCurrency } from "@/lib/utils"
import ExcelJS from "exceljs"
import { format, parse } from "date-fns"

interface Order {
  orderNumber: string
  shippingAddress: {
    name?: string
    address?: string
    city?: string
  }
  dispatchRider: {
    firstName?: string
    lastName?: string
  }
  total: number
  deliveryFee: number
  deliveryDate?: Date | string | null
}

// // formatDate.ts
// export function formatDate(
//   date: Date | string | number | null | undefined
// ): string {
//   if (!date) return "N/A" // Fallback for null or undefined dates
//   const parsedDate = new Date(date)
//   if (isNaN(parsedDate.getTime())) return "Invalid Date" // Handle invalid dates
//   return parsedDate.toISOString().split("T")[0] // Format as YYYY-MM-DD
// }

// async function fetchConfirmedOrdersWithDispatchRider(from: Date, to: Date) {
//   try {
//     const queryParams = new URLSearchParams()

//     if (from) queryParams.append("from", from.toISOString())
//     if (to) queryParams.append("to", to.toISOString())
//     queryParams.append("status", "confirmed") // Status filter: "confirmed"

//     const response = await fetch(`/api/orders?${queryParams.toString()}`)

//     if (!response.ok) {
//       throw new Error(`Failed to fetch orders: ${response.statusText}`)
//     }

//     const data = await response.json()

//     // Filter orders where dispatchRider is not null or empty
//     const filteredOrders = data.filter((order: any) => {
//       // Ensure dispatchRider exists and has a valid name
//       const isValid =
//         order.dispatchRider &&
//         order.dispatchRider.firstName?.trim() &&
//         order.dispatchRider.lastName?.trim()
//       console.log(isValid, "filtered")
//       return isValid // Return true for orders that meet this condition
//     })

//     // If from and to dates are the same, filter orders with matching delivery date
//     if (from.toISOString() === to.toISOString()) {
//       const targetDate = from.toISOString().split("T")[0] // Format as YYYY-MM-DD
//       return filteredOrders.filter((order: any) => {
//         const orderDeliveryDate = order.deliveryDate
//           ? new Date(order.deliveryDate).toISOString().split("T")[0]
//           : null
//         return orderDeliveryDate === targetDate
//       })
//     }

//     return filteredOrders
//   } catch (error) {
//     console.error("Error fetching orders:", error)
//     return []
//   }
// }

// export default async function exportDispatchOrdersToExcel(
//   from: Date,
//   to: Date
// ) {
//   console.log("Exporting with dates:", from, to) // Debug logging

//   const orders = await fetchConfirmedOrdersWithDispatchRider(from, to)

//   if (!orders.length) {
//     console.warn("No orders found for the given criteria.")
//     return
//   }

//   const workbook = new ExcelJS.Workbook()

//   // Group orders by delivery date
//   const groupedOrders = orders.reduce((acc: any, order: any) => {
//     const deliveryDate = order.deliveryDate || "No Date"
//     console.log(deliveryDate, "deliveryDate")
//     if (!acc[deliveryDate]) {
//       acc[deliveryDate] = []
//     }
//     acc[deliveryDate].push(order)
//     return acc
//   }, {})

//   // Iterate over each group and create a new worksheet for each delivery date
//   Object.keys(groupedOrders).forEach((deliveryDate) => {
//     const ordersForDate = groupedOrders[deliveryDate]

//     // Create a new worksheet for this delivery date
//     const worksheet = workbook.addWorksheet(deliveryDate)

//     // Add delivery date as a title row
//     const titleRow = worksheet.addRow([`Delivery Date: ${deliveryDate}`])
//     titleRow.font = { bold: true, size: 14 }
//     titleRow.alignment = { horizontal: "center", vertical: "middle" }
//     worksheet.mergeCells(`A${worksheet.rowCount}:E${worksheet.rowCount}`) // Merge the title row across columns
//     titleRow.height = 20 // Set row height for better visibility

//     // Add table headers
//     const headerRow = worksheet.addRow([
//       "Order #",
//       "Customer Name",
//       "Delivery Address",
//       "Dispatch Rider",
//       "Total Amount",
//     ])

//     // Style the header row
//     headerRow.eachCell((cell) => {
//       cell.font = { bold: true }
//       cell.alignment = { horizontal: "center", vertical: "middle" }
//       cell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "686D76" }, // Light red background for headers
//       }
//       cell.border = {
//         top: { style: "thin" },
//         left: { style: "thin" },
//         bottom: { style: "thin" },
//         right: { style: "thin" },
//       }
//     })

//     // Populate the worksheet with order data for this delivery date
//     ordersForDate.forEach((order: any) => {
//       const shippingAddress = `${order.shippingAddress?.address || "N/A"}, ${
//         order.shippingAddress?.city || "N/A"
//       }`

//       worksheet.addRow([
//         order?.orderNumber,
//         order.shippingAddress?.name || "N/A", // Customer Name
//         shippingAddress, // Shipping Address
//         `${order.dispatchRider?.firstName || ""} ${
//           order.dispatchRider?.lastName || ""
//         }`.trim() || "N/A", // Dispatch Rider Name
//         formatCurrency(order?.total + order?.deliveryFee, "GHS") || "0.00", // Total Amount
//       ])
//     })

//     // Adjust column widths
//     worksheet.columns = [
//       { width: 10 }, // Order #
//       { width: 20 }, // Customer Name
//       { width: 32 }, // Shipping Address
//       { width: 17 }, // Dispatch Rider Name
//       { width: 15 }, // Total Amount
//     ]

//     // Add borders to all rows and columns
//     worksheet.eachRow((row) => {
//       row.eachCell((cell) => {
//         cell.border = {
//           top: { style: "thin" },
//           left: { style: "thin" },
//           bottom: { style: "thin" },
//           right: { style: "thin" },
//         }
//       })
//     })

//     // Freeze the header row
//     worksheet.views = [
//       {
//         state: "frozen",
//         ySplit: 2, // Freeze the title and header rows
//       },
//     ]
//   })

//   try {
//     // Generate the file buffer
//     const buffer = await workbook.xlsx.writeBuffer()

//     // Create a Blob and trigger download
//     const blob = new Blob([buffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     })
//     const link = document.createElement("a")
//     link.href = URL.createObjectURL(blob)
//     link.download = `RoutSheet_${from.toISOString().split("T")[0]}_to_${
//       to.toISOString().split("T")[0]
//     }.xlsx`
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//   } catch (error) {
//     console.error("Error exporting Excel file:", error)
//   }
// }

// Helper to fetch orders from the new and improved API
// /lib/actions/exports/exportRoutSheet.ts

// This helper function is correct and remains unchanged.
async function fetchOrdersForExport(from: Date, to: Date) {
  try {
    const queryParams = new URLSearchParams({
      status: "confirmed",
      withDispatchRider: "true",
      deliveryDateFrom: from.toISOString(),
      deliveryDateTo: to.toISOString(),
    })
    const response = await fetch(`/api/orders?${queryParams.toString()}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching orders:", error)
    return []
  }
}

export default async function exportDispatchOrdersToExcel(
  from: Date,
  to: Date
) {
  console.log("Client-side: Export function called with date range:", from, to)

  const orders = await fetchOrdersForExport(from, to)

  // CRITICAL DEBUGGING STEP: Check your browser's developer console (F12).
  console.log("Client-side: Data received from API to be exported:", orders)

  if (!orders || orders.length === 0) {
    alert(
      "Export Failed: No data was found that matches all your criteria (status 'confirmed', an assigned rider, and the selected delivery date range). Please check your data or try a different date range."
    )
    console.warn(
      "Client-side: No orders found for the given criteria. Aborting export."
    )
    return
  }

  console.log(
    `Client-side: Found ${orders.length} orders. Proceeding with Excel generation.`
  )

  const workbook = new ExcelJS.Workbook()
  workbook.creator = "Your App Name"
  workbook.created = new Date()

  // Group orders by a normalized delivery date (YYYY-MM-DD)
  const groupedOrders = orders.reduce(
    (acc: Record<string, any[]>, order: any) => {
      let deliveryDateKey: string
      try {
        // Safely parse the date string
        const cleanedDateString = order.deliveryDate.replace(
          /(\d+)(st|nd|rd|th)/,
          "$1"
        )
        deliveryDateKey = format(
          parse(cleanedDateString, "EEEE, MMM d, yyyy", new Date()),
          "yyyy-MM-dd"
        )
      } catch (e) {
        // If parsing fails, group it under "Invalid Date"
        deliveryDateKey = "Invalid Date"
      }

      // Use the generated key to group orders
      if (!acc[deliveryDateKey]) {
        acc[deliveryDateKey] = []
      }
      acc[deliveryDateKey].push(order)
      return acc
    },
    {}
  )

  // Iterate over each group and create a new worksheet for each delivery date
  for (const dateKey in groupedOrders) {
    const ordersForDate = groupedOrders[dateKey]

    const worksheet = workbook.addWorksheet(dateKey)

    const readableDate =
      dateKey === "Invalid Date"
        ? "Invalid Delivery Date"
        : format(new Date(dateKey), "MMMM d, yyyy")

    const titleRow = worksheet.addRow([`Delivery Date: ${readableDate}`])
    titleRow.font = { bold: true, size: 16 }
    titleRow.alignment = { horizontal: "center" }
    worksheet.mergeCells(1, 1, 1, 5)
    worksheet.getRow(1).height = 25

    const headerRow = worksheet.addRow([
      "Order #",
      "Customer Name",
      "Delivery Address",
      "Dispatch Rider",
      "Total Due",
    ])

    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } } // White Text
    headerRow.height = 20
    headerRow.eachCell((cell) => {
      // Set background to black
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "686D76" }, // Black background
      }

      // Set text alignment
      cell.alignment = { vertical: "middle", horizontal: "center" }

      // Set border to white
      cell.border = {
        top: { style: "thin", color: { argb: "FFFFFFFF" } }, // White border
        left: { style: "thin", color: { argb: "FFFFFFFF" } },
        bottom: { style: "thin", color: { argb: "FFFFFFFF" } },
        right: { style: "thin", color: { argb: "FFFFFFFF" } },
      }
    })

    ordersForDate.forEach((order: any) => {
      const shippingAddress =
        `${order.shippingAddress?.address || ""}, ${
          order.shippingAddress?.city || ""
        }`
          .replace(/^,|,$/g, "")
          .trim() || "N/A"
      const riderName = `${order.dispatchRider?.fullName || ""}`.trim() || "N/A"
      const total = (order.total || 0) + (order.deliveryFee || 0)

      worksheet.addRow([
        order.orderNumber,
        order.shippingAddress?.name || "N/A",
        shippingAddress,
        riderName,
        formatCurrency(total, "GHS"),
      ])
    })

    worksheet.columns = [
      { key: "orderNumber", width: 13 },
      { key: "customerName", width: 25 },
      { key: "address", width: 40 },
      { key: "rider", width: 20 },
      { key: "total", width: 20 },
    ]

    worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
      // Style Header Row (Row 2)
      if (rowNumber === 2) {
        row.height = 20
        row.font = { bold: true, color: { argb: "FFFFFFFF" } }
        row.eachCell({ includeEmpty: true }, function (cell) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF000000" }, // Black background
          }
          cell.alignment = { vertical: "middle", horizontal: "center" }
          cell.border = {
            top: { style: "thin", color: { argb: "FFFFFFFF" } }, // White border
            left: { style: "thin", color: { argb: "FFFFFFFF" } },
            bottom: { style: "thin", color: { argb: "FFFFFFFF" } },
            right: { style: "thin", color: { argb: "FFFFFFFF" } },
          }
        })
      }
      // Style Data Rows (Rows 3 and below)
      else if (rowNumber > 2) {
        row.eachCell({ includeEmpty: true }, function (cell) {
          cell.border = {
            top: { style: "thin", color: { argb: "FF000000" } }, // Black border
            left: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } },
          }
        })
      }
    })
    worksheet.views = [{ state: "frozen", ySplit: 2 }]
  }

  try {
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `RouteSheet_${format(from, "yyyy-MM-dd")}_to_${format(
      to,
      "yyyy-MM-dd"
    )}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error(
      "Client-side: Error generating or downloading Excel file:",
      error
    )
    alert("An error occurred while creating the Excel file.")
  }
}
