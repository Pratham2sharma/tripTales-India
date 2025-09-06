import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <Image
          src="/images/about.jpg"
          alt="About TripTales India"
          fill
          className="object-cover scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center max-w-4xl px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
              About TripTales India
            </h1>
            <p className="text-xl md:text-2xl font-light leading-relaxed">
              Discover the incredible stories behind India&apos;s destinations
            </p>
            <div className="mt-8 h-1 w-32 bg-gradient-to-r from-orange-400 to-green-400 mx-auto rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gradient-to-b from-orange-50/30 to-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Story</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-green-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                TripTales India was born from a passion for storytelling and a
                deep love for India&apos;s diverse landscapes, rich culture, and
                incredible heritage. We believe that every destination has a
                story to tell, and every journey creates memories that last a
                lifetime.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Founded by travel enthusiasts who have explored every corner of
                India, we curate authentic experiences that go beyond typical
                tourist attractions. From the snow-capped peaks of the Himalayas
                to the pristine beaches of Goa, we help you discover the real
                India.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-100 to-green-100 p-8 rounded-2xl shadow-lg">
                <div className="text-6xl text-center mb-4">🇮🇳</div>
                <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
                  Incredible India Awaits
                </h3>
                <p className="text-gray-600 text-center">
                  Join thousands of travelers who have discovered India through
                  our platform
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl shadow-lg border border-orange-200 hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-6 text-orange-600">🎯</div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">
                Our Mission
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                To make travel planning effortless and inspire travelers to
                explore India&apos;s hidden gems through personalized
                recommendations and authentic local experiences.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-lg border border-green-200 hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-6 text-green-600">👁️</div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">
                Our Vision
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                To become India&apos;s most trusted travel companion, connecting
                travelers with unforgettable experiences while promoting
                sustainable and responsible tourism.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 bg-gradient-to-b from-green-50/30 to-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              What We Offer
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-green-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="text-5xl mb-6 text-center group-hover:scale-110 transition-transform duration-300">
                🗺️
              </div>
              <h4 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Destination Guides
              </h4>
              <p className="text-gray-600 text-center leading-relaxed">
                Comprehensive guides for every state and union territory in
                India with insider tips and local insights
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="text-5xl mb-6 text-center group-hover:scale-110 transition-transform duration-300">
                🤖
              </div>
              <h4 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                AI Trip Planner
              </h4>
              <p className="text-gray-600 text-center leading-relaxed">
                Smart trip planning powered by artificial intelligence for
                personalized travel experiences
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="text-5xl mb-6 text-center group-hover:scale-110 transition-transform duration-300">
                🎬
              </div>
              <h4 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Cinephile Tours
              </h4>
              <p className="text-gray-600 text-center leading-relaxed">
                Visit iconic Bollywood and regional cinema shooting locations
                across India
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose TripTales India?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-green-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <div className="flex items-start">
                <div className="text-3xl mr-4 text-green-500">✅</div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    Local Expertise
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Insights from local experts and experienced travelers who
                    know India inside out
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <div className="flex items-start">
                <div className="text-3xl mr-4 text-green-500">✅</div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    Authentic Experiences
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Discover hidden gems and off-the-beaten-path destinations
                    for unique adventures
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <div className="flex items-start">
                <div className="text-3xl mr-4 text-green-500">✅</div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    Personalized Planning
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Customized itineraries based on your preferences, budget,
                    and travel style
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <div className="flex items-start">
                <div className="text-3xl mr-4 text-green-500">✅</div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    {" "}
                    Effortless Exploration
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Discover, plan, and organize your journey through a
                    stunning, user-friendly design.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-green-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Explore India?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who have discovered incredible India
            through TripTales. Start your journey today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tripplanner">
              <button className="bg-white text-orange-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg">
                Plan Your Trip
              </button>
            </Link>
            <Link href="/filter">
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-orange-600 transition-colors duration-300">
                Explore Destinations
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
