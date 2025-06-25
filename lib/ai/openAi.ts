// // lib/ai.ts
// import OpenAI from "openai"

// // Instantiate the OpenAI client with the API key from environment variables
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// })

// export async function generateDescriptionForProduct(
//   productName: string
// ): Promise<string> {
//   if (!productName) {
//     return "A high-quality product." // Fallback description
//   }
//   try {
//     // Create a chat completion request
//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo", // A fast and cost-effective model for this task
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are an expert copywriter for an e-commerce store. Your task is to write a fresh, brief, and appealing product description. The description must be a single sentence and no more than 20 words.",
//         },
//         {
//           role: "user",
//           content: `Generate a product description for: "${productName}"`,
//         },
//       ],
//       temperature: 0.7, // Adds a little creativity
//       max_tokens: 30, // Limit the length of the response
//     })

//     // Extract the generated text
//     let text = completion.choices[0]?.message?.content?.trim() || ""

//     // Clean up the response, removing potential markdown or quotes
//     text = text.replace(/\"/g, "")

//     // If for some reason the response is empty, return a fallback
//     if (!text) {
//       return `Enjoy the fresh and delicious taste of ${productName}.`
//     }

//     return text
//   } catch (error) {
//     console.error(
//       `OpenAI description generation failed for ${productName}:`,
//       error
//     )
//     // Return a safe, generic description on failure
//     return `Enjoy the fresh and delicious taste of ${productName}.`
//   }
// }

import OpenAI from "openai"

// Instantiate the OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateDescriptionForProduct(
  productName: string
): Promise<string> {
  if (!productName) {
    return "A high-quality product." // Fallback description
  }
  try {
    // Create a chat completion request
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // A fast and cost-effective model for this task
      messages: [
        {
          role: "system",
          content:
            "You are an expert copywriter for an e-commerce store. Your task is to write a fresh, brief, and appealing product description. The description must be a single sentence and no more than 20 words.",
        },
        {
          role: "user",
          content: `Generate a product description for: "${productName}"`,
        },
      ],
      temperature: 0.7, // Adds a little creativity
      max_tokens: 30, // Limit the length of the response
    })

    // Extract the generated text
    let text = completion.choices[0]?.message?.content?.trim() || ""

    // Clean up the response, removing potential markdown or quotes
    text = text.replace(/\"/g, "")

    // If for some reason the response is empty, return a fallback
    if (!text) {
      return `Enjoy the fresh and delicious taste of ${productName}.`
    }

    return text
  } catch (error) {
    console.error(
      `OpenAI description generation failed for ${productName}:`,
      error
    )
    // Return a safe, generic description on failure
    return `Enjoy the fresh and delicious taste of ${productName}.`
  }
}
