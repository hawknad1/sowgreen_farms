import ExcelJS from "exceljs"
import { formatDate } from "./formatDate"

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

export default async function downloadExcel(from: Date, to: Date) {
  const products = await fetchProducts() // Fetch products from the API
  // const orders = await fetchOrders(from, to) // Fetch orders from the API
  const orders = await fetchOrders(from, to, "confirmed")

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

  // Add customer rows with order details and total calculation
  let totalRevenue = 0
  orders.forEach((order: any) => {
    const customerName = order.shippingAddress.name
    const orderDetails = products.map((product: any) => {
      const orderProduct = order.products.find(
        (o: any) => o.productId === product.id
      )
      console.log(orderProduct, "orderProduct--00000000000000000")
      // if (orderProduct) {
      //   // Check if the product weight is 0, if so, use quantityTotal instead
      //   if (orderProduct.unit === "ltr" || orderProduct.unit === "ml") {
      //     return orderProduct.quantity // Use quantityTotal if weight is 0
      //   } else {
      //     // Multiply quantity by product weight to calculate total for that product
      //     if (orderProduct.weight > 100)
      //       return orderProduct.quantity * (orderProduct.weight / 1000)
      //     return orderProduct.quantity * orderProduct.weight
      //   }
      // }

      if (orderProduct) {
        // Check for specific weight, unit, and title conditions
        if (
          orderProduct.weight === 250 &&
          orderProduct.unit === "g" &&
          orderProduct.product.title.toLowerCase().includes("coffee")
        ) {
          return orderProduct.quantity
        }

        // Check if the product weight is 0, if so, use quantityTotal instead
        if (orderProduct.unit === "ltr" || orderProduct.unit === "ml") {
          return orderProduct.quantity // Use quantityTotal if weight is 0
        } else {
          // Multiply quantity by product weight to calculate total for that product
          if (orderProduct.weight > 100) {
            return orderProduct.quantity * (orderProduct.weight / 1000)
          }
          return orderProduct.quantity * orderProduct.weight
        }
      }

      return null // If no order for that product, return 0
    })

    const totalOrderAmount = order.total + order.deliveryFee
    totalRevenue += totalOrderAmount // Accumulate the total revenue

    // Add the row with customer name, their order details, and the total
    worksheet.addRow([
      customerName,
      ...orderDetails,
      totalOrderAmount,
      customerName,
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

  // Adjust column widths
  worksheet.columns = [
    { width: 20 }, // Customer Name Column (A)
    ...products.map(() => ({ width: 6 })), // Product columns
    { width: 10 }, // Total Order Amount column
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
  for (let rowIndex = 1; rowIndex <= totalRows; rowIndex++) {
    for (let colIndex = 1; colIndex <= products.length + 2; colIndex++) {
      const cell = worksheet.getCell(rowIndex, colIndex)
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      }
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
