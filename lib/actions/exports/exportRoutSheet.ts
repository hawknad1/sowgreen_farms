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
  workbook.creator = "Sowgreen Farms"
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
    worksheet.mergeCells(1, 1, 1, 7)
    worksheet.getRow(1).height = 25

    const headerRow = worksheet.addRow([
      "Order #",
      "Customer Name",
      "Delivery Address",
      "Dispatch Rider",
      "Total Due",
      "Payment Mode",
      "Action",
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
      const balance = Math.abs(order?.creditAppliedTotal)
      const paymentAction = order?.paymentAction.includes("pending")
        ? ""
        : order?.paymentAction.toUpperCase()
      const paymentMode =
        order?.paymentMode.includes("cash") &&
        order?.paymentAction.includes("pending")
          ? ""
          : order?.paymentMode.toUpperCase()

      worksheet.addRow([
        order.orderNumber,
        order.shippingAddress?.name || "N/A",
        shippingAddress,
        riderName,
        formatCurrency(total + balance, "GHS"),
        paymentMode,
        paymentAction,
      ])
    })

    worksheet.columns = [
      { key: "orderNumber", width: 13 },
      { key: "customerName", width: 25 },
      { key: "address", width: 40 },
      { key: "rider", width: 20 },
      { key: "total", width: 20 },
      { key: "paymentMode", width: 20 },
      { key: "paymentAction", width: 20 },
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
