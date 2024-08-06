import { AddProductForm } from "@/components/forms/AddProductForm"
import React from "react"

const PostProduct = () => {
  return (
    <div className="container mx-auto flex justify-center">
      <div className="p-8 mt-4">
        <h2 className="text-2xl font-bold mb-3">Add Product</h2>
        <AddProductForm />
      </div>
    </div>
  )
}

export default PostProduct
