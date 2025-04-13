import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Plus, Save, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Order } from "@/types"

interface PaymentMethod {
  id: string
  cardNumber: string
  cardHolder: string
  expiryDate: string
  isDefault: boolean
}

interface PaymentMethodsCardProps {
  paymentMethods: PaymentMethod[]
  orders: Order[]
  isEditing: boolean
  onSave: (paymentMethods: PaymentMethod[]) => void
}

const PaymentMethodsCard = ({
  orders,
  paymentMethods,
  isEditing,
  onSave,
}: PaymentMethodsCardProps) => {
  const [methods, setMethods] = useState<PaymentMethod[]>(paymentMethods)

  const recentOrders = orders.slice(-2)[0]

  const handleAddMethod = () => {
    const newMethod: PaymentMethod = {
      id: `payment_${Date.now()}`,
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      isDefault: methods.length === 0,
    }
    setMethods([...methods, newMethod])
  }

  const handleRemoveMethod = (id: string) => {
    setMethods(methods.filter((method) => method.id !== id))
  }

  const handleChangeMethod = (
    id: string,
    field: keyof PaymentMethod,
    value: string | boolean
  ) => {
    setMethods(
      methods.map((method) => {
        if (method.id === id) {
          return { ...method, [field]: value }
        }
        return method
      })
    )
  }

  const handleSetDefault = (id: string) => {
    setMethods(
      methods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    )
  }

  const handleSave = () => {
    // Validate payment methods
    const isValid = methods.every(
      (method) =>
        method.cardNumber.trim() !== "" &&
        method.cardHolder.trim() !== "" &&
        method.expiryDate.trim() !== ""
    )

    if (!isValid) {
      toast.error("Please complete all payment method fields")
      return
    }

    onSave(methods)
    toast.success("Payment methods updated successfully!")
  }

  // Format card number to only show last 4 digits
  const formatCardNumber = (cardNumber: string) => {
    if (!cardNumber) return ""
    const lastFour = cardNumber.slice(-4)
    return `•••• •••• •••• ${recentOrders?.last4Digits}`
  }

  // Format input card number with spaces
  const formatCardNumberInput = (value: string) => {
    const val = value.replace(/\s/g, "").replace(/[^\d]/g, "")
    const matches = val.match(/.{1,4}/g)
    return matches ? matches.join(" ") : val
  }

  // const identifyCardType = (cardNumber: string) => {
  //   const cleaned = cardNumber.replace(/\D/g, "")
  //   if (cleaned.startsWith("4")) return "VISA"
  //   if (/^5[1-5]/.test(cleaned)) return "MasterCard"
  //   if (/^3[47]/.test(cleaned)) return "American Express"
  //   if (/^6(?:011|5)/.test(cleaned)) return "Discover"
  //   return "Card"
  // }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5 text-green-500" />
          Payment Methods
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {methods.map((method, index) => (
            <div
              key={method.id}
              className={`space-y-4 ${index > 0 ? "pt-4" : ""}`}
            >
              {index > 0 && <Separator />}

              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                      className={`text-xs ${
                        method.isDefault
                          ? "text-green-600 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {method.isDefault ? "✓ Default" : "Set as Default"}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMethod(method.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`cardNumber-${method.id}`}>
                        Card Number
                      </Label>
                      <Input
                        id={`cardNumber-${method.id}`}
                        value={method.cardNumber}
                        onChange={(e) =>
                          handleChangeMethod(
                            method.id,
                            "cardNumber",
                            formatCardNumberInput(e.target.value).substring(
                              0,
                              19
                            )
                          )
                        }
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`cardHolder-${method.id}`}>
                        Cardholder Name
                      </Label>
                      <Input
                        id={`cardHolder-${method.id}`}
                        value={method.cardHolder}
                        onChange={(e) =>
                          handleChangeMethod(
                            method.id,
                            "cardHolder",
                            e.target.value
                          )
                        }
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`expiryDate-${method.id}`}>
                        Expiry Date
                      </Label>
                      <Input
                        id={`expiryDate-${method.id}`}
                        value={method.expiryDate}
                        onChange={(e) => {
                          const input = e.target.value.replace(/\D/g, "")
                          if (input.length <= 4) {
                            const month = input.substring(0, 2)
                            const year = input.substring(2, 4)
                            let formatted = month
                            if (year) {
                              formatted = `${month}/${year}`
                            }
                            handleChangeMethod(
                              method.id,
                              "expiryDate",
                              formatted
                            )
                          }
                        }}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="font-medium">
                        {/* {identifyCardType(method.cardNumber)} */}
                        {recentOrders?.cardType.toUpperCase()}
                      </span>
                      {method.isDefault && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 font-mono">
                    {formatCardNumber(method.cardNumber)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {recentOrders?.shippingAddress?.name} | Expires:{" "}
                    {method.expiryDate}
                  </p>
                </div>
              )}
            </div>
          ))}

          {isEditing && (
            <>
              {methods.length > 0 && <Separator className="my-4" />}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddMethod}
                  className="border-dashed border-gray-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Card
                </Button>

                {methods.length > 0 && (
                  <Button
                    onClick={handleSave}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Cards
                  </Button>
                )}
              </div>
            </>
          )}

          {!isEditing && methods.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No payment methods saved yet.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default PaymentMethodsCard
