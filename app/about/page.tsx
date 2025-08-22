import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh]">
        <Image
          src="/images/about.jpg"
          alt="About TripTales India"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            <h1 className="text-5xl font-bold mb-4">About TripTales India</h1>
            <p className="text-xl">Discover the incredible stories behind India's destinations</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-16 lg:px-24">
          <div className="max-w-4xl mx-auto">
            
            {/* Our Story */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                TripTales India was born from a passion for storytelling and a deep love for India's diverse landscapes, 
                rich culture, and incredible heritage. We believe that every destination has a story to tell, and every 
                journey creates memories that last a lifetime.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Founded by travel enthusiasts who have explored every corner of India, we curate authentic experiences 
                that go beyond typical tourist attractions. From the snow-capped peaks of the Himalayas to the pristine 
                beaches of Goa, we help you discover the real India.
              </p>
            </div>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
                <p className="text-gray-600">
                  To make travel planning effortless and inspire travelers to explore India's hidden gems 
                  through personalized recommendations and authentic local experiences.
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
                <p className="text-gray-600">
                  To become India's most trusted travel companion, connecting travelers with unforgettable 
                  experiences while promoting sustainable and responsible tourism.
                </p>
              </div>
            </div>

            {/* What We Offer */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">What We Offer</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6">
                  <div className="text-4xl mb-4">🗺️</div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">Destination Guides</h4>
                  <p className="text-gray-600">Comprehensive guides for every state and union territory in India</p>
                </div>
                <div className="text-center p-6">
                  <div className="text-4xl mb-4">🤖</div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">AI Trip Planner</h4>
                  <p className="text-gray-600">Smart trip planning powered by artificial intelligence</p>
                </div>
                <div className="text-center p-6">
                  <div className="text-4xl mb-4">🎬</div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">Cinephile Tours</h4>
                  <p className="text-gray-600">Visit iconic Bollywood and regional cinema shooting locations</p>
                </div>
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-blue-50 p-8 rounded-lg">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Why Choose TripTales India?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">✅</span>
                  <div>
                    <h4 className="font-semibold text-gray-800">Local Expertise</h4>
                    <p className="text-gray-600">Insights from local experts and experienced travelers</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl mr-3">✅</span>
                  <div>
                    <h4 className="font-semibold text-gray-800">Authentic Experiences</h4>
                    <p className="text-gray-600">Discover hidden gems and off-the-beaten-path destinations</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl mr-3">✅</span>
                  <div>
                    <h4 className="font-semibold text-gray-800">Personalized Planning</h4>
                    <p className="text-gray-600">Customized itineraries based on your preferences and budget</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl mr-3">✅</span>
                  <div>
                    <h4 className="font-semibold text-gray-800">24/7 Support</h4>
                    <p className="text-gray-600">Round-the-clock assistance for all your travel needs</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}