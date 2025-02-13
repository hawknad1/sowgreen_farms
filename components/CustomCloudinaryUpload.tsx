import { useState } from "react"
import Image from "next/image"
import { PhotoIcon } from "@heroicons/react/20/solid"

interface CloudinaryProps {
  uploadPreset: any
  onSuccess: any
}

const CustomCloudinaryUpload = ({
  uploadPreset,
  onSuccess,
}: CloudinaryProps) => {
  const [imagePreview, setImagePreview] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", uploadPreset)

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      )

      if (res.ok) {
        const data = await res.json()
        setImagePreview(data.secure_url) // Show the preview
        onSuccess(data) // Trigger the callback with Cloudinary response
      } else {
        console.error("Failed to upload image")
      }
    } catch (error) {
      console.error("Error uploading image", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="h-32 md:h-44 w-full border-dotted border-2 mt-4 grid place-items-center bg-slate-100 rounded-md relative">
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center cursor-pointer"
      >
        {isUploading ? (
          <span className="loading loading-spinner loading-md"></span>
        ) : imagePreview ? (
          <Image
            src={imagePreview}
            alt="Uploaded Image"
            fill
            className="absolute object-contain inset-0"
          />
        ) : (
          <>
            <PhotoIcon className="h-6 w-6" />
            <span className="text-xs md:text-sm">Upload Image</span>
          </>
        )}
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    </div>
  )
}

export default CustomCloudinaryUpload
