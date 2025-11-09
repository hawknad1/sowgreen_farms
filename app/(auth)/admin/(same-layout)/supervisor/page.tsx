// app/admin/tax-rates/page.tsx
"use client"

import { useState, useEffect } from "react"
import { TaxRate } from "@prisma/client"

interface TaxRateFormData {
  rate: number
  country: string
  region: string
  isActive: boolean
}

export default function TaxRatesPage() {
  const [taxRates, setTaxRates] = useState<TaxRate[]>([])
  const [loading, setLoading] = useState(true)
  const [editingRate, setEditingRate] = useState<TaxRate | null>(null)
  const [formData, setFormData] = useState<TaxRateFormData>({
    rate: 0,
    country: "",
    region: "",
    isActive: false,
  })

  useEffect(() => {
    fetchTaxRates()
  }, [])

  const fetchTaxRates = async () => {
    try {
      const response = await fetch("/api/zoro/service-charge")
      const data = await response.json()
      setTaxRates(data)
    } catch (error) {
      console.error("Failed to fetch tax rates:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData, "formData submitted")

    try {
      const url = editingRate
        ? `/api/zoro/service-charge/${editingRate.id}`
        : "/api/zoro/service-charge"
      const method = editingRate ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchTaxRates()
        resetForm()
      }
    } catch (error) {
      console.error("Failed to save tax rate:", error)
    }
  }

  const handleEdit = (taxRate: TaxRate) => {
    setEditingRate(taxRate)
    setFormData({
      rate: taxRate.rate,
      country: taxRate.country || "",
      region: taxRate.region || "",
      isActive: taxRate.isActive,
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tax rate?")) return

    try {
      const response = await fetch(`/api/zoro/service-charge/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchTaxRates()
      }
    } catch (error) {
      console.error("Failed to delete tax rate:", error)
    }
  }

  const resetForm = () => {
    setEditingRate(null)
    setFormData({
      rate: 0,
      country: "",
      region: "",
      isActive: false,
    })
  }

  const formatTaxRate = (rate: number) => {
    return `${(rate * 100).toFixed(2)}%`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Tax Rates Management
        </h1>
        <p className="text-gray-600 mt-2">
          Manage tax rates for different regions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {editingRate ? "Edit Tax Rate" : "Add New Tax Rate"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="rate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tax Rate (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="rate"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.rate * 100}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rate: parseFloat(e.target.value) / 100,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="12.5"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500">%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Effective rate: {formatTaxRate(formData.rate)}
                </p>
              </div>

              {/* <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Country (Optional)
                </label>
                <input
                  type="text"
                  id="country"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="US, CA, GB, etc."
                />
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  State/Province (Optional)
                </label>
                <input
                  type="text"
                  id="state"
                  value={formData.region}
                  onChange={(e) =>
                    setFormData({ ...formData, region: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="CA, NY, ON, etc."
                />
              </div> */}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isActive"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Set as active tax rate
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  {editingRate ? "Update Tax Rate" : "Add Tax Rate"}
                </button>

                {editingRate && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Tax Rates List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Current Tax Rates
              </h2>
            </div>

            <div className="overflow-hidden">
              {taxRates.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No tax rates configured yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {taxRates.map((taxRate) => (
                    <div
                      key={taxRate.id}
                      className="px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              taxRate.isActive ? "bg-green-500" : "bg-gray-300"
                            }`}
                          ></div>

                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-semibold text-gray-900">
                                {formatTaxRate(taxRate.rate)}
                              </span>
                              {taxRate.isActive && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Active
                                </span>
                              )}
                            </div>

                            <div className="text-sm text-gray-500 mt-1">
                              {taxRate.country && (
                                <span>Country: {taxRate.country}</span>
                              )}
                              {taxRate.region && taxRate.country && (
                                <span>, </span>
                              )}
                              {taxRate.region && (
                                <span>Region: {taxRate.region}</span>
                              )}
                              {!taxRate.country && !taxRate.region && (
                                <span>Default rate</span>
                              )}
                            </div>

                            <div className="text-xs text-gray-400 mt-1">
                              Created:{" "}
                              {new Date(taxRate.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(taxRate)}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(taxRate.id)}
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Current Tax Rate Info */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              How Tax Rates Work
            </h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• Only one tax rate can be active at a time</li>
              <li>• Setting a new rate as active will deactivate others</li>
              {/* <li>• Country/state specific rates override default rates</li> */}
              <li>• Tax rates apply immediately to all new calculations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
