// import twilioClient from "@/lib/twilio/twilio"
// import { NextResponse } from "next/server"

// // Define an interface for the expected request body
// interface SendMessageRequestBody {
//   conversationSid: string
//   author?: string
//   body?: string
//   contentSid?: string
//   contentVariables?: Record<string, string | number | boolean> // e.g., { "1": "John", "2": "Order #123" }
// }

// // Define an interface for the messageData object passed to Twilio
// interface TwilioMessageCreateOptions {
//   author?: string
//   body?: string
//   contentSid?: string
//   contentVariables?: string // Twilio expects this as a JSON string
//   attributes?: string // Optional: JSON string for message attributes
//   mediaSid?: string // Optional: For sending media messages
//   // Add other potential options from the Twilio SDK as needed
// }

// export async function POST(request: Request) {
//   // Use Next.js Request type
//   try {
//     const { conversationSid, author, body, contentSid, contentVariables } =
//       (await request.json()) as SendMessageRequestBody

//     if (!twilioClient) {
//       return NextResponse.json(
//         { success: false, error: "Twilio client not initialized" },
//         { status: 500 }
//       )
//     }
//     if (!conversationSid) {
//       return NextResponse.json(
//         { success: false, error: "Missing conversationSid" },
//         { status: 400 }
//       )
//     }
//     if (!body && !contentSid) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Missing message body or contentSid for template",
//         },
//         { status: 400 }
//       )
//     }

//     // Initialize messageData with a proper type
//     const messageData: TwilioMessageCreateOptions = {
//       author: author || "system",
//     }

//     if (contentSid) {
//       messageData.contentSid = contentSid
//       if (contentVariables) {
//         messageData.contentVariables = JSON.stringify(contentVariables)
//       }
//       // Optional: Provide a fallback body if desired, though Twilio prioritizes contentSid
//       if (body) {
//         messageData.body = body
//       }
//     } else if (body) {
//       // Ensure body is only set if not using contentSid or as a fallback
//       messageData.body = body
//     } else {
//       // This case should ideally be caught by the earlier check,
//       // but as a safeguard:
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Message body is required when not using a template.",
//         },
//         { status: 400 }
//       )
//     }

//     const message = await twilioClient.conversations.v1
//       .conversations(conversationSid)
//       .messages.create(messageData)

//     return NextResponse.json({
//       success: true,
//       messageSid: message.sid,
//       conversationSid: message.conversationSid,
//       author: message.author,
//       body: message.body, // Include body in response for confirmation
//       contentSid: message.contentSid, // If contentSid is stored in attributes
//       dateCreated: message.dateCreated,
//     })
//   } catch (error: unknown) {
//     // Catch error as unknown
//     console.error("Error sending message:", error)

//     let errorMessage = "Failed to send message."
//     let statusCode = 500
//     let twilioErrorDetails: any = null

//     // Type guard to check if it's a Twilio API error
//     if (
//       error &&
//       typeof error === "object" &&
//       "status" in error &&
//       "message" in error
//     ) {
//       const twilioApiError = error as {
//         status: number
//         message: string
//         code?: number
//         moreInfo?: string
//         details?: any
//       } // Basic Twilio error structure
//       errorMessage = `Twilio Error ${
//         twilioApiError.code || twilioApiError.status
//       }: ${twilioApiError.message}`
//       statusCode = twilioApiError.status || 500
//       twilioErrorDetails = twilioApiError.details || null // Capture more details if available

//       // For more detailed logging, you can check for 'response' and 'data' if using Axios-like client internally by Twilio
//       // However, the primary error object from twilio-node helper usually contains status, message, code.
//       // The errors you reported with `error.response.data` might occur if you were using a raw HTTP client
//       // or an older version of a library. With `twilio-node`, the error object itself usually has the necessary info.

//       // If you still suspect `error.response.data` might exist (e.g. from a nested error or specific proxy setup):
//       // if ('response' in error && error.response && typeof (error as any).response === 'object' && 'data' in (error as any).response) {
//       //    console.error('Twilio API Response Data:', (error as any).response.data);
//       //    twilioErrorDetails = (error as any).response.data;
//       // }
//     } else if (error instanceof Error) {
//       errorMessage = error.message
//     }

//     return NextResponse.json(
//       { success: false, error: errorMessage, details: twilioErrorDetails },
//       { status: statusCode }
//     )
//   }
// }

import twilioClient from "@/lib/twilio/twilio"
import { NextResponse, NextRequest } from "next/server"
import { Buffer } from "buffer"
import { capitalizeName } from "@/lib/capitalizeName"
import { formatProductLine, truncate } from "@/lib/formatters"
import { formatCurrency } from "@/lib/utils"
import { getTemplateMapFromBase64 } from "@/lib/twilio/template"
import { prepareOrderDetails } from "@/lib/twilio/prepareOrderDetails"

// --- Assuming Types and Helper Functions from your previous detailed versions ---
// (Staff, Product, ShippingAddress, Order, formatProductLine, truncate,
// formatCurrency, capitalizeName, getTemplateMapFromBase64, prepareOrderDetails, fetchWorkers)
// Please ensure they are all correctly defined or imported as in the previous comprehensive example.
// For brevity, I'll only include minimal placeholders for these here.

// --- BEGIN: Minimal Placeholders for Types and Helpers ---
interface Staff {
  fullName: string
  phone: string
}
interface Product {
  quantity: number
  quantityTotal: number
  available: boolean
  weight?: number
  unit?: string
  product: { title: string }
}
interface ShippingAddress {
  name: string
  address: string
  city: string
  region: string
  phone: string
  deliveryMethod?: string
}
interface Order {
  id: string
  shippingAddress: ShippingAddress
  orderNumber: string
  deliveryDate: string
  products: Product[]
  total: number
  deliveryFee: number
  updatedOrderTotal: number
  creditAppliedTotal: number
  userWhatsappOptIn: { customerPhone: string } // Still useful for context within the order
  paymentMethod?: string
  createdAt?: string | Date
}

// function formatProductLine(p: Product, maxLength: number): string {
//   const title = truncate(p.product.title, maxLength - 12)
//   return `• ${p.quantity}x ${title} ${
//     p.weight ? p.weight + (p.unit || "") : ""
//   } - ${formatCurrency(p.quantityTotal, "GHS")}`
// }
// function truncate(str: string | undefined, maxLength: number): string {
//   if (!str) return ""
//   return str.length > maxLength ? str.substring(0, maxLength - 3) + "..." : str
// }
// function formatCurrency(amount: number, currency: string = "GHS"): string {
//   return `${currency} ${amount.toFixed(2)}`
// }
// function capitalizeName(name: string | undefined): string {
//   if (!name) return ""
//   return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
// }
// function getTemplateMapFromBase64(): Record<string, string> {
//   const encoded = process.env.TWILIO_TEMPLATE_MAP_BASE64
//   if (!encoded) {
//     console.error("TWILIO_TEMPLATE_MAP_BASE64 is not set.")
//     return {}
//   }
//   try {
//     return JSON.parse(Buffer.from(encoded, "base64").toString("utf-8"))
//   } catch (err) {
//     console.error("Failed to decode TWILIO_TEMPLATE_MAP_BASE64:", err)
//     return {}
//   }
// }
// function prepareOrderDetails(
//   order: Order,
//   shipping: ShippingAddress,
//   maxProducts: number,
//   workers: Staff[]
// ): {
//   baseVariables: string[]
//   productLines: string[]
//   summaryValues: string[]
//   contactValues: string[]
// } {
//   const worker_one = workers[0]
//     ? `${capitalizeName(workers[0]?.fullName?.split(" ")[0])}: ${
//         workers[0]?.phone
//       }`
//     : ""
//   const worker_two = workers[1]
//     ? `${capitalizeName(workers[1]?.fullName?.split(" ")[0])}: ${
//         workers[1]?.phone
//       }`
//     : ""
//   const deliveryMethod = (shipping.deliveryMethod || "Pickup").trim()
//   const displayMethod =
//     deliveryMethod !== "Home Delivery"
//       ? `Pickup @ ${deliveryMethod}`
//       : deliveryMethod
//   const baseVariables = [
//     shipping.name?.split(" ")[0] || "Valued Customer",
//     order.orderNumber,
//     order.deliveryDate?.split(",").slice(0, 2).join(",") || "N/A",
//     displayMethod,
//     `${shipping.address || "N/A"}, ${shipping.city || "N/A"}`,
//     shipping.phone || "N/A",
//   ]
//   const allProducts = order.products
//   let productLines: string[] = []
//   if (allProducts.length > maxProducts && maxProducts > 0) {
//     const firstProducts = allProducts.slice(0, maxProducts - 1)
//     const remainingProducts = allProducts.slice(maxProducts - 1)
//     productLines = [
//       ...firstProducts.map((p) => formatProductLine(p, 28)),
//       remainingProducts
//         .map(
//           (p) =>
//             `• ${p.quantity}x ${truncate(p.product.title, 13)} ${
//               p.weight ? p.weight + (p.unit || "") : ""
//             } - ${formatCurrency(p.quantityTotal, "GHS")}`
//         )
//         .join(", "),
//     ]
//   } else {
//     productLines = [
//       ...allProducts.slice(0, maxProducts).map((p) => formatProductLine(p, 24)),
//       ...Array(Math.max(0, maxProducts - allProducts.length)).fill(""),
//     ]
//   }
//   const summaryValues = [
//     formatCurrency(order.total, "GHS"),
//     formatCurrency(order.deliveryFee ?? 0, "GHS"),
//     formatCurrency(order.creditAppliedTotal, "GHS"),
//     formatCurrency(order.total + (order.deliveryFee ?? 0), "GHS"),
//     formatCurrency(order.updatedOrderTotal, "GHS"),
//   ]
//   let contactValues = [` ${worker_one}`, ` ${worker_two}`]
//   while (contactValues.length < 2) contactValues.push(" ")
//   return { baseVariables, productLines, summaryValues, contactValues }
// }
async function fetchWorkers(): Promise<Staff[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/management/staff`
    )
    if (!response.ok) {
      console.warn("Failed to fetch workers, using fallback.")
      return [
        { fullName: "Support", phone: "0500000000" },
        { fullName: "Info", phone: "0500000001" },
      ]
    }
    const workers = await response.json()
    if (!Array.isArray(workers) || workers.length === 0) {
      console.warn("Fetched workers invalid, using fallback.")
      return [
        { fullName: "Support", phone: "0500000000" },
        { fullName: "Info", phone: "0500000001" },
      ]
    }
    return workers
  } catch (error) {
    console.error("Error fetching workers:", error)
    return [
      { fullName: "Support Team", phone: "0500000000" },
      { fullName: "Help Desk", phone: "0500000001" },
    ]
  }
}
// --- END: Minimal Placeholders for Types and Helpers ---

interface TwilioConversationsMessageCreateOptions {
  author?: string
  body?: string
  contentSid?: string
  contentVariables?: string
  attributes?: string
  mediaSid?: string
}

export async function POST(request: NextRequest) {
  try {
    // Read configuration from environment variables
    const targetConversationSid = process.env.ORDER_TARGET_CONVERSATION_SID
    // const messageAuthor =
    //   process.env.ORDER_MESSAGE_AUTHOR || "OrderNotificationService" // Default author

    if (!twilioClient) {
      return NextResponse.json(
        { success: false, error: "Twilio client not initialized" },
        { status: 500 }
      )
    }

    if (!targetConversationSid) {
      console.error(
        "ORDER_TARGET_CONVERSATION_SID environment variable is not set."
      )
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error: Target conversation SID not set.",
        },
        { status: 500 } // Internal Server Error because it's a config issue
      )
    }

    const order = (await request.json()) as Order

    if (
      !order ||
      typeof order.orderNumber !== "string" ||
      !Array.isArray(order.products) ||
      !order.shippingAddress
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or incomplete Order payload in request body",
        },
        { status: 400 }
      )
    }
    if (!order.id && process.env.NODE_ENV !== "production") {
      // Be stricter in dev
      console.warn(
        "Order object is missing 'id' field. This is required for button templates and highly recommended."
      )
      // For production, you might want to error out or ensure a fallback ID generation if absolutely necessary
    }

    const messageData: TwilioConversationsMessageCreateOptions = {
      author: "system",
    }

    let finalContentSid: string | undefined
    let finalContentVariablesData: Record<string, any> | undefined
    let calculatedBodyForTemplate: string | undefined
    let templateUsedKey: string | undefined
    let expectedVarCount: number

    const shippingDetails = order.shippingAddress
    const workers = await fetchWorkers()
    const rawProductCount = order.products.length
    const CAPPED_PRODUCTS_IN_LIST = 20
    const buttonTemplateThreshold = CAPPED_PRODUCTS_IN_LIST
    const productLinePlaceholdersInTemplate = Math.min(
      rawProductCount,
      CAPPED_PRODUCTS_IN_LIST
    )
    const baseVarCount = 6
    const summaryVarCount = 5
    const contactVarCount = 2
    const TEMPLATE_MAP = getTemplateMapFromBase64()

    if (rawProductCount > buttonTemplateThreshold) {
      templateUsedKey = "14var_btn"
      finalContentSid = TEMPLATE_MAP[templateUsedKey]
      expectedVarCount = 15
    } else {
      const totalTextVars =
        baseVarCount +
        productLinePlaceholdersInTemplate +
        summaryVarCount +
        contactVarCount
      templateUsedKey = `${totalTextVars}var`
      finalContentSid = TEMPLATE_MAP[templateUsedKey]
      expectedVarCount = totalTextVars
    }

    if (!finalContentSid) {
      console.error(
        `Template for key '${templateUsedKey}' (rawProductCount: ${rawProductCount}, productLinePlaceholders: ${productLinePlaceholdersInTemplate}) not found in TEMPLATE_MAP.`
      )
      return NextResponse.json(
        {
          success: false,
          error: `Server configuration error: WhatsApp template for key '${templateUsedKey}' not found.`,
        },
        { status: 500 } // Config error
      )
    }

    const { baseVariables, productLines, summaryValues, contactValues } =
      prepareOrderDetails(
        order,
        shippingDetails,
        productLinePlaceholdersInTemplate,
        workers
      )

    let allTemplateVariables: (string | number)[] = []
    if (templateUsedKey === "14var_btn") {
      allTemplateVariables = [
        ...baseVariables.map((v) => truncate(v, 60)),
        "Click the *View Order Summary* button below to see all purchased products.",
        ...summaryValues.map((v) => truncate(v, 60)),
        ...contactValues.map((v) => truncate(v, 60)),
        order.id || `fallback_id_${Date.now()}`, // Ensure order.id is present
      ]
    } else {
      allTemplateVariables = [
        ...baseVariables.map((v) => truncate(v, 60)),
        ...productLines.map((v) => truncate(v, 60)),
        ...summaryValues.map((v) => truncate(v, 60)),
        ...contactValues.map((v) => truncate(v, 60)),
      ]
    }

    if (allTemplateVariables.length !== expectedVarCount) {
      console.error(
        `Template variable count mismatch for ${templateUsedKey}! Expected ${expectedVarCount}, got ${
          allTemplateVariables.length
        }. Check template definition and prepareOrderDetails logic. Variables (truncated): ${JSON.stringify(
          allTemplateVariables.map((v) =>
            typeof v === "string" ? truncate(v, 30) : v
          )
        )}`
      )
      return NextResponse.json(
        {
          success: false,
          error: `Internal server error: Template variable count mismatch for ${templateUsedKey}.`,
        },
        { status: 500 }
      )
    }

    finalContentVariablesData = Object.fromEntries(
      allTemplateVariables.map((value, index) => [
        (index + 1).toString(),
        value,
      ])
    )
    calculatedBodyForTemplate = `Order ${order.orderNumber} update. Template: ${templateUsedKey}. (See WhatsApp for details)`

    messageData.contentSid = finalContentSid
    if (finalContentVariablesData) {
      messageData.contentVariables = JSON.stringify(finalContentVariablesData)
    }
    messageData.body = calculatedBodyForTemplate

    const message = await twilioClient.conversations.v1
      .conversations(targetConversationSid) // Use SID from .env
      .messages.create(messageData)

    return NextResponse.json({
      success: true,
      messageSid: message.sid,
      conversationSid: message.conversationSid, // This will be targetConversationSid
      author: message.author,
      body: message.body,
      contentSid: message.contentSid || finalContentSid,
      templateUsed: templateUsedKey,
      dateCreated: message.dateCreated,
    })
  } catch (error: unknown) {
    console.error("Error sending message:", error)
    let errorMessage = "Failed to send message."
    let statusCode = 500
    let errorDetails: any = null

    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      "message" in error
    ) {
      const twilioApiError = error as {
        status: number
        message: string
        code?: number
        details?: any
      }
      errorMessage = `Twilio Error ${
        twilioApiError.code || twilioApiError.status
      }: ${twilioApiError.message}`
      statusCode = twilioApiError.status || 500
      errorDetails = twilioApiError.details || null
    } else if (error instanceof Error) {
      errorMessage = error.message
      if (error.name === "SyntaxError") {
        // From await request.json()
        errorMessage = "Invalid JSON payload in request body."
        statusCode = 400
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString(),
      },
      { status: statusCode }
    )
  }
}
