import Head from "next/head"
import {
  FaMapMarkerAlt,
  FaPhone,
  FaClock,
  FaCar,
  FaParking,
  FaWheelchair,
} from "react-icons/fa"

export default function PickupLocations() {
  const locations = [
    {
      id: 1,
      name: "Dzorwulu",
      address: "14 High Street",
      phone: "+ (233) 241 234 234",
      hours: {
        // weekdays: "8:00 AM - 8:00 PM",
        Wednesday: "8:00 AM - 8:00 PM",
        // sunday: "10:00 AM - 6:00 PM",
      },
      features: ["In-store pickup"],

      //   features: ["Curbside pickup", "Free parking", "Wheelchair accessible"],
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.7012008338743!2d-0.21644662650183438!3d5.611072233096514!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9bce4831b277%3A0xf315c7b42abe6b8f!2s8%20Lincoln%20Rd%2C%20Ama_4!5e0!3m2!1sen!2sgh!4v1753652571997!5m2!1sen!2sgh",
    },
    {
      id: 2,
      name: "Parks & Gardens",
      address: "Jawaharlal Nehru Road, Accra",
      phone: "+ (233) 241 234 234",
      hours: {
        weekdays: "7:00 AM - 9:00 PM",
        saturday: "8:00 AM - 8:00 PM",
        sunday: "9:00 AM - 7:00 PM",
      },
      features: ["In-store pickup"],

      //   features: ["Drive-thru pickup", "Ample parking"],
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.885466862246!2d-0.18254072650197642!3d5.583943233371167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9af322b06b95%3A0xb01ac89a4aa3926e!2sDepartment%20Of%20Parks%20And%20Gardens!5e0!3m2!1sen!2sgh!4v1753650732057!5m2!1sen!2sgh",
    },
    {
      id: 3,
      name: "W.E.B Du Bois Centre",
      address: "Fifth Link Rd, Accra",
      phone: "+ (233) 241 234 234",
      hours: {
        // weekdays: "9:00 AM - 7:00 PM",
        saturday: "8:00 AM - 8:00 PM",
        // sunday: "10:00 AM - 5:00 PM",
      },
      features: ["In-store pickup"],
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.8964874697485!2d-0.1735553265019533!3d5.582316533387576!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9aec8728020b%3A0xb4a3b9b484354b70!2sW.E.B%20Du%20Bois%20Memorial%20Centre%20for%20Panafrican%20Culture%20-%20Ghana!5e0!3m2!1sen!2sgh!4v1753650195161!5m2!1sen!2sgh",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Pickup Locations - Your Grocery Shop</title>
        <meta
          name="description"
          content="Find our convenient pickup locations for your grocery orders"
        />
      </Head>

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-4">
            Our Pickup Locations
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Choose the most convenient location to pick up your fresh produce
            straight from the farm.
          </p>
        </section>

        {/* Location Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {locations.map((location) => (
            <div
              key={location.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Map Embed */}
              <div className="h-48 w-full relative">
                <iframe
                  src={location.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title={`Map of ${location.name}`}
                ></iframe>
              </div>

              {/* Location Info */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  {location.name}
                </h2>

                {/* Address */}
                <div className="flex items-start mb-3">
                  <FaMapMarkerAlt className="text-green-600 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-gray-600">{location.address}</p>
                </div>

                {/* Phone */}
                <div className="flex items-center mb-3">
                  <FaPhone className="text-green-600 mr-3" />
                  <a
                    // href={`tel:${location.phone.replace(/\D/g, "")}`}
                    className="text-gray-600 hover:text-green-600 transition-colors"
                  >
                    {location.phone}
                  </a>
                </div>

                {/* Hours */}
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <FaClock className="text-green-600 mr-2" />
                    Hours
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {/* <li className="flex justify-between">
                      <span>Mon-Fri:</span>
                      <span>{location.hours.weekdays}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Saturday:</span>
                      <span>{location.hours.saturday}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Sunday:</span>
                      <span>{location.hours.sunday}</span>
                    </li> */}
                    <li className="flex justify-between">
                      {location.hours.Wednesday ? (
                        <span>Wednesday: {location.hours.Wednesday}</span>
                      ) : (
                        <span>Saturday: {location.hours.saturday}</span>
                      )}
                      {/* <span>Mon-Fri:</span>
                      <span>{location.hours.weekdays}</span> */}
                    </li>
                    {/* <li className="flex justify-between">
                      <span>Saturday:</span>
                      <span>{location.hours.saturday}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Sunday:</span>
                      <span>{location.hours.sunday}</span>
                    </li> */}
                  </ul>
                </div>

                {/* Features */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Location Features
                  </h3>
                  <ul className="space-y-2">
                    {location.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-sm text-gray-600"
                      >
                        {feature.includes("parking") && (
                          <FaParking className="text-green-600 mr-2" />
                        )}
                        {feature.includes("pickup") && (
                          <FaCar className="text-green-600 mr-2" />
                        )}
                        {feature.includes("accessible") && (
                          <FaWheelchair className="text-green-600 mr-2" />
                        )}
                        {!feature.includes("parking") &&
                          !feature.includes("pickup") &&
                          !feature.includes("accessible") && (
                            <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          )}
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Directions Button */}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-block w-full text-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Get Directions
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <section className="mt-16 bg-green-50 rounded-xl p-8 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
            Pickup Instructions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                When You Arrive
              </h3>
              <p className="text-gray-600 text-sm">
                Park in designated pickup spots and call the store number
                provided in your confirmation email. Your order will be brought
                out to you within 5 minutes.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Payment Options
              </h3>
              <p className="text-gray-600 text-sm">
                Pay online when you order or pay in person at pickup. We accept
                all major credit cards, mobile payments, and cash.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Safety Measures
              </h3>
              <p className="text-gray-600 text-sm">
                All our staff wear masks and gloves during order preparation and
                delivery. We sanitize all surfaces and bags regularly.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
