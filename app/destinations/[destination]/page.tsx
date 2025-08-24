"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import dynamic from "next/dynamic";

interface Destination {
  _id: string;
  name: string;
  description: string;
  images: string[];
  state: string;
  bestTimeToVisit: string;
  travelTips: string;
  averageBudget: string;
  latitude: number;
  longitude: number;
}

// Dynamically import the map component outside of the main function
const Map = dynamic(() => import("../../components/MapComponent"), {
  ssr: false,
  loading: () => <p className="text-center text-gray-600">Loading map...</p>,
});

export default function DestinationPage() {
  const params = useParams();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const destinationSlug = params.destination as string;
  const destinationName = destinationSlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/destinations`);
        if (!response.ok) {
          throw new Error("Failed to fetch destinations");
        }
        const data = await response.json();
        const foundDestination = data.find(
          (dest: Destination) =>
            dest.name.toLowerCase().replace(/\s+/g, "-") === destinationSlug
        );

        if (!foundDestination) {
          throw new Error("Destination not found");
        }

        setDestination(foundDestination);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [destinationSlug]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-gray-600">Loading destination...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Destination Not Found
            </h1>
            <p className="text-gray-600">
              The destination you're looking for doesn't exist.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* Hero Section with Main Image */}
      <section className="relative h-[60vh]">
        <Image
          src={destination.images[0] || "/placeholder.svg"}
          alt={destination.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            <h1 className="text-5xl font-bold mb-4">{destination.name}</h1>
            <p className="text-xl">{destination.state}</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-16 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                About {destination.name}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {destination.description}
              </p>

              {/* Image Gallery Carousel */}
              {destination.images.length > 1 && (
                <div className="px-12">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Gallery
                  </h3>
                  <Carousel className="w-full max-w-4xl">
                    <CarouselContent>
                      {destination.images.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="relative h-96 rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={image}
                              alt={`${destination.name} ${index + 1}`}
                              fill
                              className="object-contain"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="text-black border-black hover:bg-black hover:text-white font-bold" />
                    <CarouselNext className="text-black border-black hover:bg-black hover:text-white font-bold" />
                  </Carousel>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Best Time to Visit
                </h3>
                <p className="text-gray-600">{destination.bestTimeToVisit}</p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Average Budget
                </h3>
                <p className="text-gray-600">
                  {destination.averageBudget
                    ?.split(".")
                    .map((tip, index) =>
                      tip.trim() ? <li key={index}>{tip.trim()}</li> : null
                    )}
                </p>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Travel Tips
                </h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  {destination.travelTips
                    ?.split(".")
                    .map((tip, index) =>
                      tip.trim() ? <li key={index}>{tip.trim()}</li> : null
                    )}
                </ul>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Location on Map
            </h2>
            <div className="rounded-lg overflow-hidden shadow-lg border">
              <Map
                lat={destination.latitude}
                lng={destination.longitude}
                title={destination.name}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
