"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import dynamic from "next/dynamic";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useCineplaceStore from "@/store/cineplaceStore";

const Map = dynamic(() => import("../../components/MapComponent"), {
  ssr: false,
  loading: () => <p className="text-center text-gray-600">Loading map...</p>,
});

export default function CineplacePage() {
  const params = useParams();
  const [cineplace, setCineplace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cineplaceSlug = params.cineplace as string;
  const cineplaceName = cineplaceSlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const { cineplaces, fetchCineplaces } = useCineplaceStore();

  useEffect(() => {
    const fetchCineplace = async () => {
      try {
        // First try to get from store
        if (cineplaces.length === 0) {
          await fetchCineplaces();
        }

        // Find cineplace by slug
        const foundCineplace = cineplaces.find(
          (cp: any) =>
            cp.name.toLowerCase().replace(/\s+/g, "-") === cineplaceSlug
        );

        if (!foundCineplace) {
          throw new Error("Cineplace not found");
        }

        setCineplace(foundCineplace);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCineplace();
  }, [cineplaceSlug, cineplaces, fetchCineplaces]);

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-gray-400">
            Loading cinematic location...
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !cineplace) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">
              Location Not Found
            </h1>
            <p className="text-gray-400">
              The cinematic location you're looking for doesn't exist.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />

      {/* Hero Section with Main Image */}
      <section className="relative h-[70vh]">
        <Image
          src={cineplace.images[0] || "/placeholder.svg"}
          alt={cineplace.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 inline-block">
              🎬 {cineplace.movie}
            </div>
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
              {cineplace.name}
            </h1>
            <p className="text-2xl text-yellow-400 mb-2">
              📍 {cineplace.state}
            </p>
            <p className="text-lg text-gray-300">Where Cinema Comes to Life</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-16 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="text-4xl font-bold text-yellow-400 mb-6">
                🎭 About This Location
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                {cineplace.description}
              </p>

              {/* Image Gallery Carousel */}
              {cineplace.images.length > 1 && (
                <div className="px-12">
                  <h3 className="text-3xl font-bold text-yellow-400 mb-6">
                    🎥 Behind the Scenes Gallery
                  </h3>
                  <Carousel className="w-full max-w-4xl">
                    <CarouselContent>
                      {cineplace.images.map((image: string, index: number) => (
                        <CarouselItem key={index}>
                          <div className="relative h-96 rounded-lg overflow-hidden bg-gray-800">
                            <Image
                              src={image}
                              alt={`${cineplace.name} ${index + 1}`}
                              fill
                              className="object-contain"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-black font-bold" />
                    <CarouselNext className="text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-black font-bold" />
                  </Carousel>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-red-900 to-red-700 p-6 rounded-lg border border-red-500">
                <h3 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center">
                  🎬 Featured Movie
                </h3>
                <p className="text-white text-lg font-semibold">
                  {cineplace.movie}
                </p>
              </div>

              <div className="bg-gradient-to-br from-yellow-900 to-yellow-700 p-6 rounded-lg border border-yellow-500">
                <h3 className="text-2xl font-bold text-black mb-4 flex items-center">
                  🗓️ Best Time to Visit
                </h3>
                <p className="text-black font-semibold">
                  {cineplace.bestTimeToVisit}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-900 to-green-700 p-6 rounded-lg border border-green-500">
                <h3 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center">
                  💰 Average Budget
                </h3>
                <p className="text-white font-semibold">
                  {cineplace.averageBudget}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-900 to-purple-700 p-6 rounded-lg border border-purple-500">
                <h3 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center">
                  💡 Cinephile Tips
                </h3>
                <p className="text-white">{cineplace.travelTips}</p>
              </div>

              {/* Action Button
              <div className="bg-gradient-to-r from-yellow-500 to-red-500 p-6 rounded-lg text-center">
                <h3 className="text-xl font-bold text-black mb-4">Ready for Your Movie Scene?</h3>
                <button className="bg-black text-yellow-400 font-bold px-6 py-3 rounded-full hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 border-2 border-yellow-400">
                  🎭 Plan Your Visit
                </button>
              </div> */}
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white-800 mb-6 text-center">
              Location on Map
            </h2>
            <div className="rounded-lg overflow-hidden shadow-lg border">
              <Map
                lat={cineplace.latitude}
                lng={cineplace.longitude}
                title={cineplace.name}
                imageUrl={cineplace.images[0]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-red-900 to-purple-900">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold mb-4 text-yellow-400">
            🎬 More Cinematic Adventures Await
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
            Discover more iconic Bollywood locations and step into your favorite
            movie scenes.
          </p>
          <button className="bg-gradient-to-r from-yellow-500 to-red-500 text-black font-bold px-8 py-4 rounded-full hover:from-yellow-400 hover:to-red-400 transition-all duration-300 transform hover:scale-105 text-lg">
            🎭 Explore More Locations
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
