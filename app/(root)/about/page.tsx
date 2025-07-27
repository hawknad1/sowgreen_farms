// import Head from "next/head"
// import Image from "next/image"

// export default function About() {
//   return (
//     <>
//       <Head>
//         <title>About Us - FreshGrocery</title>
//         <meta
//           name="description"
//           content="Learn more about FreshGrocery and our mission."
//         />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <main className="min-h-screen bg-gray-50">
//         {/* Hero Section */}
//         <section className="py-20 bg-green-100">
//           <div className="container mx-auto px-4 text-center">
//             <h2 className="text-5xl font-bold text-green-800 mb-6">
//               About Sowgreen Organic Farms
//             </h2>
//             <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
//               At Sowgreen Farms, we believe in providing the freshest produce
//               and groceries directly to your doorstep. Our mission is to make
//               healthy eating accessible and affordable for everyone.
//             </p>
//           </div>
//         </section>

//         {/* Mission Section */}
//         <section className="py-20 bg-white">
//           <div className="container mx-auto px-4">
//             <h3 className="text-4xl font-bold text-green-700 mb-12 text-center">
//               Our Mission
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
//               {/* Left Column */}
//               <div className="space-y-6">
//                 <h2 className="text-2xl font-semibold text-red-500 text-center">
//                   Our journey into organic farming began in 2012.
//                 </h2>
//                 <p className="text-lg text-gray-700 leading-relaxed">
//                   We value the idea of growing purely organic vegetables and
//                   fruits. Our journey into organic farming began in 2012 when we
//                   purchased some land for the sole purpose of growing
//                   pineapples. We hired a couple of local farmers who were
//                   already growing pineapples on small farms next to our land to
//                   also grow pineapples on ours. The estimates and projections
//                   they gave us to cultivate pineapples turned out to be very
//                   optimistic and inaccurate.
//                 </p>
//                 <p className="text-lg text-gray-700 leading-relaxed">
//                   Whilst pondering over these issues for a solution, a relative
//                   who eats only organic foods sent us some vegetable seeds to
//                   plant at the pineapple farm, and this is where the idea of an
//                   organic vegetable farm really took off! We started off by
//                   growing 15 different vegetables 5 years ago. Today we grow
//                   over 40 different vegetables and have added fruits to our
//                   product line.
//                 </p>
//               </div>

//               {/* Right Column */}
//               <div className="flex items-center justify-center">
//                 <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
//                   <Image
//                     src="/images/forBanner.jpg"
//                     alt="Fresh Produce"
//                     layout="fill"
//                     objectFit="cover"
//                     className="rounded-lg"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Team Section */}
//         <section className="py-20 bg-gray-100">
//           <div className="container mx-auto px-4">
//             <h3 className="text-4xl font-bold text-green-700 mb-12 text-center">
//               Meet Our Team
//             </h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//               {/* Team Member 1 */}
//               <div className="text-center">
//                 <img
//                   src="/images/placeholder.png"
//                   alt="Team Member 1"
//                   className="rounded-full w-32 h-32 mx-auto mb-4 shadow-md"
//                 />
//                 <h4 className="text-xl font-bold text-green-700">Jane Doe</h4>
//                 <p className="text-gray-700">Founder & CEO</p>
//               </div>
//               {/* Team Member 2 */}
//               <div className="text-center">
//                 <img
//                   src="/images/placeholder.png"
//                   alt="Team Member 2"
//                   className="rounded-full w-32 h-32 mx-auto mb-4 shadow-md"
//                 />
//                 <h4 className="text-xl font-bold text-green-700">John Smith</h4>
//                 <p className="text-gray-700">Chief Operations Officer</p>
//               </div>
//               {/* Team Member 3 */}
//               <div className="text-center">
//                 <img
//                   src="/images/placeholder.png"
//                   alt="Team Member 3"
//                   className="rounded-full w-32 h-32 mx-auto mb-4 shadow-md"
//                 />
//                 <h4 className="text-xl font-bold text-green-700">
//                   Emily Johnson
//                 </h4>
//                 <p className="text-gray-700">Marketing Manager</p>
//               </div>
//               {/* Team Member 4 */}
//               <div className="text-center">
//                 <img
//                   src="/images/placeholder.png"
//                   alt="Team Member 4"
//                   className="rounded-full w-32 h-32 mx-auto mb-4 shadow-md"
//                 />
//                 <h4 className="text-xl font-bold text-green-700">
//                   Michael Brown
//                 </h4>
//                 <p className="text-gray-700">Supply Chain Specialist</p>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>
//     </>
//   )
// }
"use client"

import {
  Check,
  Leaf,
  Shield,
  ShoppingBasket,
  Star,
  Truck,
  Users,
  Heart,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function AboutUsPage() {
  const router = useRouter()
  return (
    <div className="bg-white">
      {/* Hero Section with Parallax Effect */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/banner.jpg"
            alt="Our grocery store"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Our <span className="text-green-400">Story</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            At Sowgreen Farms, we believe in providing the freshest farm produce
            directly to your doorstep. Our mission is to make healthy eating
            accessible and affordable for everyone.
          </p>
        </motion.div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-2xl"
            >
              <Image
                src="/images/banner1.jpg"
                alt="Store interior"
                fill
                className="object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-0.5 bg-green-500" />
                <span className="text-sm font-medium text-green-600 uppercase tracking-wider">
                  Our Journey
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                More Than Just a Grocery Store
              </h2>

              <p className="text-lg text-gray-600 mb-6">
                We value the idea of growing purely organic vegetables and
                fruits. Our journey into organic farming began in 2012 when we
                purchased some land for the sole purpose of growing pineapples.
                We hired a couple of local farmers who were already growing
                pineapples on small farms next to our land to also grow
                pineapples on ours.
              </p>

              <p className="text-lg text-gray-600 mb-8">
                Whilst pondering over these issues for a solution, a relative
                who eats only organic foods sent us some vegetable seeds to
                plant at the pineapple farm, and this is where the idea of an
                organic vegetable farm really took off! We started off by
                growing 15 different vegetables 5 years ago. Today we grow over
                40 different vegetables and have added fruits to our product
                line.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 ">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="font-bold text-gray-900">15,000+</p>
                  <p className="text-sm text-gray-600">Yearly Customers</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="font-bold text-gray-900">10+</p>
                  <p className="text-sm text-gray-600">Years Serving</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <Heart className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="font-bold text-gray-900">20+</p>
                  <p className="text-sm text-gray-600">Local Suppliers</p>
                </div>
              </div>

              {/* <Button
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 h-12 px-8"
              >
                Meet Our Team
              </Button> */}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-green-500" />
              <span className="text-sm font-medium text-green-600 uppercase tracking-wider">
                Our Values
              </span>
              <div className="w-8 h-0.5 bg-green-500" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What We Stand For
            </h2>
            <p className="text-lg text-gray-600">
              These principles guide every decision we make at Sowgreen Farms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                      <value.icon className="w-6 h-6 text-green-600" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-green-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-0.5 bg-green-500" />
                <span className="text-sm font-medium text-green-600 uppercase tracking-wider">
                  Why Sowgreen Farms
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                The Sowgreen Difference
              </h2>

              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full mt-1 flex-shrink-0">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => router.push("/products")}
                className="mt-8 bg-green-600 hover:bg-green-700 h-12 px-8"
              >
                Explore Our Products
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-2xl order-1 lg:order-2"
            >
              <Image
                src="/images/african.jpg"
                alt="Fresh produce"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-20  bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-green-400" />
              <span className="text-sm font-medium text-green-400 uppercase tracking-wider">
                Testimonials
              </span>
              <div className="w-8 h-0.5 bg-green-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-300">
              Don't just take our word for it - hear from our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 bg-gray-800 hover:bg-gray-700 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                        />
                      ))}
                    </div>
                    <p className="italic text-gray-300 mb-6">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-green-400">
                        <Image
                          // src={testimonial.avatar}
                          src="/images/man.jpg"
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-16 md:py-24 lg:py-32 bg-green-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience FreshMart?
            </h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto mb-8">
              Visit us today and taste the difference quality makes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-green-600 hover:bg-gray-100 h-14 px-10 text-lg">
                Shop Online
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-green-700 hover:text-white h-14 px-10 text-lg"
              >
                Find a Store
              </Button>
            </div>
          </motion.div>
        </div>
      </section> */}
    </div>
  )
}

const values = [
  {
    icon: Leaf,
    title: "Quality First",
    description:
      "We rigorously select suppliers and inspect every product to ensure it meets our high standards.",
  },
  {
    icon: Shield,
    title: "Integrity",
    description:
      "Honest pricing, transparent sourcing, and doing what's right - even when no one's watching.",
  },
  {
    icon: ShoppingBasket,
    title: "Community Focus",
    description:
      "We support local agriculture by sourcing our products directly from local farmers, ensuring fair trade and sustainability.",
  },
]

const features = [
  {
    title: "Farm-to-Customer Delivery",
    description:
      "SowGreen ensures freshness and quality by delivering produce directly from the farm to the customer’s doorstep.",
  },
  {
    title: "Commitment to Organic Farming",
    description:
      "Sowgreen Farms is deeply rooted in the philosophy of growing purely organic vegetables and fruits, promoting healthy living and sustainable agriculture.",
  },
  {
    title: "Sustainability Commitment",
    description:
      "Eco-friendly packaging and zero-waste initiatives reduce our environmental impact.",
  },
  {
    title: "Local Farmer Empowerment",
    description:
      "SowGreen collaborates with local farmers, providing them with opportunities to scale their farming operations and contribute to a larger organic farming initiative.",
  },
]

const testimonials = [
  {
    text: "The quality is consistently excellent, and the staff feels like family.",
    rating: 5,
    name: "Yaw Asante",
    location: "Customer since 2012",
    avatar: "/avatar1.jpg",
  },
  {
    text: "As a professional chef, I'm particular about ingredients. Sowgreen Organic Farms is my only choice for the best produce and specialty items.",
    rating: 5,
    name: "Kwame Mensah",
    location: "Executive Chef",
    avatar: "/avatar2.jpg",
  },
  {
    text: "Their online ordering and curbside pickup saves me hours each week. The personal shopping is always perfect!",
    rating: 5,
    name: "Ama Boateng",
    location: "Busy Parent",
    avatar: "/avatar3.jpg",
  },
]
