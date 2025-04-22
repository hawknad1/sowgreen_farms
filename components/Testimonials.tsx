// import Image from "next/image"
// import React from "react"

// const Testimonials = () => {
//   return (
//     <div>
//       <h2 className="text-3xl font-bold mb-4">Testimonials</h2>
//       <div className="flex items-center">
//         <Image
//           src="/images/banner.jpg"
//           alt="Customer"
//           width={50}
//           height={50}
//           className="rounded-full h-10 w-10 object-cover"
//         />
//         <div className="ml-4">
//           <p className="italic">
//             "I love shopping at this grocery store! The wide variety of fresh
//             produce and friendly staff make every visit enjoyable and
//             convenient."
//           </p>
//           <div className="mt-2 font-bold">Thomas Dankwah</div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Testimonials

const Testimonials = () => {
  const testimonials = [
    {
      name: "Thomas Dankwah",
      image: "/images/banner.jpg",
      text: "I love shopping at this grocery store! The wide variety of fresh produce and friendly staff make every visit enjoyable and convenient.",
    },
    {
      name: "Sarah Johnson",
      image: "/images/banner.jpg",
      text: "The organic produce is always fresh and the delivery service is excellent. Highly recommended!",
    },
  ]

  return (
    <div className="py-4">
      <h2 className="text-xl md:text-3xl font-bold text-emerald-800 text-center mb-8">
        What Our Customers Say
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="rounded-full h-12 w-12 object-cover flex-shrink-0"
              />
              <div>
                <p className="text-gray-600 italic text-sm md:text-base">
                  "{testimonial.text}"
                </p>
                <div className="mt-3 font-semibold text-emerald-800">
                  {testimonial.name}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Testimonials
