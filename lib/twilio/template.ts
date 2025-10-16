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

export function getTemplateMapPickupFromBase64(): Record<string, string> {
  const encoded = process.env.TWILIO_TEMPLATE_MAP_PICKUP_BASE64
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
