// import cloudinary from "cloudinary"
// import { NextResponse } from "next/server"

// cloudinary.v2.config({
//   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// })

// const removeImage = async (publicId: string) => {
//   try {
//     const res = await cloudinary.v2.uploader.destroy(publicId)
//     console.log("image removed")
//   } catch (error) {
//     console.log(error)
//   }
// }

// export async function POST(req: Request) {
//   const { publicId } = await req.json()
//   await removeImage(publicId)
//   return NextResponse.json({ message: "Success" })
// }

import cloudinary from "cloudinary"
import { NextResponse } from "next/server"

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const removeImage = async (publicId: string) => {
  try {
    const res = await cloudinary.v2.uploader.destroy(publicId)
    console.log(`Image with publicId ${publicId} removed:`, res.result)
    return { publicId, status: res.result }
  } catch (error) {
    console.error(`Failed to remove image with publicId ${publicId}:`, error)
    return { publicId, status: "error", error }
  }
}

export async function POST(req: Request) {
  try {
    const { publicIds } = await req.json()

    // Validate input
    if (!Array.isArray(publicIds) || publicIds.length === 0) {
      return NextResponse.json(
        { message: "publicIds must be a non-empty array" },
        { status: 400 }
      )
    }

    // Remove all images and collect results
    const results = await Promise.all(publicIds.map((id) => removeImage(id)))

    return NextResponse.json({
      message: "Image removal process completed",
      results,
    })
  } catch (error) {
    console.error("Error in POST endpoint:", error)
    return NextResponse.json(
      { message: "Failed to remove images", error },
      { status: 500 }
    )
  }
}
