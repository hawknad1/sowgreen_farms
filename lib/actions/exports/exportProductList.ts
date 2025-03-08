// // lib/exportProducts.js
// import { Product } from "@/types"
// import ExcelJS from "exceljs"

// export async function exportProducts(products: any) {
//   // Create a new workbook and worksheet
//   const workbook = new ExcelJS.Workbook()
//   const worksheet = workbook.addWorksheet("Products")

//   // Add headers to the worksheet
//   worksheet.columns = [
//     { header: "Name", key: "title", width: 32 },
//     { header: "Price", key: "price", width: 15 },
//   ]

//   // Add rows to the worksheet
//   products.forEach((product: Product) => {
//     worksheet.addRow(product)
//   })

//   // Generate the Excel file as a buffer
//   const buffer = await workbook.xlsx.writeBuffer()
//   return buffer
// }

import { Product } from "@/types"
import ExcelJS from "exceljs"

// export async function exportProducts(products: Product[]) {
//   // Sort products alphabetically by title
//   const sortedProducts = products.sort((a, b) => a.title.localeCompare(b.title))

//   // Create a new workbook and worksheet
//   const workbook = new ExcelJS.Workbook()
//   const worksheet = workbook.addWorksheet("Products")

//   // Add headers to the worksheet
//   worksheet.columns = [
//     { header: "Category", key: "category", width: 20 },
//     { header: "Product Name", key: "title", width: 32 },
//     // { header: "Description", key: "description", width: 50 },
//     { header: "Variant Weight", key: "weight", width: 15 },
//     { header: "Variant Unit", key: "unit", width: 15 },
//     { header: "Price", key: "price", width: 15 },
//     { header: "Stock Status", key: "isInStock", width: 15 },
//     { header: "Quantity", key: "quantity", width: 15 },
//   ]

//   // Add rows to the worksheet
//   sortedProducts.forEach((product) => {
//     if (product.variants && product.variants.length > 0) {
//       // Add a row for each variant
//       product.variants.forEach((variant) => {
//         worksheet.addRow({
//           category: product.categoryName,
//           title: product.title,
//           //   description: product.description,
//           weight: variant.weight,
//           unit: variant.unit,
//           price: variant.price,
//           isInStock: product.isInStock,
//           quantity: product.quantity,
//         })
//       })
//     } else {
//       // Add a row for the product itself if no variants exist
//       worksheet.addRow({
//         category: product.categoryName,
//         title: product.title,
//         // description: product.description,
//         weight: "-",
//         unit: "-",
//         price: product.variants.map((p) => p.price) || "-",
//         isInStock: product.isInStock,
//         quantity: product.quantity,
//       })
//     }
//   })

//   // Generate the Excel file as a buffer
//   const buffer = await workbook.xlsx.writeBuffer()
//   return buffer
// }

export async function exportProducts(products: Product[]) {
  // Sort products alphabetically by title
  const sortedProducts = products.sort((a, b) => a.title.localeCompare(b.title))

  // Create a new workbook and worksheet
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Products")

  // Add headers to the worksheet
  worksheet.columns = [
    { header: "Category", key: "category", width: 20 },
    { header: "Product Name", key: "title", width: 32 },
    // { header: "Description", key: "description", width: 50 },
    { header: "Variant Weight", key: "weight", width: 15 },
    { header: "Variant Unit", key: "unit", width: 15 },
    { header: "Price", key: "price", width: 15 },
    { header: "Stock Status", key: "isInStock", width: 15 },
    { header: "Quantity", key: "quantity", width: 15 },
  ]

  // Style for alternating row colors
  const alternateRowColor = "FCE5CD" // Light orange color

  // Add rows to the worksheet
  sortedProducts.forEach((product, productIndex) => {
    if (product.variants && product.variants.length > 0) {
      // Add a row for each variant
      product.variants.forEach((variant, variantIndex) => {
        const row = worksheet.addRow({
          category: product.categoryName,
          title: product.title,
          //   description: product.description,
          weight: variant.weight,
          unit: variant.unit,
          price: variant.price,
          isInStock: product.isInStock,
          quantity: product.quantity,
        })

        // Apply alternating row color
        if ((productIndex + variantIndex) % 2 === 0) {
          row.eachCell((cell) => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: alternateRowColor.replace("#", "") },
            }
          })
        }

        // Apply borders to all cells in the row
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          }
        })
      })
    } else {
      // Add a row for the product itself if no variants exist
      const row = worksheet.addRow({
        category: product.categoryName,
        title: product.title,
        // description: product.description,
        weight: "-",
        unit: "-",
        price: product.variants.map((p) => p.price) || "-",
        isInStock: product.isInStock,
        quantity: product.quantity,
      })

      // Apply alternating row color
      if (productIndex % 2 === 0) {
        row.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: alternateRowColor.replace("#", "") },
          }
        })
      }

      // Apply borders to all cells in the row
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        }
      })
    }
  })

  // Generate the Excel file as a buffer
  const buffer = await workbook.xlsx.writeBuffer()
  return buffer
}
