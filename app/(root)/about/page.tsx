import Head from "next/head"
import Image from "next/image"

export default function About() {
  return (
    <>
      <Head>
        <title>About Us - FreshGrocery</title>
        <meta
          name="description"
          content="Learn more about FreshGrocery and our mission."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="py-20 bg-green-100">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-5xl font-bold text-green-800 mb-6">
              About Sowgreen Organic Farms
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              At Sowgreen Farms, we believe in providing the freshest produce
              and groceries directly to your doorstep. Our mission is to make
              healthy eating accessible and affordable for everyone.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h3 className="text-4xl font-bold text-green-700 mb-12 text-center">
              Our Mission
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Left Column */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-red-500 text-center">
                  Our journey into organic farming began in 2012.
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  We value the idea of growing purely organic vegetables and
                  fruits. Our journey into organic farming began in 2012 when we
                  purchased some land for the sole purpose of growing
                  pineapples. We hired a couple of local farmers who were
                  already growing pineapples on small farms next to our land to
                  also grow pineapples on ours. The estimates and projections
                  they gave us to cultivate pineapples turned out to be very
                  optimistic and inaccurate.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Whilst pondering over these issues for a solution, a relative
                  who eats only organic foods sent us some vegetable seeds to
                  plant at the pineapple farm, and this is where the idea of an
                  organic vegetable farm really took off! We started off by
                  growing 15 different vegetables 5 years ago. Today we grow
                  over 40 different vegetables and have added fruits to our
                  product line.
                </p>
              </div>

              {/* Right Column */}
              <div className="flex items-center justify-center">
                <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <Image
                    src="/images/forBanner.jpg"
                    alt="Fresh Produce"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <h3 className="text-4xl font-bold text-green-700 mb-12 text-center">
              Meet Our Team
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Team Member 1 */}
              <div className="text-center">
                <img
                  src="/images/placeholder.png"
                  alt="Team Member 1"
                  className="rounded-full w-32 h-32 mx-auto mb-4 shadow-md"
                />
                <h4 className="text-xl font-bold text-green-700">Jane Doe</h4>
                <p className="text-gray-700">Founder & CEO</p>
              </div>
              {/* Team Member 2 */}
              <div className="text-center">
                <img
                  src="/images/placeholder.png"
                  alt="Team Member 2"
                  className="rounded-full w-32 h-32 mx-auto mb-4 shadow-md"
                />
                <h4 className="text-xl font-bold text-green-700">John Smith</h4>
                <p className="text-gray-700">Chief Operations Officer</p>
              </div>
              {/* Team Member 3 */}
              <div className="text-center">
                <img
                  src="/images/placeholder.png"
                  alt="Team Member 3"
                  className="rounded-full w-32 h-32 mx-auto mb-4 shadow-md"
                />
                <h4 className="text-xl font-bold text-green-700">
                  Emily Johnson
                </h4>
                <p className="text-gray-700">Marketing Manager</p>
              </div>
              {/* Team Member 4 */}
              <div className="text-center">
                <img
                  src="/images/placeholder.png"
                  alt="Team Member 4"
                  className="rounded-full w-32 h-32 mx-auto mb-4 shadow-md"
                />
                <h4 className="text-xl font-bold text-green-700">
                  Michael Brown
                </h4>
                <p className="text-gray-700">Supply Chain Specialist</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
