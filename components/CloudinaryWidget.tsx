"use client"
import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary"
import Image from "next/image"
import React, { useState } from "react"

const CloudinaryWidget = () => {
  const [imageUrl, setImageUrl] = useState("")
  const [publicId, setPublicId] = useState("")

  const handleImageUpload = (result: CloudinaryUploadWidgetResults) => {
    console.log("result", result)
    const info = result as object
    if ("secure_url" in info && "public_id" in info) {
      const url = info.secure_url as string
      const public_id = info.public_id as string
      setImageUrl(url)
      setPublicId(public_id)
      console.log("url:", url)
      console.log("publicId: ", publicId)
    }
  }

  return (
    <div>
      {publicId && <p>{publicId}</p>}
      <CldUploadWidget
        uploadPreset="sowgreen"
        onSuccess={(result: any) => {
          setImageUrl(result?.info?.url)
          setPublicId(result?.info?.public_id)
          console.log(result)
        }}
      >
        {({ open }) => {
          return (
            <>
              <button onClick={() => open()}>Upload an Image</button>
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt="Image"
                  fill
                  className="absolute object-cover inset-0"
                />
              )}
            </>
          )
        }}
      </CldUploadWidget>
      <p>{imageUrl}</p>
      <p>helloo</p>
    </div>
  )
}

export default CloudinaryWidget
