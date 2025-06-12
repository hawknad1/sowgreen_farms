"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination, Navigation } from "swiper/modules"
import { motion } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/autoplay"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ShoppingBagIcon,
} from "@heroicons/react/20/solid"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const HeroBanner = () => {
  const router = useRouter()

  const slides = [
    {
      image: "/images/forBanner.jpg",
      title: "All Fruits & Vegetables",
      subtitle: "Are 100% Organic",
    },
    {
      image: "/images/vegg.jpg",
      title: "100% Pesticide & Herbicide Free",
      subtitle: "Locally Grown & Produced in Ghana.",
    },
  ]

  // Refs for custom navigation buttons
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

  return (
    <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh]">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 10000, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          renderBullet: (index, className) =>
            `<span class="${className} custom-dot"></span>`,
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onSwiper={(swiper) => {
          if (prevRef.current && nextRef.current) {
            swiper.params.navigation = {
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }
            swiper.navigation.init()
            swiper.navigation.update()
          }
        }}
        loop={true}
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative w-full h-full">
            {/* Background Image */}
            <Image
              src={slide.image}
              alt={`Slide ${index + 1}`}
              layout="fill"
              objectFit="cover"
              quality={100}
              priority={index === 0}
              className="absolute"
            />

            {/* Animated Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black bg-opacity-40">
              <motion.h1
                className="text-4xl font-bold text-white md:text-5xl"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                {slide.title}
              </motion.h1>
              <motion.p
                className="mt-2 text-lg text-white md:text-xl"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                {slide.subtitle}
              </motion.p>

              <Button
                variant="ghost"
                className="w-fit text-white rounded-full px-8 flex shadow-sm items-center gap-x-2 mt-4 max-w-64 font-semibold text-sm bg-sowgren_Color"
                onClick={() => router.push("/products")}
              >
                Shop Now
                <ShoppingBagIcon className="w-5 h-5" />
              </Button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button
        ref={prevRef}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-gray-500 bg-opacity-70 p-2 rounded-full text-white hover:bg-gray-700"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      <button
        ref={nextRef}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-gray-500 bg-opacity-70 p-2 rounded-full text-white hover:bg-gray-700"
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>

      {/* Tailwind Styling for Dots */}
      <style jsx global>{`
        .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background: white;
          width: 30px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  )
}

export default HeroBanner
