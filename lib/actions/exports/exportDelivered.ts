// import { formatDate } from "@/lib/formatDate"
// import ExcelJS from "exceljs"

// // Fetch products from the API and extract details
// async function fetchProducts() {
//   try {
//     const response = await fetch("/api/products")
//     if (!response.ok) {
//       throw new Error("Failed to fetch products")
//     }
//     const data = await response.json()
//     return data.sort((a: any, b: any) => a.title.localeCompare(b.title)) // Return full product details including price, weight, etc.
//   } catch (error) {
//     console.error("Error fetching products:", error)
//     return [] // Return an empty array if the request fails
//   }
// }

// // Fetch orders from the API
// async function fetchOrders(from?: Date, to?: Date, status?: string) {
//   try {
//     const queryParams = new URLSearchParams()

//     if (from) queryParams.append("from", from.toISOString())
//     if (to) queryParams.append("to", to.toISOString())
//     if (status) queryParams.append("status", status) // Pass the status filter

//     const response = await fetch(`/api/orders?${queryParams.toString()}`)

//     if (!response.ok) {
//       throw new Error(`Failed to fetch orders: ${response.statusText}`)
//     }

//     const data = await response.json()
//     return data // Return full order details
//   } catch (error) {
//     console.error("Error fetching orders:", error)
//     return [] // Return an empty array if the request fails
//   }
// }

// // Current Date
// const currentDate = formatDate(new Date())

// export default async function exportDeliveredSheet(from: Date, to: Date) {
//   const products = await fetchProducts() // Fetch products from the API
//   const orders = await fetchOrders(from, to, "delivered")

//   const workbook = new ExcelJS.Workbook()
//   const worksheet = workbook.addWorksheet("Report")

//   // Row 1: Date and products (product titles)
//   const row1 = [
//     currentDate,
//     ...products.map((product: any) => product.title),
//     "Total Revenue",
//   ]
//   worksheet.addRow(row1)

//   // Set vertical text for row 1 (product headers)
//   worksheet.getRow(1).eachCell((cell) => {
//     cell.alignment = {
//       textRotation: 90,
//       vertical: "middle",
//       horizontal: "center",
//     }
//   })

//   // Highlight the product header columns (C1, E1, G1, etc.) with cream color
//   const creamColor = { argb: "FCE5CD" } // Cream color
//   for (let colIndex = 3; colIndex <= products.length + 1; colIndex += 2) {
//     const cell = worksheet.getCell(1, colIndex)
//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: creamColor,
//     }
//   }

//   // Add placeholder "Totals" row
//   const totalsRowData = worksheet.addRow([
//     "Totals",
//     ...products.map(() => 0),
//     0,
//   ])

//   // Style the totals row
//   totalsRowData.eachCell((cell) => {
//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "000000" }, // Black
//     }
//     cell.font = {
//       color: { argb: "FFFFFF" }, // White
//       bold: true,
//     }
//     cell.alignment = {
//       vertical: "middle",
//       horizontal: "center",
//     }
//   })

//   let totalRevenue = 0

//   orders.forEach((order: any) => {
//     const customerName = order.shippingAddress.name
//       .toLowerCase()
//       .split(" ")
//       .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ")
//     const orderDetails = products.map((product: any) => {
//       const orderProducts = order.products.filter(
//         (o: any) => o.productId === product.id
//       )

//       if (orderProducts.length === 0) return null // If no order for that product, return null

//       let totalQuantity = 0

//       orderProducts.forEach((orderProduct: any) => {
//         if (orderProduct.available === false) return

//         // Check for specific weight, unit, and title conditions
//         if (orderProduct.product.title.toLowerCase().includes("eggs")) {
//           if (orderProduct.price === 4) {
//             totalQuantity += 1 * orderProduct.quantity
//           } else if (orderProduct.price === 108) {
//             totalQuantity += 30 * orderProduct.quantity
//           }
//           return
//         }

//         if (
//           orderProduct.weight === 250 &&
//           orderProduct.unit === "g" &&
//           orderProduct.product.title.toLowerCase().includes("coffee")
//         ) {
//           totalQuantity += orderProduct.quantity
//           return
//         }

//         // If the product has no weight, return the quantity directly
//         if (!orderProduct.weight || orderProduct.weight === 0) {
//           totalQuantity += orderProduct.quantity
//           return
//         }

//         // Check if the product weight is 0, if so, use quantityTotal instead
//         if (orderProduct.unit === "ltr" || orderProduct.unit === "ml") {
//           totalQuantity += orderProduct.quantity
//         } else {
//           // Multiply quantity by product weight to calculate total for that product
//           if (orderProduct.weight > 30) {
//             totalQuantity +=
//               orderProduct.quantity * (orderProduct.weight / 1000)
//           } else {
//             totalQuantity += orderProduct.quantity * orderProduct.weight
//           }
//         }
//       })

//       return totalQuantity > 0 ? totalQuantity : "N/A"
//     })

//     const totalOrderAmount = order.total + order.deliveryFee
//     totalRevenue += totalOrderAmount // Accumulate the total revenue

//     const paymentMode = order?.paymentMode

//     // Add the row with customer name, their order details, and the total
//     worksheet.addRow([
//       customerName,
//       ...orderDetails,
//       totalOrderAmount,
//       customerName,
//       paymentMode,
//     ])
//   })

//   // Calculate totals dynamically for each product column
//   const totalRows = worksheet.rowCount
//   for (let colIndex = 2; colIndex <= products.length + 1; colIndex++) {
//     let total = 0
//     for (let rowIndex = 3; rowIndex <= totalRows; rowIndex++) {
//       const cellValue = worksheet.getCell(rowIndex, colIndex).value
//       if (typeof cellValue === "number") {
//         total += cellValue
//       }
//     }
//     worksheet.getCell(2, colIndex).value = total
//   }

//   // Add total revenue in the "Totals" row
//   worksheet.getCell(2, products.length + 2).value = totalRevenue // Last column for Total Revenue

//   // Apply gray color to customer name column (A) starting from A3 down
//   const grayColor = { argb: "D3D3D3" } // Light gray color
//   worksheet.getColumn(1).eachCell((cell, rowNumber) => {
//     if (rowNumber >= 3) {
//       cell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: grayColor,
//       }
//     }
//   })

//   // Apply gray color to the last cell in each row starting from row 3
//   const lastColumnIndex = products.length + 3 // Last column index (Total Revenue column)
//   for (let rowIndex = 3; rowIndex <= worksheet.rowCount; rowIndex++) {
//     const lastCell = worksheet.getCell(rowIndex, lastColumnIndex)
//     lastCell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: grayColor,
//     }
//   }

//   // Adjust column widths
//   worksheet.columns = [
//     { width: 20 }, // Customer Name Column (A)
//     ...products.map(() => ({ width: 6 })), // Product columns
//     { width: 10 }, // Total Order Amount column
//   ]

//   // Apply cream color pattern to product data starting from C3, E3, G3, etc.
//   for (let colIndex = 3; colIndex <= products.length + 1; colIndex += 2) {
//     for (let rowIndex = 3; rowIndex <= totalRows; rowIndex++) {
//       const cell = worksheet.getCell(rowIndex, colIndex)
//       cell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: creamColor,
//       }
//     }
//   }

//   // Apply borders to all cells (including headers and product data)
//   for (let rowIndex = 1; rowIndex <= totalRows; rowIndex++) {
//     for (let colIndex = 1; colIndex <= products.length + 2; colIndex++) {
//       const cell = worksheet.getCell(rowIndex, colIndex)
//       cell.border = {
//         top: { style: "thin" },
//         left: { style: "thin" },
//         bottom: { style: "thin" },
//         right: { style: "thin" },
//       }
//     }
//   }

//   // After adding rows and styling the worksheet
//   worksheet.views = [
//     {
//       state: "frozen",
//       xSplit: 0,
//       ySplit: 2, // Freeze the first 2 rows
//       topLeftCell: "A3", // Optional: starting point after freeze
//       activeCell: "A3", // Optional: initial active cell
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
//   link.download = `Export_${currentDate.replace(/\//g, "-")}.xlsx`
//   document.body.appendChild(link)
//   link.click()
//   document.body.removeChild(link)
// }

import { formatDate } from "@/lib/formatDate"
import ExcelJS from "exceljs"

// Fetch products from the API and extract details
async function fetchProducts() {
  try {
    const response = await fetch("/api/products")
    if (!response.ok) {
      throw new Error("Failed to fetch products")
    }
    const data = await response.json()
    return data.sort((a: any, b: any) => a.title.localeCompare(b.title)) // Return full product details including price, weight, etc.
  } catch (error) {
    console.error("Error fetching products:", error)
    return [] // Return an empty array if the request fails
  }
}

// Fetch orders from the API
async function fetchOrders(from?: Date, to?: Date, status?: string) {
  try {
    const queryParams = new URLSearchParams()

    if (from) queryParams.append("from", from.toISOString())
    if (to) queryParams.append("to", to.toISOString())
    if (status) queryParams.append("status", status) // Pass the status filter

    const response = await fetch(`/api/orders?${queryParams.toString()}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`)
    }

    const data = await response.json()
    return data // Return full order details
  } catch (error) {
    console.error("Error fetching orders:", error)
    return [] // Return an empty array if the request fails
  }
}

// Current Date
const currentDate = formatDate(new Date())

export default async function exportDeliveredSheet(from: Date, to: Date) {
  const products = await fetchProducts() // Fetch products from the API
  const orders = await fetchOrders(from, to, "delivered")

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Report")

  // Row 1: Date and products (product titles)
  const row1 = [
    currentDate,
    ...products.map((product: any) => product.title),
    "Total Revenue",
  ]
  worksheet.addRow(row1)

  // Set vertical text for row 1 (product headers)
  worksheet.getRow(1).eachCell((cell) => {
    cell.alignment = {
      textRotation: 90,
      vertical: "middle",
      horizontal: "center",
    }
  })

  // Highlight the product header columns (C1, E1, G1, etc.) with cream color
  const creamColor = { argb: "FCE5CD" } // Cream color
  for (let colIndex = 3; colIndex <= products.length + 1; colIndex += 2) {
    const cell = worksheet.getCell(1, colIndex)
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: creamColor,
    }
  }

  // Add placeholder "Totals" row
  const totalsRowData = worksheet.addRow([
    "Totals",
    ...products.map(() => 0),
    0,
  ])

  // Style the totals row
  totalsRowData.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "000000" }, // Black
    }
    cell.font = {
      color: { argb: "FFFFFF" }, // White
      bold: true,
    }
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
    }
  })

  let totalRevenue = 0

  orders.forEach((order: any) => {
    const customerName = order.shippingAddress.name
      .toLowerCase()
      .split(" ")
      .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
    const orderDetails = products.map((product: any) => {
      const orderProducts = order.products.filter(
        (o: any) => o.productId === product.id
      )

      if (orderProducts.length === 0) return null // If no order for that product, return null

      let totalQuantity = 0

      orderProducts.forEach((orderProduct: any) => {
        if (orderProduct.available === false) return

        // Check for specific weight, unit, and title conditions
        if (orderProduct.product.title.toLowerCase().includes("eggs")) {
          if (orderProduct.price === 4) {
            totalQuantity += 1 * orderProduct.quantity
          } else if (orderProduct.price === 108) {
            totalQuantity += 30 * orderProduct.quantity
          }
          return
        }

        if (
          orderProduct.weight === 250 &&
          orderProduct.unit === "g" &&
          orderProduct.product.title.toLowerCase().includes("coffee")
        ) {
          totalQuantity += orderProduct.quantity
          return
        }

        // If the product has no weight, return the quantity directly
        if (!orderProduct.weight || orderProduct.weight === 0) {
          totalQuantity += orderProduct.quantity
          return
        }

        // Check if the product weight is 0, if so, use quantityTotal instead
        if (orderProduct.unit === "ltr" || orderProduct.unit === "ml") {
          totalQuantity += orderProduct.quantity
        } else {
          // Multiply quantity by product weight to calculate total for that product
          if (orderProduct.weight > 30) {
            totalQuantity +=
              orderProduct.quantity * (orderProduct.weight / 1000)
          } else {
            totalQuantity += orderProduct.quantity * orderProduct.weight
          }
        }
      })

      return totalQuantity > 0 ? totalQuantity : "N/A"
    })

    const totalOrderAmount = order.total + order.deliveryFee
    totalRevenue += totalOrderAmount // Accumulate the total revenue

    const paymentMode = order?.paymentMode

    // Add the row with customer name, their order details, and the total
    worksheet.addRow([
      customerName,
      ...orderDetails,
      totalOrderAmount,
      customerName,
      paymentMode.toUpperCase(),
    ])
  })

  // Calculate totals dynamically for each product column
  const totalRows = worksheet.rowCount
  for (let colIndex = 2; colIndex <= products.length + 1; colIndex++) {
    let total = 0
    for (let rowIndex = 3; rowIndex <= totalRows; rowIndex++) {
      const cellValue = worksheet.getCell(rowIndex, colIndex).value
      if (typeof cellValue === "number") {
        total += cellValue
      }
    }
    worksheet.getCell(2, colIndex).value = total
  }

  // Add total revenue in the "Totals" row
  worksheet.getCell(2, products.length + 2).value = totalRevenue // Last column for Total Revenue

  // Apply gray color to customer name column (A) starting from A3 down
  const grayColor = { argb: "D3D3D3" } // Light gray color
  worksheet.getColumn(1).eachCell((cell, rowNumber) => {
    if (rowNumber >= 3) {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: grayColor,
      }
    }
  })

  // Apply gray color to the last cell in each row starting from row 3
  const lastColumnIndex = products.length + 3 // Last column index (Total Revenue column)
  for (let rowIndex = 3; rowIndex <= worksheet.rowCount; rowIndex++) {
    const lastCell = worksheet.getCell(rowIndex, lastColumnIndex)
    lastCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: grayColor,
    }
  }

  // Adjust column widths
  worksheet.columns = [
    { width: 20 }, // Customer Name Column (A)
    ...products.map(() => ({ width: 6 })), // Product columns
    { width: 10 }, // Total Order Amount column
    { width: 20 }, // Total Order Amount column
  ]

  // Apply cream color pattern to product data starting from C3, E3, G3, etc.
  for (let colIndex = 3; colIndex <= products.length + 1; colIndex += 2) {
    for (let rowIndex = 3; rowIndex <= totalRows; rowIndex++) {
      const cell = worksheet.getCell(rowIndex, colIndex)
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: creamColor,
      }
    }
  }

  // Apply borders to all cells (including headers and product data)
  const totalColumns = products.length + 4 // Total number of columns
  for (let rowIndex = 1; rowIndex <= totalRows; rowIndex++) {
    for (let colIndex = 1; colIndex <= totalColumns; colIndex++) {
      const cell = worksheet.getCell(rowIndex, colIndex)
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      }
    }
  }

  // Style paymentMode column with rounded text backgrounds and conditional colors
  const paymentModeColumnIndex = products.length + 4 // Payment Mode column index
  for (let rowIndex = 3; rowIndex <= worksheet.rowCount; rowIndex++) {
    const paymentModeCell = worksheet.getCell(rowIndex, paymentModeColumnIndex)
    const paymentMode = paymentModeCell.value

    // Set background color based on payment mode
    if (paymentMode === "CASH") {
      paymentModeCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "DCE9CB" }, // Green with 15% opacity
      }
    } else if (paymentMode === "MOMO") {
      paymentModeCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "DDEBFF" }, // Red with 15% opacity
      }
    } else if (paymentMode === "CARD") {
      paymentModeCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "E2E4FA" }, // Red with 15% opacity
      }
    }

    // Simulate rounded corners by adding padding and borders
    paymentModeCell.alignment = {
      vertical: "middle",
      horizontal: "center",
    }
    paymentModeCell.border = {
      top: { style: "thin", color: { argb: "000000" } },
      left: { style: "thin", color: { argb: "000000" } },
      bottom: { style: "thin", color: { argb: "000000" } },
      right: { style: "thin", color: { argb: "000000" } },
    }
  }

  // After adding rows and styling the worksheet
  worksheet.views = [
    {
      state: "frozen",
      xSplit: 0,
      ySplit: 2, // Freeze the first 2 rows
      topLeftCell: "A3", // Optional: starting point after freeze
      activeCell: "A3", // Optional: initial active cell
    },
  ]

  // Export the workbook
  const buffer = await workbook.xlsx.writeBuffer()

  // Trigger file download
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = `Export_${currentDate.replace(/\//g, "-")}.xlsx`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
