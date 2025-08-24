"use client";
import useDestinationStore from "@/store/destinationStore";
import React, { useState, useEffect } from "react";
import Image from "next/image";

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

const DestinationsManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    state: "",
    bestTimeToVisit: "",
    averageBudget: "",
    travelTips: "",
    latitude: "",
    longitude: "",
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const {
    destinations,
    selectedDestination,
    loading,
    detailLoading,
    error,
    fetchDestinations,
    fetchDestinationById,
    createDestination,
    updateDestination,
    deleteDestination,
    clearSelectedDestination,
  } = useDestinationStore();

  // State for filter
  const [selectedState, setSelectedState] = useState<string>("");

  const [viewMode, setViewMode] = useState<"list" | "view" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    state: "",
    bestTimeToVisit: "",
    averageBudget: "",
    travelTips: "",
    latitude: "",
    longitude: "",
  });
  const [editSelectedImages, setEditSelectedImages] = useState<File[]>([]);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  // Filter destinations by state (case-insensitive, trimmed)
  const filteredDestinations =
    selectedState && selectedState !== ""
      ? destinations.filter(
          (dest) =>
            dest.state &&
            dest.state.trim().toLowerCase() ===
              selectedState.trim().toLowerCase()
        )
      : destinations;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert images to base64
    const imagePromises = Array.from(selectedImages).map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    const base64Images = await Promise.all(imagePromises);

    const createData = {
      ...formData,
      images: base64Images,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
    };

    await createDestination(createData);
    setShowForm(false);
    setFormData({
      name: "",
      description: "",
      state: "",
      bestTimeToVisit: "",
      averageBudget: "",
      travelTips: "",
      latitude: "",
      longitude: "",
    });
    setSelectedImages([]);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black">
          Destinations Management
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Destination
        </button>
      </div>

      {/* Filter by State */}
      <div className="mb-6 flex items-center gap-4">
        <label htmlFor="stateFilter" className="text-black font-medium">
          Filter by State:
        </label>
        <select
          id="stateFilter"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        >
          <option value="">All States/UTs</option>
          {indianStates.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        {selectedState && (
          <button
            onClick={() => setSelectedState("")}
            className="ml-2 px-3 py-1 bg-gray-300 rounded text-black hover:bg-gray-400"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Add Destination Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-black">
            Create New Destination
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Destination Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
            <select
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            >
              <option value="">Select State/UT</option>
              {indianStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="border rounded-lg px-4 py-2 col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              rows={3}
              required
            />
            <input
              type="text"
              placeholder="Best Time to Visit"
              value={formData.bestTimeToVisit}
              onChange={(e) =>
                setFormData({ ...formData, bestTimeToVisit: e.target.value })
              }
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
            <input
              type="text"
              placeholder="Average Budget"
              value={formData.averageBudget}
              onChange={(e) =>
                setFormData({ ...formData, averageBudget: e.target.value })
              }
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
            <textarea
              placeholder="Travel Tips"
              value={formData.travelTips}
              onChange={(e) =>
                setFormData({ ...formData, travelTips: e.target.value })
              }
              className="border rounded-lg px-4 py-2 col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              rows={2}
            />
            <div className="col-span-2">
              <label className="block text-sm font-medium text-black mb-2">
                Destination Images (Multiple)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    setSelectedImages(Array.from(e.target.files));
                  }
                }}
                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
              {selectedImages.length > 0 && (
                <p className="text-sm text-black mt-1">
                  {selectedImages.length} image(s) selected
                </p>
              )}
            </div>
            <input
              type="number"
              placeholder="Latitude"
              value={formData.latitude}
              onChange={(e) =>
                setFormData({ ...formData, latitude: e.target.value })
              }
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              step="any"
              required
            />
            <input
              type="number"
              placeholder="Longitude"
              value={formData.longitude}
              onChange={(e) =>
                setFormData({ ...formData, longitude: e.target.value })
              }
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              step="any"
              required
            />
            <div className="col-span-2 flex gap-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Destination
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-black">
            {viewMode === "list"
              ? "All Destinations"
              : viewMode === "view"
              ? "Destination Details"
              : "Edit Destination"}
          </h2>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8 text-black">
              Loading destinations...
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">Error: {error}</div>
          ) : filteredDestinations.length === 0 ? (
            <div className="text-black text-center py-8">
              No destinations found
              {selectedState
                ? " for this state."
                : ". Create your first destination!"}
            </div>
          ) : (
            <>
              {viewMode === "list" && (
                <div className="space-y-4">
                  {filteredDestinations.map((destination) => (
                    <div
                      key={destination._id}
                      className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-black mb-2">
                            {destination.name}
                          </h3>
                          <p className="text-black text-sm mb-3">
                            {destination.description}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => {
                              fetchDestinationById(destination._id);
                              setViewMode("view");
                            }}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              fetchDestinationById(destination._id);
                              setEditingId(destination._id);
                              setViewMode("edit");
                            }}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteDestination(destination._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {viewMode === "view" && selectedDestination && (
                <div className="bg-white rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-black">
                      {selectedDestination.name}
                    </h3>
                    <button
                      onClick={() => {
                        setViewMode("list");
                        clearSelectedDestination();
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Back to List
                    </button>
                  </div>
                  {detailLoading ? (
                    <div className="text-center py-8 text-black">
                      Loading details...
                    </div>
                  ) : (
                    <div className="space-y-4 text-black">
                      <p>
                        <strong>State:</strong> {selectedDestination.state}
                      </p>
                      <p>
                        <strong>Description:</strong>{" "}
                        {selectedDestination.description}
                      </p>
                      <p>
                        <strong>Best Time to Visit:</strong>{" "}
                        {selectedDestination.bestTimeToVisit}
                      </p>
                      <p>
                        <strong>Average Budget:</strong>{" "}
                        {selectedDestination.averageBudget}
                      </p>
                      <p>
                        <strong>Travel Tips:</strong>{" "}
                        {selectedDestination.travelTips}
                      </p>
                      <p>
                        <strong>Latitude:</strong>{" "}
                        {selectedDestination.latitude}
                      </p>
                      <p>
                        <strong>Longitude:</strong>{" "}
                        {selectedDestination.longitude}
                      </p>
                      {selectedDestination.images &&
                        selectedDestination.images.length > 0 && (
                          <div>
                            <strong className="text-black">Images:</strong>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                              {selectedDestination.images.map(
                                (image, index) => (
                                  <div
                                    key={index}
                                    className="relative w-full h-32"
                                  >
                                    <Image
                                      src={image}
                                      alt={`${selectedDestination.name} ${
                                        index + 1
                                      }`}
                                      fill
                                      className="object-cover rounded"
                                      sizes="(max-width: 768px) 100vw, 33vw"
                                      priority={index === 0}
                                    />
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              )}

              {viewMode === "edit" && selectedDestination && (
                <div className="bg-white rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-black">
                      Edit {selectedDestination.name}
                    </h3>
                    <button
                      onClick={() => {
                        setViewMode("list");
                        clearSelectedDestination();
                        setEditingId(null);
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(
                        e.target as HTMLFormElement
                      );

                      // Convert images to base64 if any selected
                      const imagePromises = Array.from(editSelectedImages).map(
                        (file) => {
                          return new Promise<string>((resolve) => {
                            const reader = new FileReader();
                            reader.onload = () =>
                              resolve(reader.result as string);
                            reader.readAsDataURL(file);
                          });
                        }
                      );

                      const base64Images = await Promise.all(imagePromises);

                      const updateData = {
                        name: formData.get("name") as string,
                        description: formData.get("description") as string,
                        state: formData.get("state") as string,
                        bestTimeToVisit: formData.get(
                          "bestTimeToVisit"
                        ) as string,
                        averageBudget: formData.get("averageBudget") as string,
                        travelTips: formData.get("travelTips") as string,
                        latitude: Number(formData.get("latitude")),
                        longitude: Number(formData.get("longitude")),
                        ...(base64Images.length > 0 && {
                          images: base64Images,
                        }),
                      };

                      await updateDestination(editingId!, updateData);
                      setViewMode("list");
                      clearSelectedDestination();
                      setEditingId(null);
                      setEditSelectedImages([]);
                    }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <input
                      type="text"
                      name="name"
                      placeholder="Destination Name"
                      defaultValue={selectedDestination.name}
                      className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      required
                    />
                    <select
                      name="state"
                      defaultValue={selectedDestination.state}
                      className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      required
                    >
                      <option value="">Select State/UT</option>
                      {indianStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    <textarea
                      name="description"
                      placeholder="Description"
                      defaultValue={selectedDestination.description}
                      className="border rounded-lg px-4 py-2 col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      rows={3}
                      required
                    />
                    <input
                      type="text"
                      name="bestTimeToVisit"
                      placeholder="Best Time to Visit"
                      defaultValue={selectedDestination.bestTimeToVisit}
                      className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                    <input
                      type="text"
                      name="averageBudget"
                      placeholder="Average Budget"
                      defaultValue={selectedDestination.averageBudget}
                      className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                    <textarea
                      name="travelTips"
                      placeholder="Travel Tips"
                      defaultValue={selectedDestination.travelTips}
                      className="border rounded-lg px-4 py-2 col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      rows={2}
                    />
                    <input
                      type="number"
                      name="latitude"
                      placeholder="Latitude"
                      defaultValue={selectedDestination.latitude}
                      className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      step="any"
                      required
                    />
                    <input
                      type="number"
                      name="longitude"
                      placeholder="Longitude"
                      defaultValue={selectedDestination.longitude}
                      className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      step="any"
                      required
                    />
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-black mb-2">
                        Update Images (Optional)
                      </label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files) {
                            setEditSelectedImages(Array.from(e.target.files));
                          }
                        }}
                        className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      />
                      {editSelectedImages.length > 0 && (
                        <p className="text-sm text-black mt-1">
                          {editSelectedImages.length} new image(s) selected
                        </p>
                      )}
                    </div>
                    <div className="col-span-2 flex gap-4">
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Update Destination
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DestinationsManager;
