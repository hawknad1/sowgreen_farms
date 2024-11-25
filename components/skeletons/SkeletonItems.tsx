import React from "react"

const SkeletonItems = () => {
  return (
    <div className="flex items-center space-x-2 p-2 rounded-md bg-gray-200 animate-pulse">
      <div className="h-12 w-14 bg-gray-300" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 bg-gray-300" />
        <div className="h-3 w-1/2 bg-gray-300" />
      </div>
    </div>
  )
}

export default SkeletonItems
