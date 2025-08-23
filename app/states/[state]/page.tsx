"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Card, CardContent } from "@/components/ui/card";

interface Destination {
  _id: string;
  name: string;
  images: string[];
  state: string;
}

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
  "Puducherry",
  "Andaman & Nicobar",
  "Chandigarh",
  "Dadra & Nagar Haveli",
  "Lakshadweep",
];

export default function StatePage() {
  const params = useParams();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const stateSlug = params.state as string;

  // Helper to convert slug to state name
  function slugToStateName(slug: string) {
    // Convert slug to lower case and compare with all states
    const formatted = slug.replace(/-/g, " ").toLowerCase();
    return (
      indianStates.find(
        (state) =>
          state
            .toLowerCase()
            .replace(/&/g, "and")
            .replace(/\s+/g, " ")
            .trim() === formatted
      ) ||
      // fallback: capitalize words
      slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );
  }

  const stateName = slugToStateName(stateSlug);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/destinations/state/${encodeURIComponent(
            stateName
          )}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch destinations");
        }
        const data = await response.json();
        setDestinations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [stateName]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-gray-600">Loading destinations...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {stateName}
            </h1>
            <p className="text-gray-600">
              No destinations found for this state yet.
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

      <section className="py-16 bg-gradient-to-r from-orange-50 to-green-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Explore {stateName}
          </h1>
          <p className="text-lg text-gray-600">
            Discover amazing destinations in {stateName}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Popular Destinations in {stateName}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {destinations.map((destination) => {
              const destinationSlug = destination.name
                .toLowerCase()
                .replace(/\s+/g, "-");
              return (
                <Link
                  key={destination._id}
                  href={`/destinations/${destinationSlug}`}
                >
                  <Card className="group cursor-pointer overflow-hidden border-2 border-transparent hover:border-orange-300 transition-all duration-300 hover:shadow-2xl bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-0 ">
                      <div className="relative overflow-hidden">
                        <Image
                          src={destination.images[0] || "/placeholder.svg"}
                          alt={`${destination.name} destination`}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-300 text-center">
                          {destination.name}
                        </h3>
                        <div className="mt-2 h-1 bg-gradient-to-r from-orange-400 to-green-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
