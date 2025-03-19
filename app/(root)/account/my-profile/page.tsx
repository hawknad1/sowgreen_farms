"use client"
import { useSession } from "next-auth/react"
import React from "react"

interface UserProps {
  name: string
  role: string
  email: string
  phone: string
}

const MyProfilePage = () => {
  const session = useSession()
  const user = session?.data?.user
  const name = user?.name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")

  return (
    // <div className="h-screen container mx-auto flex justify-center items-center">
    //   <div>
    //     <h2 className="text-4xl font-bold">{`Hi, ${name}`}</h2>
    //   </div>
    // </div>
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-sowgren_Color p-6">
          <div className="flex items-center space-x-4">
            <img
              src="/images/placeholder.png"
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">{name}</h1>
              <p className="text-gray-200">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <p className="mt-1 text-gray-900">{name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <p className="mt-1 text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <p className="mt-1 text-gray-900">+1 234 567 890</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <p className="mt-1 text-gray-900">123 Main St, Anytown, USA</p>
            </div>
          </div>
        </div>

        {/* Order History */}
        {/* <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Order History</h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <p className="text-gray-900">Order #12345 - $99.99</p>
              <p className="text-sm text-gray-600">
                Delivered on January 1, 2023
              </p>
            </div>
            <div className="border-b pb-4">
              <p className="text-gray-900">Order #12346 - $49.99</p>
              <p className="text-sm text-gray-600">
                Delivered on December 25, 2022
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default MyProfilePage
