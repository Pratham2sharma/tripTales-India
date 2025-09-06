"use client";
import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { useTripPlannerStore } from "@/store/tripplaanerStore";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function TripPlannerPage() {
  const [formData, setFormData] = useState({
    people: "",
    destination: "",
    budget: "",
    duration: "",
  });

  const { generateTripPlan, tripPlan, loading, error } = useTripPlannerStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Convert number fields to numbers before sending
    await generateTripPlan({
      ...formData,
      people: Number(formData.people),
      budget: Number(formData.budget),
      duration: Number(formData.duration),
    });
  };

  // Ref for PDF download
  const tripPlanRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    if (!tripPlanRef.current) return;

    const element = tripPlanRef.current;

    const canvas = await html2canvas(element, {
      scale: 2,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 10;

    pdf.addImage(
      imgData,
      "PNG",
      imgX,
      imgY,
      imgWidth * ratio,
      imgHeight * ratio
    );
    pdf.save("trip-plan.pdf");
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[60vh]">
        <div className="absolute inset-0">
          <Image
            src="/images/trip-planner-banner.jpg"
            alt="trip-planner TripTales India"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
              AI Powered Trip Planner
            </h1>
            <p className="text-xl">
              Plan your perfect journey with intelligent recommendations
            </p>
            <div className="mt-8 h-1 w-32 bg-gradient-to-r from-orange-400 to-green-400 mx-auto rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-16 lg:px-24">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-2xl">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                  Plan Your Trip
                </h2>

                {mounted && (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Number of People
                      </label>
                      <input
                        type="number"
                        name="people"
                        value={formData.people}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter number of travelers"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Budget (₹)
                      </label>
                      <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your budget"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Desired Destination
                      </label>
                      <textarea
                        name="destination"
                        value={formData.destination}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Goa, Rishikesh, or Kerala Backwaters"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Duration (Days)
                      </label>
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter trip duration in days"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-orange-400 to-green-400 mx-auto text-white font-semibold rounded-lg shadow-md  py-3 px-6 hover:from-blue-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Generating..." : "Generate Trip Plan"}
                    </button>
                  </form>
                )}

                {mounted && error && (
                  <p className="text-red-500 mt-4 text-center">{error}</p>
                )}

                {mounted &&
                  !!tripPlan?.itineraries &&
                  tripPlan.itineraries.length > 0 && (
                    <div
                      ref={tripPlanRef}
                      className="mt-8 p-6 bg-gray-100 rounded-lg"
                    >
                      <h3 className="text-xl font-bold mb-4 text-gray-800">
                        Suggested Itineraries
                      </h3>
                      <ul className="space-y-6">
                        {tripPlan.itineraries.map((itinerary, idx) => (
                          <li
                            key={`itinerary-${idx}-${
                              itinerary.title || "untitled"
                            }`}
                            className="text-gray-700 border-b pb-4 last:border-b-0"
                          >
                            <div className="font-semibold text-lg mb-1">
                              {itinerary.title || "Untitled"}
                            </div>
                            <div className="mb-1">
                              <span className="font-medium">
                                Estimated Budget:
                              </span>{" "}
                              ₹
                              {typeof itinerary.estimated_budget === "number"
                                ? itinerary.estimated_budget.toLocaleString(
                                    "en-IN"
                                  )
                                : "N/A"}
                            </div>
                            <ul className="list-disc pl-6 space-y-1">
                              {Array.isArray(itinerary.days) &&
                                itinerary.days.map(
                                  (day: string, dayIdx: number) => (
                                    <li key={`day-${idx}-${dayIdx}`}>
                                      <ReactMarkdown>{day}</ReactMarkdown>
                                    </li>
                                  )
                                )}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {mounted &&
                  !!tripPlan?.itineraries &&
                  tripPlan.itineraries.length > 0 && (
                    <div className="text-center mt-6">
                      <button
                        onClick={handleDownloadPdf}
                        className="px-6 py-2 bg-gradient-to-r from-orange-400 to-green-400 mx-auto text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
                      >
                        Download as PDF
                      </button>
                    </div>
                  )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
