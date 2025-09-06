"use client";

import React, { useState, useEffect, useMemo } from "react";
import useDestinationStore from "@/store/destinationStore";
import FilterSidebar from "../components/FilterSidebar";
import DestinationGrid from "../components/DestinationGrid";
import Pagination from "../components/Pagination"; // <-- Import Pagination
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const DESTINATIONS_PER_PAGE = 9; // <-- Define how many items per page

const FilterPage = () => {
  const { destinations, loading, error, fetchDestinations } =
    useDestinationStore();

  // State for filters
  const [selectedState, setSelectedState] = useState("All States");
  const [searchQuery, setSearchQuery] = useState("");
  const [maxBudget, setMaxBudget] = useState("");

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  // Derived state for unique states list
  const uniqueStates = useMemo(() => {
    const states = destinations.map((dest) => dest.state);
    return [...new Set(states)].sort();
  }, [destinations]);

  // Apply filters to the destinations
  const filteredDestinations = useMemo(() => {
    return destinations.filter((destination) => {
      const stateMatch =
        selectedState === "All States" || destination.state === selectedState;
      const searchMatch = destination.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const budgetMatch =
        !maxBudget ||
        (destination.averageBudget &&
          parseFloat(destination.averageBudget) <= parseFloat(maxBudget));
      return stateMatch && searchMatch && budgetMatch;
    });
  }, [destinations, selectedState, searchQuery, maxBudget]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedState, searchQuery, maxBudget]);

  // --- Pagination Logic ---
  const indexOfLastDestination = currentPage * DESTINATIONS_PER_PAGE;
  const indexOfFirstDestination =
    indexOfLastDestination - DESTINATIONS_PER_PAGE;

  // Slice the filtered results to get only the items for the current page
  const currentDestinations = filteredDestinations.slice(
    indexOfFirstDestination,
    indexOfLastDestination
  );

  if (loading) return <p>Loading destinations...</p>;
  if (error) return <p>Error loading destinations: {error}</p>;

  return (
    <div className="container mx-auto bg-white px-4 py-8">
      <Navbar />
      {/* --- HEADING SECTION START --- */}
      <div className="text-center mb-10 mt-10">
        <h1 className="text-4xl font-bold text-gray-800">
          Explore Indian Destinations
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Use the filters to find the perfect place for your next adventure!
        </p>
      </div>
      {/* --- HEADING SECTION END --- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <FilterSidebar
            states={uniqueStates}
            selectedState={selectedState}
            onStateChange={setSelectedState}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            maxBudget={maxBudget}
            onBudgetChange={setMaxBudget}
          />
        </div>
        <main className="lg:col-span-3 mb-5">
          <DestinationGrid destinations={currentDestinations} />
          <Pagination
            totalDestinations={filteredDestinations.length}
            destinationsPerPage={DESTINATIONS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default FilterPage;
