import React from "react";

import DestinationCard from "./DestinationCard";

interface Destination {
  _id: string;
  name: string;
  images: string[]; // It's an array of strings
  state: string;
  description: string;
  averageBudget?: string; // It's an optional string
}

interface DestinationGridProps {
  destinations: Destination[];
}

const DestinationGrid: React.FC<DestinationGridProps> = ({ destinations }) => {
  if (destinations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 bg-gray-50 rounded-lg">
        <h3 className="text-2xl font-bold text-gray-700">
          No Destinations Found
        </h3>
        <p className="text-gray-500 mt-2">
          Try adjusting your filters to find your next adventure!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {destinations.map((destination) => (
        <DestinationCard key={destination._id} destination={destination} />
      ))}
    </div>
  );
};

export default DestinationGrid;
