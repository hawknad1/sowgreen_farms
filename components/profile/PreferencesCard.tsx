import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

interface Preferences {
  emailNotifications: boolean
  smsNotifications: boolean
  weeklyNewsletter: boolean
  specialOffers: boolean
  orderUpdates: boolean
}

interface PreferencesCardProps {
  preferences: Preferences
  isEditing: boolean
  onSave: (preferences: Preferences) => void
}

const PreferencesCard = ({
  preferences,
  isEditing,
  onSave,
}: PreferencesCardProps) => {
  const [prefs, setPrefs] = useState<Preferences>({ ...preferences })

  const handleChange = (key: keyof Preferences, value: boolean) => {
    setPrefs((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    onSave(prefs)
    toast.success("Preferences updated successfully!")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="mr-2 h-5 w-5 text-green-500" />
          Preferences & Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Email Notifications</h4>
              <p className="text-sm text-gray-500">
                Receive order updates via email
              </p>
            </div>
            {isEditing ? (
              <Switch
                checked={prefs.emailNotifications}
                onCheckedChange={(checked) =>
                  handleChange("emailNotifications", checked)
                }
                className="data-[state=checked]:bg-green-500"
              />
            ) : (
              <span
                className={`text-sm ${
                  prefs.emailNotifications ? "text-green-600" : "text-gray-500"
                }`}
              >
                {prefs.emailNotifications ? "Enabled" : "Disabled"}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">SMS Notifications</h4>
              <p className="text-sm text-gray-500">
                Receive order updates via text message
              </p>
            </div>
            {isEditing ? (
              <Switch
                checked={prefs.smsNotifications}
                onCheckedChange={(checked) =>
                  handleChange("smsNotifications", checked)
                }
                className="data-[state=checked]:bg-green-500"
              />
            ) : (
              <span
                className={`text-sm ${
                  prefs.smsNotifications ? "text-green-600" : "text-gray-500"
                }`}
              >
                {prefs.smsNotifications ? "Enabled" : "Disabled"}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Weekly Newsletter</h4>
              <p className="text-sm text-gray-500">
                Receive weekly deals and recipes
              </p>
            </div>
            {isEditing ? (
              <Switch
                checked={prefs.weeklyNewsletter}
                onCheckedChange={(checked) =>
                  handleChange("weeklyNewsletter", checked)
                }
                className="data-[state=checked]:bg-green-500"
              />
            ) : (
              <span
                className={`text-sm ${
                  prefs.weeklyNewsletter ? "text-green-600" : "text-gray-500"
                }`}
              >
                {prefs.weeklyNewsletter ? "Enabled" : "Disabled"}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Special Offers</h4>
              <p className="text-sm text-gray-500">
                Receive special offers and promotions
              </p>
            </div>
            {isEditing ? (
              <Switch
                checked={prefs.specialOffers}
                onCheckedChange={(checked) =>
                  handleChange("specialOffers", checked)
                }
                className="data-[state=checked]:bg-green-500"
              />
            ) : (
              <span
                className={`text-sm ${
                  prefs.specialOffers ? "text-green-600" : "text-gray-500"
                }`}
              >
                {prefs.specialOffers ? "Enabled" : "Disabled"}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Order Updates</h4>
              <p className="text-sm text-gray-500">
                Receive real-time order status updates
              </p>
            </div>
            {isEditing ? (
              <Switch
                checked={prefs.orderUpdates}
                onCheckedChange={(checked) =>
                  handleChange("orderUpdates", checked)
                }
                className="data-[state=checked]:bg-green-500"
              />
            ) : (
              <span
                className={`text-sm ${
                  prefs.orderUpdates ? "text-green-600" : "text-gray-500"
                }`}
              >
                {prefs.orderUpdates ? "Enabled" : "Disabled"}
              </span>
            )}
          </div>

          {isEditing && (
            <Button
              onClick={handleSave}
              className="mt-4 bg-green-500 hover:bg-green-600"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Preferences
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default PreferencesCard
