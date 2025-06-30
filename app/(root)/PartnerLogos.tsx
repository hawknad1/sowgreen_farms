import React from "react"
import Image from "next/image"

const PartnerLogos = () => {
  // Array of partner logos - replace with your actual suppliers
  const partners = [
    { id: 1, name: "Sowgreen Organic", logo: "/images/logo.png" },
    { id: 2, name: "Kawa Moka", logo: "/images/kawa-moka.png" },
    { id: 3, name: "Visa", logo: "/images/visa.png" },
    { id: 4, name: "Mastercard", logo: "/images/mastercard.png" },
    { id: 5, name: "Paypal", logo: "/images/paypal.png" },
    { id: 6, name: "Hendy Farms", logo: "/svg/hendy.svg" },
  ]

  // Duplicate the array to create seamless looping
  const duplicatedPartners = [...partners, ...partners]

  return (
    <section className="py-12  overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative w-full">
          {/* Gradient fade effects */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-gray-50 to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-gray-50 to-transparent z-10" />

          {/* Marquee container */}
          <div className="flex overflow-x-hidden">
            <div className="flex items-center py-4 animate-marquee whitespace-nowrap">
              {duplicatedPartners.map((partner) => (
                <div
                  key={`${partner.id}-${Math.random()}`}
                  className="mx-8 flex-shrink-0 flex flex-col items-center"
                >
                  <div className="h-16 w-32 md:h-20 md:w-40 relative grayscale hover:grayscale-0 transition-all duration-300">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      className="object-contain"
                      quality={100}
                    />
                  </div>
                  <span className="mt-2 text-xs text-gray-500 text-center hidden md:block">
                    {partner.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PartnerLogos
