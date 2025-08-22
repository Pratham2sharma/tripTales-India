"use client";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import useCineplaceStore from "@/store/cineplaceStore";

interface Cineplace {
  _id: string;
  name: string;
  description: string;
  movie: string;
  images: string[];
  state: string;
  bestTimeToVisit: string;
  travelTips: string;
  averageBudget: string;
}

// Sample data for demonstration
const sampleCineplaces: Cineplace[] = [
  {
    _id: "1",
    name: "Chapora Fort",
    description: "The iconic fort where the famous 'Dil Chahta Hai' scenes were shot, offering breathtaking views of the Arabian Sea.",
    movie: "Dil Chahta Hai",
    images: ["/images/chapora-fort.webp"],
    state: "Goa",
    bestTimeToVisit: "October to March",
    travelTips: "Visit during sunset for the best views and photography",
    averageBudget: "₹2,000 - ₹3,000 per day"
  },
  {
    _id: "2", 
    name: "Dudhsagar Falls",
    description: "The majestic waterfall featured in multiple Bollywood films, cascading from a height of 310 meters.",
    movie: "Chennai Express",
    images: ["/images/dudhsagar.jpg"],
    state: "Goa",
    bestTimeToVisit: "June to September",
    travelTips: "Book train tickets in advance for the scenic route",
    averageBudget: "₹3,000 - ₹4,000 per day"
  },
  {
    _id: "3",
    name: "Arpora Saturday Night Market",
    description: "The vibrant night market where several Bollywood party sequences have been filmed.",
    movie: "Go Goa Gone",
    images: ["/images/arpora-market.jpg"],
    state: "Goa", 
    bestTimeToVisit: "November to February",
    travelTips: "Visit on Saturday evenings for the full experience",
    averageBudget: "₹1,500 - ₹2,500 per day"
  }
];

export default function CinephilePage() {
  const { cineplaces, loading, error, fetchCineplaces } = useCineplaceStore();

  useEffect(() => {
    fetchCineplaces();
  }, [fetchCineplaces]);

  // Use sample data if no cineplaces from API
  const displayCineplaces = cineplaces.length > 0 ? cineplaces : sampleCineplaces;

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-red-900/80"></div>
        <video 
          className="w-full h-full object-cover" 
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src="/videos/banner.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
              🎬 CINEPHILE DESTINATIONS
            </h1>
            <p className="text-2xl font-semibold mb-6">Where Bollywood Dreams Come Alive</p>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Discover the iconic locations where your favorite movies were shot. 
              Step into the scenes and live the cinematic magic.
            </p>
          </div>
        </div>
      </section>

      {/* Cinema Places Grid */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 md:px-16 lg:px-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
              🎭 ICONIC MOVIE LOCATIONS
            </h2>
            <p className="text-gray-400 text-lg">Experience the magic of cinema in real life</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-xl text-gray-400">Loading cinematic destinations...</div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-xl text-red-400">Using sample data: {error}</div>
            </div>
          ) : null}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayCineplaces.map((cineplace) => (
                <Card key={cineplace._id} className="group bg-gray-800 border-gray-700 hover:border-yellow-500 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-500/20 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <Image
                        src={cineplace.images[0] || "/placeholder.svg"}
                        alt={cineplace.name}
                        width={400}
                        height={250}
                        className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Movie Badge */}
                      <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        🎬 {cineplace.movie}
                      </div>
                      
                      {/* State Badge */}
                      <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                        📍 {cineplace.state}
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors duration-300">
                        {cineplace.name}
                      </h3>
                      
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                        {cineplace.description}
                      </p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-green-400">
                          <span className="mr-2">💰</span>
                          <span>{cineplace.averageBudget}</span>
                        </div>
                        <div className="flex items-center text-blue-400">
                          <span className="mr-2">🗓️</span>
                          <span>{cineplace.bestTimeToVisit}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <Link href={`/cineplaces/${cineplace.name.toLowerCase().replace(/\s+/g, '-')}`}>
                          <button className="w-full bg-gradient-to-r from-yellow-500 to-red-500 text-black font-bold py-2 px-4 rounded-lg hover:from-yellow-400 hover:to-red-400 transition-all duration-300 transform hover:scale-105">
                            🎭 Explore Location
                          </button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-900 to-red-900">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4 text-white">Ready for Your Cinematic Journey?</h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of movie lovers who have experienced the magic of Bollywood locations firsthand.
          </p>
          <button className="bg-yellow-500 text-black font-bold px-8 py-3 rounded-full hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105">
            🎬 Start Your Movie Tour
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}