// "use client"
// import { Badge } from "@/components/ui/badge"
// import { Product } from "@/types"
// import Image from "next/image"
// import React, { useState } from "react"

// interface ProductImagesProps {
//   product: Product
// }

// const ProductImages = ({ product }: ProductImagesProps) => {
//   const [index, setIndex] = useState(0)
//   return (
//     <div>
//       <div className="h-[500px] relative">
//         <Image
//           src={product?.images[index]?.url}
//           alt=""
//           fill
//           sizes="50vw"
//           className="object-contain rounded-md p-2 bg-gray-100"
//         />
//         <div className="absolute right-5 top-3">
//           {product?.isInStock === "out-of-stock" ? (
//             <Badge className="bg-gray-500/25 text-gray-500 hover:disabled:pointer-events-none">
//               Out of stock
//             </Badge>
//           ) : product?.discount ? (
//             <Badge className="bg-red-500/85">
//               <p className="text-[10px] text-white tracking-wide">
//                 {product?.discount}% OFF
//               </p>
//             </Badge>
//           ) : null}
//         </div>
//       </div>
//       <div className="flex justify-between gap-4">
//         {product?.images.map((img, i) => (
//           <div
//             className="w-1/4 h-32 relative gap-4 mt-8 cursor-pointer bg-gray-100 rounded-md"
//             key={img.publicId}
//             onClick={() => setIndex(i)}
//           >
//             <Image
//               src={img.url}
//               alt=""
//               fill
//               sizes="30vw"
//               className="object-contain p-2"
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default ProductImages

"use client"
import { Badge } from "@/components/ui/badge"
import { Product } from "@/types"
import Image from "next/image"
import React, { useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { FreeMode, Navigation, Thumbs } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/navigation"
import "swiper/css/thumbs"

interface ProductImagesProps {
  product: Product
}

const ProductImages = ({ product }: ProductImagesProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="space-y-4">
      {/* Main Image with Swiper */}
      <div className="relative aspect-square w-full rounded-lg bg-gray-50 overflow-hidden">
        <Swiper
          spaceBetween={10}
          navigation={true}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Navigation, Thumbs]}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="h-full w-full"
        >
          {product.images.map((img) => (
            <SwiperSlide key={img.publicId}>
              <Image
                src={img.url}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Badge */}
        <div className="absolute top-3 right-3 z-10">
          {product.isInStock === "out-of-stock" ? (
            <Badge variant="outline" className="bg-gray-100/90 text-gray-600">
              Out of stock
            </Badge>
          ) : product.discount ? (
            <Badge className="bg-red-500 hover:bg-red-600">
              {product.discount}% OFF
            </Badge>
          ) : null}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      <div className="px-2">
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={8}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="thumbnail-gallery"
        >
          {product.images.map((img, index) => (
            <SwiperSlide key={img.publicId}>
              <button
                className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                  activeIndex === index
                    ? "border-primary"
                    : "border-transparent"
                }`}
                onClick={() => setActiveIndex(index)}
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  sizes="100px"
                  className="object-cover"
                />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default ProductImages
