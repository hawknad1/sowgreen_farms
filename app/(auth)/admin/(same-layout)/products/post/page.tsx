import { AddProductForm } from "@/components/forms/AddProductForm"
import React from "react"

const PostProduct = () => {
  return (
    <div className="container mx-auto flex justify-center overflow-scroll h-screen scrollbar-hide">
      <div className="mt-4">
        <h2 className="text-2xl font-bold mb-3">Add Product</h2>
        <div className="pb-8">
          <div className="border border-neutral-300 p-4 rounded-lg">
            <AddProductForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostProduct
