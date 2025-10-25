import twilioClient from "@/lib/twilio/twilio"
import { NextResponse, NextRequest } from "next/server"
import { truncate } from "@/lib/formatters"
import {
  getTemplateMapFromBase64,
  getTemplateMapPickupFromBase64,
} from "@/lib/twilio/template"
import {
  prepareOrderDetails,
  prepareOrderPickupDetails,
} from "@/lib/twilio/prepareOrderDetails"
import prisma from "@/lib/prismadb"
import { auth } from "@/auth"

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
  dispatchRider: {
    fullName: string
    phone: string
  }
  updatedOrderTotal: number
  creditAppliedTotal: number
  userWhatsappOptIn: { customerPhone: string } // Still useful for context within the order
  paymentMethod?: string
  createdAt?: string | Date
}

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

interface TwilioConversationsMessageCreateOptions {
  author?: string
  body?: string
  contentSid?: string
  contentVariables?: string
  attributes?: string
  mediaSid?: string
}

// export async function POST(request: NextRequest) {
//   try {
//     const session = await auth()

//     if (!session) {
//       return NextResponse.json(
//         {
//           error: "Unauthorized - You must log in!",
//         },
//         { status: 401 }
//       )
//     }

//     // 2. Check user role (if you have admin/users distinction)
//     const user = await prisma.user.findUnique({
//       where: { email: session.user?.email },
//     })

//     console.log("Database user:", user)
//     console.log("Database user role:", user?.role)

//     if (user?.role !== "admin") {
//       // Add this if you want admin-only access
//       return NextResponse.json(
//         { error: "Forbidden - You don't have permission" },
//         { status: 403 }
//       )
//     }

//     // Read configuration from environment variables
//     const targetConversationSid =
//       process.env.NEXT_PUBLIC_TWILIO_CONVERSATIONS_SID_SOWGREEN_FARMS
//     // const messageAuthor =
//     //   process.env.ORDER_MESSAGE_AUTHOR || "OrderNotificationService" // Default author

//     if (!twilioClient) {
//       return NextResponse.json(
//         { success: false, error: "Twilio client not initialized" },
//         { status: 500 }
//       )
//     }

//     if (!targetConversationSid) {
//       console.error(
//         "ORDER_TARGET_CONVERSATION_SID environment variable is not set."
//       )
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Server configuration error: Target conversation SID not set.",
//         },
//         { status: 500 } // Internal Server Error because it's a config issue
//       )
//     }

//     const order = (await request.json()) as Order

//     if (
//       !order ||
//       typeof order.orderNumber !== "string" ||
//       !Array.isArray(order.products) ||
//       !order.shippingAddress
//     ) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Invalid or incomplete Order payload in request body",
//         },
//         { status: 400 }
//       )
//     }
//     if (!order.id && process.env.NODE_ENV !== "production") {
//       // Be stricter in dev
//       console.warn(
//         "Order object is missing 'id' field. This is required for button templates and highly recommended."
//       )
//       // For production, you might want to error out or ensure a fallback ID generation if absolutely necessary
//     }

//     const messageData: TwilioConversationsMessageCreateOptions = {
//       author: "system",
//     }

//     let finalContentSid: string | undefined
//     let finalContentVariablesData: Record<string, any> | undefined
//     let calculatedBodyForTemplate: string | undefined
//     let templateUsedKey: string | undefined
//     let expectedVarCount: number

//     const shippingDetails = order.shippingAddress
//     const workers = await fetchWorkers()
//     const rawProductCount = order.products.length
//     const CAPPED_PRODUCTS_IN_LIST = 20
//     const buttonTemplateThreshold = CAPPED_PRODUCTS_IN_LIST
//     const productLinePlaceholdersInTemplate = Math.min(
//       rawProductCount,
//       CAPPED_PRODUCTS_IN_LIST
//     )
//     const baseVarCount = 5
//     const summaryVarCount = 5
//     const contactVarCount = 2
//     const TEMPLATE_MAP = getTemplateMapPickupFromBase64()

//     if (rawProductCount > buttonTemplateThreshold) {
//       templateUsedKey = "13var_btn"
//       finalContentSid = TEMPLATE_MAP[templateUsedKey]
//       expectedVarCount = 14
//     } else {
//       const totalTextVars =
//         baseVarCount +
//         productLinePlaceholdersInTemplate +
//         summaryVarCount +
//         contactVarCount
//       templateUsedKey = `${totalTextVars}var`
//       finalContentSid = TEMPLATE_MAP[templateUsedKey]
//       expectedVarCount = totalTextVars
//     }

//     if (!finalContentSid) {
//       console.error(
//         `Template for key '${templateUsedKey}' (rawProductCount: ${rawProductCount}, productLinePlaceholders: ${productLinePlaceholdersInTemplate}) not found in TEMPLATE_MAP.`
//       )
//       return NextResponse.json(
//         {
//           success: false,
//           error: `Server configuration error: WhatsApp template for key '${templateUsedKey}' not found.`,
//         },
//         { status: 500 } // Config error
//       )
//     }

//     const { baseVariables, productLines, summaryValues, contactValues } =
//       prepareOrderPickupDetails(
//         order,
//         shippingDetails,
//         productLinePlaceholdersInTemplate,
//         workers
//       )

//     let allTemplateVariables: (string | number)[] = []
//     if (templateUsedKey === "13var_btn") {
//       allTemplateVariables = [
//         ...baseVariables.map((v) => truncate(v, 60)),
//         "Click the *View Ordered Items* button below to see all purchased products.",
//         ...summaryValues.map((v) => truncate(v, 60)),
//         ...contactValues.map((v) => truncate(v, 60)),
//         order.id || `fallback_id_${Date.now()}`, // Ensure order.id is present
//       ]
//     } else {
//       allTemplateVariables = [
//         ...baseVariables.map((v) => truncate(v, 60)),
//         ...productLines.map((v) => truncate(v, 60)),
//         ...summaryValues.map((v) => truncate(v, 60)),
//         ...contactValues.map((v) => truncate(v, 60)),
//       ]
//     }

//     if (allTemplateVariables.length !== expectedVarCount) {
//       console.error(
//         `Template variable count mismatch for ${templateUsedKey}! Expected ${expectedVarCount}, got ${
//           allTemplateVariables.length
//         }. Check template definition and prepareOrderDetails logic. Variables (truncated): ${JSON.stringify(
//           allTemplateVariables.map((v) =>
//             typeof v === "string" ? truncate(v, 30) : v
//           )
//         )}`
//       )
//       return NextResponse.json(
//         {
//           success: false,
//           error: `Internal server error: Template variable count mismatch for ${templateUsedKey}.`,
//         },
//         { status: 500 }
//       )
//     }

//     finalContentVariablesData = Object.fromEntries(
//       allTemplateVariables.map((value, index) => [
//         (index + 1).toString(),
//         value,
//       ])
//     )
//     calculatedBodyForTemplate = `Order ${order.orderNumber} update. Template: ${templateUsedKey}. (See WhatsApp for details)`

//     // Find the conversation in our DB
//     const conversation = await prisma.conversation.findUnique({
//       where: { twilioSid: targetConversationSid },
//     })

//     if (!conversation) {
//       return NextResponse.json(
//         { error: "Conversation not found in database" },
//         { status: 404 }
//       )
//     }

//     messageData.contentSid = finalContentSid
//     if (finalContentVariablesData) {
//       messageData.contentVariables = JSON.stringify(finalContentVariablesData)
//     }
//     messageData.body = calculatedBodyForTemplate

//     const message = await twilioClient.conversations.v1
//       .conversations(targetConversationSid) // Use SID from .env
//       .messages.create(messageData)

//     await prisma.conversationMessage.create({
//       data: {
//         conversationId: conversation.id,
//         twilioMessageSid: message.sid,
//         body: message.body,
//         author: message.author,
//       },
//     })

//     return NextResponse.json({
//       success: true,
//       messageSid: message.sid,
//       conversationSid: targetConversationSid,
//       author: message.author,
//       body: message.body,
//       contentSid: message.contentSid || finalContentSid,
//       templateUsed: templateUsedKey,
//       dateCreated: message.dateCreated,
//     })
//   } catch (error: unknown) {
//     console.error("Error sending message:", error)
//     let errorMessage = "Failed to send message."
//     let statusCode = 500
//     let errorDetails: any = null

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
//         details?: any
//       }
//       errorMessage = `Twilio Error ${
//         twilioApiError.code || twilioApiError.status
//       }: ${twilioApiError.message}`
//       statusCode = twilioApiError.status || 500
//       errorDetails = twilioApiError.details || null
//     } else if (error instanceof Error) {
//       errorMessage = error.message
//       if (error.name === "SyntaxError") {
//         // From await request.json()
//         errorMessage = "Invalid JSON payload in request body."
//         statusCode = 400
//       }
//     }

//     return NextResponse.json(
//       {
//         success: false,
//         error: errorMessage,
//         details: errorDetails,
//         timestamp: new Date().toISOString(),
//       },
//       { status: statusCode }
//     )
//   }
// }

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized - You must log in!",
        },
        { status: 401 }
      )
    }

    // 2. Check user role (if you have admin/users distinction)
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email },
    })

    if (user?.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - You don't have permission" },
        { status: 403 }
      )
    }

    // Read configuration from environment variables
    const targetConversationSid =
      process.env.NEXT_PUBLIC_TWILIO_CONVERSATIONS_SID_SOWGREEN_FARMS

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
        { status: 500 }
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
      console.warn(
        "Order object is missing 'id' field. This is required for button templates and highly recommended."
      )
    }

    const shippingDetails = order.shippingAddress
    const workers = await fetchWorkers()

    // 1. Calculate product count for padding purposes
    const rawProductCount = order.products.length
    const cappedProductCount = Math.min(rawProductCount, 20)

    // 2. Prepare order details FIRST (to get actual productLines length including headers)
    const { baseVariables, productLines, summaryValues, contactValues } =
      prepareOrderPickupDetails(
        order,
        shippingDetails,
        cappedProductCount,
        workers
      )

    // 3. Calculate ACTUAL variable count using productLines.length
    const baseVarCount = 5 // [name, orderNumber, date, method, address, rider, phone]
    const summaryVarCount = 5 // [subtotal, delivery, credit, total, due]
    const contactVarCount = 2 // [contact1, contact2]
    const requiredVarCount =
      baseVarCount + productLines.length + summaryVarCount + contactVarCount

    // 4. Get template SID based on ACTUAL variable count
    const TEMPLATE_MAP = getTemplateMapPickupFromBase64()

    // Use button template if variable count exceeds your largest non-button template
    const templateUsedKey =
      requiredVarCount > 32 ? "13var_btn" : `${requiredVarCount}var`

    const finalContentSid = TEMPLATE_MAP[templateUsedKey]

    if (!finalContentSid) {
      console.error(
        `Template for key '${templateUsedKey}' (requiredVarCount: ${requiredVarCount}, productLines.length: ${productLines.length}) not found in TEMPLATE_MAP.`
      )
      return NextResponse.json(
        {
          success: false,
          error: `Server configuration error: WhatsApp template for key '${templateUsedKey}' not found.`,
        },
        { status: 500 }
      )
    }

    // 5. Build variables array according to template requirements
    let allTemplateVariables: (string | number)[] = []

    if (templateUsedKey === "13var_btn") {
      allTemplateVariables = [
        ...baseVariables.map((v) => truncate(v, 60)),
        "Click the *View Ordered Items* button below to see all purchased products.",
        ...summaryValues.map((v) => truncate(v, 60)),
        ...contactValues.map((v) => truncate(v, 60)),
        order.id || `fallback_id_${Date.now()}`,
      ]
    } else {
      allTemplateVariables = [
        ...baseVariables.map((v) => truncate(v, 60)),
        ...productLines.map((v) => truncate(v, 60)),
        ...summaryValues.map((v) => truncate(v, 60)),
        ...contactValues.map((v) => truncate(v, 60)),
      ]
    }

    // 6. Validate variable count matches template expectations
    const expectedVarCount =
      templateUsedKey === "13var_btn"
        ? 14 // 5 + 1 + 5 + 2 + 1 (button ID)
        : requiredVarCount

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

    const finalContentVariablesData = Object.fromEntries(
      allTemplateVariables.map((value, index) => [
        (index + 1).toString(),
        value,
      ])
    )

    const calculatedBodyForTemplate = `Order ${order.orderNumber} update. Template: ${templateUsedKey}. (See WhatsApp for details)`

    // Find the conversation in our DB
    const conversation = await prisma.conversation.findUnique({
      where: { twilioSid: targetConversationSid },
    })

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found in database" },
        { status: 404 }
      )
    }

    const messageData: TwilioConversationsMessageCreateOptions = {
      author: "system",
      contentSid: finalContentSid,
      contentVariables: JSON.stringify(finalContentVariablesData),
      body: calculatedBodyForTemplate,
    }

    const message = await twilioClient.conversations.v1
      .conversations(targetConversationSid)
      .messages.create(messageData)

    await prisma.conversationMessage.create({
      data: {
        conversationId: conversation.id,
        twilioMessageSid: message.sid,
        body: message.body,
        author: message.author,
      },
    })

    return NextResponse.json({
      success: true,
      messageSid: message.sid,
      conversationSid: targetConversationSid,
      author: message.author,
      body: message.body,
      contentSid: message.contentSid || finalContentSid,
      templateUsed: templateUsedKey,
      variableCount: allTemplateVariables.length,
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
