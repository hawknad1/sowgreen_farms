import { ContactForm } from "@/components/ContactForm"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  ShoppingBag,
  Truck,
  Headset,
} from "lucide-react"

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Headset,
      title: "Customer Support",
      details: "+ (233) 241 234 234",
      subtitle: "Mon-Sun 8AM-8PM EST",
      highlight: true,
    },
    {
      icon: ShoppingBag,
      title: "Order Inquiries",
      details: "orders@sowgreenorganic.com",
      subtitle: "Response within 2 hours",
    },
    {
      icon: Truck,
      title: "Delivery Support",
      details: "delivery@sowgreenorganic.com",
      subtitle: "Track your order",
    },
    {
      icon: MapPin,
      title: "Our Locations",
      details: "4 Stores Nationwide",
      subtitle: "Find your nearest store",
      highlight: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-100 py-16 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              We're Here to Help
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed">
              Have questions about your order, delivery, or our products? Our
              team is ready to assist you with your grocery needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#contact-form"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Contact Us
              </a>
              <a
                // href="/faq"
                href="#quick-help"
                className="bg-white hover:bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors border border-gray-200"
              >
                Visit Help Center
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section id="quick-help" className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-xl p-6 text-center hover:shadow-md transition-all border ${
                  info.highlight
                    ? "border-green-300 shadow-sm"
                    : "border-gray-200"
                }`}
              >
                {info.highlight && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Quick Help
                  </div>
                )}
                <div
                  className={`w-14 h-14 ${
                    info.highlight ? "bg-green-100" : "bg-gray-100"
                  } rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <info.icon
                    className={`h-6 w-6 ${
                      info.highlight ? "text-green-600" : "text-gray-600"
                    }`}
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {info.title}
                </h3>
                <p className="text-gray-900 font-medium mb-1">{info.details}</p>
                <p className="text-sm text-gray-600">{info.subtitle}</p>
                <button className="mt-4 text-sm font-medium text-green-600 hover:text-green-700 transition-colors">
                  Get Help →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Common Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Quick answers to our most frequently asked questions about orders
              and deliveries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              "How do I track my order?",
              "What are your delivery hours?",
              "Can I modify my order after placing it?",
              "Do you offer contactless delivery?",
            ].map((question, index) => (
              <div
                key={index}
                className="bg-white p-5 rounded-lg border border-gray-200 hover:border-green-300 transition-colors"
              >
                <h3 className="font-medium text-gray-900 mb-2">{question}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {index === 0 &&
                    "To track your order, navigate to the Order History section, locate your order, and review its current status."}
                  {index === 1 &&
                    "We deliver only on Wednesdays and Saturdays from 8AM to 8PM."}
                  {index === 2 &&
                    "Orders can be updated or modified until they are confirmed. To make changes, simply locate your order via the Order History section and apply the necessary updates."}
                  {index === 3 &&
                    "Yes, all our deliveries are contactless by default for your safety and convenience."}
                </p>
                {/* <a
                  href="/faq"
                  className="inline-block mt-3 text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Read more
                </a> */}
              </div>
            ))}
          </div>
          {/* 
          <div className="text-center mt-10">
            <a
              href="/faq"
              className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
            >
              View all FAQs
              <svg
                className="ml-1 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div> */}
        </div>
      </section>

      {/* Contact Form Section */}
      {/* <section id="contact-form" className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Need Personalized Help?
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                Fill out the form below and our customer care team will get back
                to you within 2 hours during business hours.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="(233) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="orderNumber"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Order Number (if applicable)
                  </label>
                  <input
                    type="text"
                    id="orderNumber"
                    name="orderNumber"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="SG123W5687P"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    What can we help you with? *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select an option</option>
                    <option value="order">Order Issue</option>
                    <option value="delivery">Delivery Problem</option>
                    <option value="product">Product Question</option>
                    <option value="return">Return/Refund</option>
                    <option value="account">Account Help</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Please describe your issue in detail..."
                  ></textarea>
                </div>

                <div className="flex items-start">
                  <input
                    id="privacy"
                    name="privacy"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
                  />
                  <label
                    htmlFor="privacy"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    I agree to the{" "}
                    <a
                      href="/terms"
                      className="text-green-600 hover:text-green-700"
                    >
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      className="text-green-600 hover:text-green-700"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="h-5 w-5" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section> */}
      <ContactForm />

      {/* Store Locations Preview */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Visit Our Locations
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Prefer to shop in person? Find your nearest location.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                city: "Dzorwulu",
                address: "14 High Street",
                hours: "7AM-8PM only on Wednesdays",
              },
              {
                city: "Parks & Gardens",
                address: "Jawaharlal Nehru Road",
                hours: "7AM-8PM only on Saturdays",
              },
              {
                city: "Web DuBois Centre",
                address: "Fifth Link Rd, Accra",
                hours: "7AM-8PM only on Saturdays",
              },
            ].map((store, index) => (
              <div
                key={index}
                className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {store.city}
                </h3>
                <p className="text-gray-600 mb-3">{store.address}</p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Hours:</span> {store.hours}
                </p>
                {/* <a
                  href="/locations"
                  className="inline-block mt-4 text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                >
                  <MapPin className="h-4 w-4" />
                  View on map
                </a> */}
              </div>
            ))}
          </div>

          {/* <div className="text-center mt-10">
            <a
              href="/locations"
              className="inline-flex items-center bg-white hover:bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors border border-gray-300 shadow-sm"
            >
              <MapPin className="h-5 w-5 mr-2" />
              View all store locations
            </a>
          </div> */}
        </div>
      </section>
    </div>
  )
}
