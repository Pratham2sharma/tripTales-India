import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Destination {
  _id: string;
  name: string;
  images: string[];
  state: string;
  description: string;
  averageBudget?: string;
}

interface DestinationCardProps {
  destination: Destination;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
  const destinationSlug = destination.name
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <Link href={`/destinations/${destinationSlug}`}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer">
        <div className="relative h-48 w-full">
          <Image
            src={destination.images?.[0] || "/placeholder-image.jpg"}
            alt={destination.name}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-bold text-gray-900">{destination.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{destination.state}</p>
          {/* <p className="mt-4 text-sm font-semibold text-indigo-600">
            Avg. Budget: {destination.averageBudget || "N/A"}
          </p> */}
        </div>
      </div>
    </Link>
  );
};

export default DestinationCard;
