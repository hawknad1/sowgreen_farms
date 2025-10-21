// const Testimonials = () => {
//   const testimonials = [
//     {
//       name: "Thomas Dankwah",
//       image: "/images/banner.jpg",
//       text: "I love shopping at this grocery store! The wide variety of fresh produce and friendly staff make every visit enjoyable and convenient.",
//     },
//     {
//       name: "Sarah Johnson",
//       image: "/images/banner.jpg",
//       text: "The organic produce is always fresh and the delivery service is excellent. Highly recommended!",
//     },
//   ]

//   return (
//     <div className="py-4">
//       <h2 className="text-xl md:text-3xl font-bold text-emerald-800 text-center mb-8">
//         What Our Customers Say
//       </h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {testimonials.map((testimonial, index) => (
//           <div
//             key={index}
//             className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
//           >
//             <div className="flex items-start space-x-4">
//               <img
//                 src={testimonial.image}
//                 alt={testimonial.name}
//                 className="rounded-full h-12 w-12 object-cover flex-shrink-0"
//               />
//               <div>
//                 <p className="text-gray-600 italic text-sm md:text-base">
//                   "{testimonial.text}"
//                 </p>
//                 <div className="mt-3 font-semibold text-emerald-800">
//                   {testimonial.name}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default Testimonials

"use client"
import React, { useState, useEffect } from "react"

const Testimonials = () => {
  const testimonials = [
    {
      name: "Elsie Duronville",
      text: "Thank you so much - I truly appreciate the service and don't take it for granted!!",
    },
    {
      name: "Godwin Jade",
      subtitle: "Referred By George Dotse",
      text: "Orders has been received within a shortened time, thank you so much. So pleased with your services.",
    },
    {
      name: "Inayah Tonya",
      text: "Grand Rising 🌱, yes I did. It was very nice. We are your customers from now on, we like the life you bring to the body! Thank you so very much 🙏🏾!",
    },
    {
      name: "Neesha",
      text: "Thank you - I bought from you for the first time today and am very impressed with the quality.",
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const maxIndex = Math.ceil(testimonials.length / 2) - 1

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % (maxIndex + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [maxIndex])

  const getAvatarUrl = (name: any) => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=10b981`
  }

  return (
    <div className="py-16 px-4 bg-gradient-to-b from-emerald-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 text-center mb-3">
          What Our Customers Say
        </h2>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Real feedback from our valued customers
        </p>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {Array.from({ length: Math.ceil(testimonials.length / 2) }).map(
                (_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
                      {testimonials
                        .slice(slideIndex * 2, slideIndex * 2 + 2)
                        .map((testimonial, index) => (
                          <div
                            key={slideIndex * 2 + index}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100"
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0">
                                <img
                                  src={getAvatarUrl(testimonial.name)}
                                  alt={testimonial.name}
                                  className="w-16 h-16 rounded-full ring-2 ring-emerald-100"
                                />
                              </div>

                              <div className="flex-1">
                                <div className="mb-3">
                                  <h3 className="font-semibold text-emerald-900 text-lg">
                                    {testimonial.name}
                                  </h3>
                                  {testimonial.subtitle && (
                                    <p className="text-sm text-gray-500">
                                      {testimonial.subtitle}
                                    </p>
                                  )}
                                </div>

                                <p className="text-gray-700 leading-relaxed text-sm">
                                  "{testimonial.text}"
                                </p>

                                <div className="flex gap-1 mt-3">
                                  {[...Array(5)].map((_, i) => (
                                    <svg
                                      key={i}
                                      className="w-4 h-4 fill-yellow-400"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-emerald-600"
                    : "w-2 bg-emerald-200 hover:bg-emerald-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Testimonials
