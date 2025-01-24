// import { Order } from "@/types"
// import ExcelJS from "exceljs"

// // Fetch orders assigned to a dispatch rider
// async function fetchOrdersForDispatchRider(from: Date, to: Date) {
//   try {
//     const queryParams = new URLSearchParams()

//     if (from) queryParams.append("from", from.toISOString())
//     if (to) queryParams.append("to", to.toISOString())
//     queryParams.append("status", "assigned") // Fetch orders with the status "assigned"

//     const response = await fetch(`/api/orders?${queryParams.toString()}`)

//     if (!response.ok) {
//       throw new Error(`Failed to fetch orders: ${response.statusText}`)
//     }

//     const data = await response.json()
//     return data // Return orders assigned to dispatch riders
//   } catch (error) {
//     console.error("Error fetching orders:", error)
//     return []
//   }
// }

// export default async function exportDispatchOrdersToExcel(
//   from: Date,
//   to: Date
// ) {
//   const orders = await fetchOrdersForDispatchRider(from, to)

//   if (!orders.length) {
//     console.warn("No orders found for the given criteria.")
//     return
//   }

//   const workbook = new ExcelJS.Workbook()
//   const worksheet = workbook.addWorksheet("Dispatch Orders")

//   // Add table headers
//   worksheet.addRow([
//     "Customer Name",
//     "Shipping Address",
//     "Dispatch Rider Name",
//     "Total Amount",
//   ])

//   // Style the header row
//   worksheet.getRow(1).eachCell((cell) => {
//     cell.font = { bold: true }
//     cell.alignment = { horizontal: "center", vertical: "middle" }
//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "FFCDD2" }, // Light red background for headers
//     }
//     cell.border = {
//       top: { style: "thin" },
//       left: { style: "thin" },
//       bottom: { style: "thin" },
//       right: { style: "thin" },
//     }
//   })

//   // Populate the worksheet with order data
//   orders.forEach((order: Order) => {
//     worksheet.addRow([
//       order.shippingAddress.name,
//       order.shippingAddress.address,
//       order.dispatchRider?.firstName || "N/A", // Handle missing dispatch rider name
//       order.total.toFixed(2), // Format total as a fixed-point number
//     ])
//   })

//   // Adjust column widths
//   worksheet.columns = [
//     { width: 25 }, // Customer Name
//     { width: 40 }, // Shipping Address
//     { width: 25 }, // Dispatch Rider Name
//     { width: 15 }, // Total Amount
//   ]

//   // Add borders to all rows and columns
//   worksheet.eachRow((row, rowIndex) => {
//     row.eachCell((cell) => {
//       cell.border = {
//         top: { style: "thin" },
//         left: { style: "thin" },
//         bottom: { style: "thin" },
//         right: { style: "thin" },
//       }
//     })
//   })

//   // Freeze the header row
//   worksheet.views = [
//     {
//       state: "frozen",
//       ySplit: 1, // Freeze the header row
//     },
//   ]

//   // Export the workbook
//   const buffer = await workbook.xlsx.writeBuffer()

//   // Trigger file download
//   const blob = new Blob([buffer], {
//     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   })
//   const link = document.createElement("a")
//   link.href = URL.createObjectURL(blob)
//   link.download = `DispatchOrders_${from.toISOString().split("T")[0]}_to_${
//     to.toISOString().split("T")[0]
//   }.xlsx`
//   document.body.appendChild(link)
//   link.click()
//   document.body.removeChild(link)
// }

import { formatDate } from "@/lib/formatDate"
import { formatCurrency } from "@/lib/utils"
import ExcelJS from "exceljs"

// Fetch orders with "confirmed" status and non-empty dispatchRider field
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

//     console.log(data, "dattaaaa")

//     // Filter orders where dispatchRider is not null or empty
//     return data.filter((order: any) => {
//       const filtered = order.dispatchRider && order.dispatchRider.name?.trim()
//       console.log(filtered, "filtered")
//     })
//   } catch (error) {
//     console.error("Error fetching orders:", error)
//     return []
//   }
// }
async function fetchConfirmedOrdersWithDispatchRider(from: Date, to: Date) {
  try {
    const queryParams = new URLSearchParams()

    if (from) queryParams.append("from", from.toISOString())
    if (to) queryParams.append("to", to.toISOString())
    queryParams.append("status", "confirmed") // Status filter: "confirmed"

    const response = await fetch(`/api/orders?${queryParams.toString()}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`)
    }

    const data = await response.json()

    console.log(data, "dattaaaa")

    // Filter orders where dispatchRider is not null or empty
    const filteredOrders = data.filter((order: any) => {
      // Ensure dispatchRider exists and has a valid name
      const isValid =
        order.dispatchRider &&
        order.dispatchRider.firstName?.trim() &&
        order.dispatchRider.lastName?.trim()
      console.log(isValid, "filtered")
      return isValid // Return true for orders that meet this condition
    })

    return filteredOrders
  } catch (error) {
    console.error("Error fetching orders:", error)
    return []
  }
}

// export default async function exportDispatchOrdersToExcel(
//   from: Date,
//   to: Date
// ) {
//   const orders = await fetchConfirmedOrdersWithDispatchRider(from, to)

//   if (!orders.length) {
//     console.warn("No orders found for the given criteria.")
//     return
//   }

//   const workbook = new ExcelJS.Workbook()
//   const worksheet = workbook.addWorksheet("Dispatch Orders")

//   // Add table headers
//   worksheet.addRow([
//     "Customer Name",
//     "Shipping Address",
//     "Dispatch Rider Name",
//     "Total Amount",
//   ])

//   // Style the header row
//   worksheet.getRow(1).eachCell((cell) => {
//     cell.font = { bold: true }
//     cell.alignment = { horizontal: "center", vertical: "middle" }
//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "FFCDD2" }, // Light red background for headers
//     }
//     cell.border = {
//       top: { style: "thin" },
//       left: { style: "thin" },
//       bottom: { style: "thin" },
//       right: { style: "thin" },
//     }
//   })

//   // Populate the worksheet with order data
//   orders.forEach((order: any) => {
//     worksheet.addRow([
//       order.shippingAddress.name, // Customer Name
//       order.shippingAddress.address, // Shipping Address
//       order.dispatchRider, // Dispatch Rider Name
//       order.total.toFixed(2), // Total Amount
//     ])
//   })

//   // Adjust column widths
//   worksheet.columns = [
//     { width: 25 }, // Customer Name
//     { width: 40 }, // Shipping Address
//     { width: 25 }, // Dispatch Rider Name
//     { width: 15 }, // Total Amount
//   ]

//   // Add borders to all rows and columns
//   worksheet.eachRow((row) => {
//     row.eachCell((cell) => {
//       cell.border = {
//         top: { style: "thin" },
//         left: { style: "thin" },
//         bottom: { style: "thin" },
//         right: { style: "thin" },
//       }
//     })
//   })

//   // Freeze the header row
//   worksheet.views = [
//     {
//       state: "frozen",
//       ySplit: 1, // Freeze the header row
//     },
//   ]

//   // Export the workbook
//   const buffer = await workbook.xlsx.writeBuffer()

//   // Trigger file download
//   const blob = new Blob([buffer], {
//     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   })
//   const link = document.createElement("a")
//   link.href = URL.createObjectURL(blob)
//   link.download = `DispatchOrders_${from.toISOString().split("T")[0]}_to_${
//     to.toISOString().split("T")[0]
//   }.xlsx`
//   document.body.appendChild(link)
//   link.click()
//   document.body.removeChild(link)
// }

export default async function exportDispatchOrdersToExcel(
  from: Date,
  to: Date
) {
  const orders = await fetchConfirmedOrdersWithDispatchRider(from, to)

  if (!orders.length) {
    console.warn("No orders found for the given criteria.")
    return
  }

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Dispatch Orders")

  const routeDate = formatDate(to)

  // Add title row
  const titleRow = worksheet.addRow([`${routeDate}`])

  titleRow.font = { bold: true, size: 14 }
  titleRow.alignment = { horizontal: "center", vertical: "middle" }
  worksheet.mergeCells("A1:D1") // Merge the title row across columns
  titleRow.height = 20 // Set row height for better visibility

  // Add table headers
  const headerRow = worksheet.addRow([
    "Customer Name",
    "Shipping Address",
    "Dispatch Rider Name",
    "Total Amount",
  ])

  // Style the header row
  headerRow.eachCell((cell) => {
    cell.font = { bold: true }
    cell.alignment = { horizontal: "center", vertical: "middle" }
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "686D76" }, // Light red background for headers
    }
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    }
  })

  // Populate the worksheet with order data
  orders.forEach((order: any) => {
    const shippingAddress = `${order.shippingAddress?.address || "N/A"}, ${
      order.shippingAddress?.city || "N/A"
    }`

    worksheet.addRow([
      order.shippingAddress?.name || "N/A", // Customer Name
      shippingAddress, // Shipping Address
      `${order.dispatchRider?.firstName || ""} ${
        order.dispatchRider?.lastName || ""
      }`.trim() || "N/A", // Dispatch Rider Name
      formatCurrency(order?.total + order?.deliveryFee, "GHS") || "0.00", // Total Amount
    ])
  })

  // Adjust column widths
  worksheet.columns = [
    { width: 25 }, // Customer Name
    { width: 30 }, // Shipping Address
    { width: 25 }, // Dispatch Rider Name
    { width: 15 }, // Total Amount
  ]

  // Add borders to all rows and columns
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      }
    })
  })

  // Freeze the header row
  worksheet.views = [
    {
      state: "frozen",
      ySplit: 2, // Freeze the title and header rows
    },
  ]

  try {
    // Generate the file buffer
    const buffer = await workbook.xlsx.writeBuffer()

    // Create a Blob and trigger download
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `RoutSheet_${from.toISOString().split("T")[0]}_to_${
      to.toISOString().split("T")[0]
    }.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error("Error exporting Excel file:", error)
  }
}

// export default async function exportDispatchOrdersToExcel(
//   from: Date,
//   to: Date
// ) {
//   const orders = await fetchConfirmedOrdersWithDispatchRider(from, to)

//   if (!orders.length) {
//     console.warn("No orders found for the given criteria.")
//     return
//   }

//   const workbook = new ExcelJS.Workbook()
//   const worksheet = workbook.addWorksheet("Dispatch Orders")

//   // Add table headers
//   worksheet.addRow([
//     "Customer Name",
//     "Shipping Address",
//     "Dispatch Rider Name",
//     "Total Amount",
//   ])

//   // Style the header row
//   worksheet.getRow(1).eachCell((cell) => {
//     cell.font = { bold: true }
//     cell.alignment = { horizontal: "center", vertical: "middle" }
//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "FFCDD2" }, // Light red background for headers
//     }
//     cell.border = {
//       top: { style: "thin" },
//       left: { style: "thin" },
//       bottom: { style: "thin" },
//       right: { style: "thin" },
//     }
//   })

//   // Populate the worksheet with order data
//   orders.forEach((order: any) => {
//     worksheet.addRow([
//       order.shippingAddress?.name || "N/A", // Customer Name
//       order.shippingAddress?.address,
//       order.shippingAddress?.city || "N/A", // Shipping Address
//       `${order.dispatchRider?.firstName || ""} ${
//         order.dispatchRider?.lastName || ""
//       }`.trim() || "N/A", // Dispatch Rider Name
//       formatCurrency(order?.total + order?.deliveryFee, "GHS") || "0.00", // Total Amount
//     ])
//   })

//   // Adjust column widths
//   worksheet.columns = [
//     { width: 25 }, // Customer Name
//     { width: 40 }, // Shipping Address
//     { width: 25 }, // Dispatch Rider Name
//     { width: 15 }, // Total Amount
//   ]

//   // Add borders to all rows and columns
//   worksheet.eachRow((row) => {
//     row.eachCell((cell) => {
//       cell.border = {
//         top: { style: "thin" },
//         left: { style: "thin" },
//         bottom: { style: "thin" },
//         right: { style: "thin" },
//       }
//     })
//   })

//   // Freeze the header row
//   worksheet.views = [
//     {
//       state: "frozen",
//       ySplit: 1, // Freeze the header row
//     },
//   ]

//   try {
//     // Generate the file buffer
//     const buffer = await workbook.xlsx.writeBuffer()

//     // Create a Blob and trigger download
//     const blob = new Blob([buffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     })
//     const link = document.createElement("a")
//     link.href = URL.createObjectURL(blob)
//     link.download = `DispatchOrders_${from.toISOString().split("T")[0]}_to_${
//       to.toISOString().split("T")[0]
//     }.xlsx`
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//   } catch (error) {
//     console.error("Error exporting Excel file:", error)
//   }
// }
