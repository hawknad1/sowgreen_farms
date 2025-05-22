// export const getTemplateMapFromBase64 = () => {
//   const encoded = process.env.TWILIO_TEMPLATE_MAP_BASE64
//   if (!encoded) throw new Error("TWILIO_TEMPLATE_MAP_BASE64 not set")

//   try {
//     return JSON.parse(Buffer.from(encoded, "base64").toString("utf-8"))
//   } catch (err) {
//     throw new Error("Invalid template map encoding")
//   }
// }

// export const TEMPLATE_NAMES = {
//   BASE: (varCount: number) => `${varCount}var`,
//   BUTTON: (varCount: number) => `${varCount}var_btn`,
//   FULL_LIST: "full_product_list",
// }

export function getTemplateMapFromBase64(): Record<string, string> {
  const encoded = process.env.TWILIO_TEMPLATE_MAP_BASE64
  if (!encoded) {
    console.error("TWILIO_TEMPLATE_MAP_BASE64 is not set.")
    return {}
  }

  try {
    const decoded = Buffer.from(encoded, "base64").toString("utf-8")
    return JSON.parse(decoded)
  } catch (err) {
    console.error("Failed to decode or parse TWILIO_TEMPLATE_MAP_BASE64:", err)
    return {}
  }
}
