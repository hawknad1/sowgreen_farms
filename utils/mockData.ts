export const mockUser = {
  id: "user_1",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "(555) 123-4567",
  birthdate: "1990-04-15",
  avatar: "",
}

export const mockAddresses = [
  {
    id: "address_1",
    type: "Home",
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    isDefault: true,
  },
  {
    id: "address_2",
    type: "Work",
    street: "456 Market Avenue",
    city: "New York",
    state: "NY",
    zipCode: "10002",
    isDefault: false,
  },
]

export const mockPaymentMethods = [
  {
    id: "payment_1",
    cardNumber: "4111 1111 1111 1111",
    cardHolder: "John Doe",
    expiryDate: "12/25",
    isDefault: true,
  },
]

export const mockPreferences = {
  emailNotifications: true,
  smsNotifications: false,
  weeklyNewsletter: true,
  specialOffers: true,
  orderUpdates: true,
}

export const mockOrders = [
  {
    id: "order_10293847",
    date: "2025-04-05",
    total: 87.32,
    status: "delivered" as const,
    items: 12,
  },
  {
    id: "order_10293982",
    date: "2025-03-22",
    total: 45.99,
    status: "delivered" as const,
    items: 6,
  },
  {
    id: "order_10294058",
    date: "2025-04-08",
    total: 124.5,
    status: "processing" as const,
    items: 15,
  },
]
