import { Order, Product, ProductOrder } from "@/types"
import xlsx, { IContent, IJsonSheet } from "json-as-xlsx"

export function downloadCustomers(data: any) {
  let columns: IJsonSheet[] = [
    {
      sheet: "Customers",
      columns: [
        { label: "Customer ID", value: "id" },

        { label: "Name", value: "name" },
        { label: "Address", value: "address" },
        {
          label: "Phone",
          value: "phone",
        },
        {
          label: "Email",
          value: "email",
        },
        {
          label: "Date",
          value: "date",
        },
      ],
      content: data,
    },
  ]

  let settings = {
    fileName: "Customer Data",
  }

  xlsx(columns, settings)
}

export function downloadOrders(orders: Order[]) {
  console.log(orders, "xlsx")
  // Flatten the data beforehand, including product names
  const flattenedOrders = orders.map((order) => ({
    orderNumber: order.orderNumber,
    productNames: order.products
      .map((p: ProductOrder) => p.product?.title || "N/A")
      .join(", "), // Safely access product title
    productQuantities: order.products.map((p) => p.quantity).join(", "),
    productTotals: order.products.map((p) => p.quantityTotal).join(", "),
    customerName: order.shippingAddress.name,
    address: order.shippingAddress.address,
    city: order.shippingAddress.city,
    phone: order.shippingAddress.phone,
    total: order.total,
  }))

  // Define the columns and content structure
  let columns: IJsonSheet[] = [
    {
      sheet: "Orders",
      columns: [
        { label: "Order Number", value: "orderNumber" },
        { label: "Product Names", value: "productNames" }, // Added Product Names
        { label: "Product Quantities", value: "productQuantities" },
        { label: "Product Totals", value: "productTotals" },
        { label: "Customer Name", value: "customerName" },
        { label: "Address", value: "address" },
        { label: "City", value: "city" },

        { label: "Phone", value: "phone" },
        { label: "Total", value: "total" },
      ],
      content: flattenedOrders as IContent[], // Ensure the content is correctly typed
    },
  ]

  // Define settings for file
  let settings = {
    fileName: "Order_List", // Name of the downloaded file
  }

  // Call xlsx function to generate the file
  xlsx(columns, settings)
}

export function downloadProducts(data: any) {
  let columns: IJsonSheet[] = [
    {
      sheet: "Products",
      columns: [
        { label: "Product ID", value: "id" },

        { label: "Product", value: "title" },
        { label: "Category", value: "categoryName" },
        {
          label: "Price",
          value: "price",
        },
        {
          label: "Quantity",
          value: "quantity",
        },
      ],
      content: data,
    },
  ]

  let settings = {
    fileName: "Products Data",
  }

  xlsx(columns, settings)
}
