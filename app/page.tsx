"use client";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "./components/Footer";

const indianStates = [
  { name: "Andhra Pradesh", image: "/images/Andhra-Pradesh.png" },
  { name: "Arunachal Pradesh", image: "/images/arunachal-pradesh.jpeg" },
  { name: "Assam", image: "/images/assam.jpeg" },
  { name: "Bihar", image: "/images/Bihar.jpg" },
  { name: "Goa", image: "/images/Goa.jpg" },
  { name: "Gujarat", image: "/images/Gujarat.jpeg" },
  { name: "Haryana", image: "/images/haryana.jpeg" },
  { name: "Himachal Pradesh", image: "/images/himachal-pradesh.jpg" },
  { name: "Jharkhand", image: "/images/jharkhand.jpeg" },
  { name: "Karnataka", image: "/images/Karnataka.jpg" },
  { name: "Kerala", image: "/images/Kerela.jpg" },
  { name: "Madhya Pradesh", image: "/images/madhya-pradesh.jpg" },
  { name: "Maharashtra", image: "/images/Maharashtra.jpg" },
  { name: "Manipur", image: "/images/manipur.jpg" },
  { name: "Meghalaya", image: "/images/meghalaya.jpg" },
  { name: "Mizoram", image: "/images/mizoram.jpg" },
  { name: "Nagaland", image: "/images/nagaland.jpg" },
  { name: "Odisha", image: "/images/Odisha.jpg" },
  { name: "Punjab", image: "/images/punjab.jpg" },
  { name: "Rajasthan", image: "/images/rajasthan.jpeg" },
  { name: "Sikkim", image: "/images/sikkhim.jpg" },
  { name: "Tamil Nadu", image: "/images/Tamil-Nadu.jpg" },
  { name: "Telangana", image: "/images/Telangana.jpeg" },
  { name: "Tripura", image: "/images/tripura.jpg" },
  { name: "Uttar Pradesh", image: "/images/uttar-pradesh.jpg" },
  { name: "Uttarakhand", image: "/images/uttarakhand.jpg" },
  { name: "West Bengal", image: "/images/west-bengal.jpeg" },
  { name: "Delhi", image: "/images/india-gate.jpg" },
  { name: "Jammu & Kashmir", image: "/images/jammu-kashmir.jpg" },
  { name: "Andaman & Nicobar", image: "/images/andaman.jpeg" },
];

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <div className="relative w-full h-[90vh]">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/banner.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            <h1 className="text-5xl font-bold">TripTales India</h1>
            <p className="text-2xl font-semibold mt-2">
              Where Every Destination Becomes a Story
            </p>
            <button className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mt-6">
              Explore India
            </button>
          </div>
        </div>
      </div>

      {/* States Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Explore All States & Union Territories
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {indianStates.map((state, index) => {
              const stateSlug = state.name
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/&/g, "and");
              return (
                <Link key={index} href={`/states/${stateSlug}`}>
                  <Card className="group cursor-pointer overflow-hidden border-2 border-transparent hover:border-orange-300 transition-all duration-300 hover:shadow-2xl bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden">
                        <Image
                          src={state.image || "/placeholder.svg"}
                          alt={`${state.name} tourism destination`}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      <div className="p-4">
                        <h4 className="text-lg font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-300 text-center">
                          {state.name}
                        </h4>
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
