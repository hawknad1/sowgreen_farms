"use client"

import { useState } from "react"
import Head from "next/head"
import { useRouter } from "next/navigation"

type FAQItem = {
  question: string
  answer: string
  category: string
}

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const router = useRouter()

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  const faqs: FAQItem[] = [
    {
      question: "What are your delivery hours?",
      answer:
        "We deliver from 8:00 AM to 8:00 PM only on Wednesdays and Saturdays. You can select your preferred delivery time slot during checkout.",
      category: "Delivery",
    },
    // {
    //   question: "What is your delivery policy?",
    //   answer:
    //     "We offer same-day delivery for orders placed before 2:00 PM. Orders placed after 2:00 PM will be delivered the next day. Delivery fees vary based on your location and order size.",
    //   category: "Delivery",
    // },
    {
      question: "How can I track my order?",
      answer:
        "To track your order, navigate to the Order History section, locate your order, and review its current status.",
      category: "Delivery",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit/debit cards and cash on delivery (where available). All online transactions are securely processed by paystack.",
      category: "Payments",
    },
    {
      question: "Can I modify or cancel my order?",
      answer:
        "Yes, orders can be updated or modified until they are confirmed. To make changes, simply locate your order via the Order History section and apply the necessary updates. Or please contact our customer support team for assitance on +(233) 241-234-234.",
      category: "Orders",
    },
    {
      question: "What is your return policy?",
      answer:
        "We accept returns of unopened, non-perishable items within 24hrs of delivery. Perishable items can only be returned if they arrive damaged or spoiled. Please contact us within 24 hours of delivery for perishable returns.",
      category: "Returns",
    },
    // {
    //   question: "Do you offer discounts for bulk orders?",
    //   answer:
    //     "Yes! We offer special pricing for bulk orders. Please contact our wholesale team at wholesale@groceryexample.com for customized quotes and delivery options.",
    //   category: "Orders",
    // },
    {
      question: "How do I store my perishable items?",
      answer:
        "We recommend refrigerating dairy, meat, and seafood immediately. Most produce should be stored in the refrigerator, except for bananas, potatoes, and tomatoes which should be kept at room temperature.",
      category: "Products",
    },
    {
      question: "Are your products organic?",
      answer:
        "We offer 100% organic farm produce straight from the farm. Products that are certified organic are clearly labeled as such.",
      category: "Products",
    },
    {
      question: "How do I contact customer support?",
      answer:
        "Our customer support team is available 24/7 via email at info@sowgreenorganic.com or by phone at +(233) 241-234-234.",
      category: "Account",
    },
  ]

  // Get all unique categories for filtering
  const categories = Array.from(new Set(faqs.map((faq) => faq.category)))

  // Filter FAQs based on search term and active category
  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory
      ? faq.category === activeCategory
      : true
    return matchesSearch && matchesCategory
  })

  const handleCategoryFilter = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category)
    setActiveIndex(null) // Reset accordion when changing filters
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setActiveIndex(null) // Reset accordion when searching
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>FAQs - Your Grocery Shop</title>
        <meta
          name="description"
          content="Frequently asked questions about our grocery delivery service"
        />
      </Head>

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about our grocery delivery service,
            payment options, returns, and more.
          </p>
        </section>

        {/* Search Bar */}
        <div className="mb-10 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search FAQs..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchTerm}
              onChange={handleSearch}
            />
            <button className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryFilter(category)}
              className={`px-4 py-2 rounded-full transition-colors font-medium ${
                activeCategory === category
                  ? "bg-green-600 text-white"
                  : "bg-white border border-green-600 text-green-600 hover:bg-green-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="mb-4 bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <button
                  className="w-full flex justify-between items-center p-5 text-left font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => toggleAccordion(index)}
                >
                  <span className="text-lg">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 transform transition-transform ${activeIndex === index ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`px-5 pb-5 text-gray-600 ${activeIndex === index ? "block" : "hidden"}`}
                >
                  {faq.answer}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-700">
                No results found
              </h3>
              <p className="mt-2 text-gray-500">
                Try adjusting your search or filter to find what you're looking
                for.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("")
                  setActiveCategory(null)
                }}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Still Have Questions Section */}
        <section className="mt-16 text-center bg-green-50 rounded-xl p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our customer support team
            is happy to help!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => router.push("/contact-us")}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Contact Support
            </button>
            {/* <button className="px-6 py-3 bg-white text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium">
              Live Chat
            </button> */}
          </div>
        </section>
      </main>
    </div>
  )
}
