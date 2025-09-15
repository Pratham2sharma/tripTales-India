"use client";
import React, { useState, useEffect } from "react";
import useCineplaceStore from "@/store/cineplaceStore";
import Image from "next/image";
import Pagination from "../../components/Pagination";

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

const ITEMS_PER_PAGE = 6;

const CineplaceManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "view" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    cineplaces,
    selectedCineplace,
    loading,
    detailLoading,
    error,
    fetchCineplaces,
    fetchCineplaceById,
    createCineplace,
    updateCineplace,
    deleteCineplace,
    clearSelectedCineplace,
  } = useCineplaceStore();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    movie: "",
    state: "",
    bestTimeToVisit: "",
    averageBudget: "",
    travelTips: "",
    latitude: "",
    longitude: "",
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [editSelectedImages, setEditSelectedImages] = useState<File[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCineplaces();
  }, [fetchCineplaces]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    try {
      await createCineplace(createData);
      setShowForm(false);
      setCurrentPage(1); // Reset to first page
      setFormData({
        name: "",
        description: "",
        movie: "",
        state: "",
        bestTimeToVisit: "",
        averageBudget: "",
        travelTips: "",
        latitude: "",
        longitude: "",
      });
      setSelectedImages([]);
    } catch (error) {
      console.error("Error creating cineplace:", error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formDataObj = new FormData(form);

    const imagePromises = Array.from(editSelectedImages).map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    const base64Images = await Promise.all(imagePromises);

    const updateData = {
      name: formDataObj.get("name") as string,
      description: formDataObj.get("description") as string,
      movie: formDataObj.get("movie") as string,
      state: formDataObj.get("state") as string,
      bestTimeToVisit: formDataObj.get("bestTimeToVisit") as string,
      averageBudget: formDataObj.get("averageBudget") as string,
      travelTips: formDataObj.get("travelTips") as string,
      latitude: Number(formDataObj.get("latitude")),
      longitude: Number(formDataObj.get("longitude")),
      ...(base64Images.length > 0 && { images: base64Images }),
    };

    try {
      await updateCineplace(editingId!, updateData);
      setViewMode("list");
      clearSelectedCineplace();
      setEditingId(null);
      setEditSelectedImages([]);
    } catch (error) {
      console.error("Error updating cineplace:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this cineplace?")) {
      try {
        await deleteCineplace(id);
        // Reset to page 1 if current page becomes empty
        const newTotal = cineplaces.length - 1;
        const newTotalPages = Math.ceil(newTotal / ITEMS_PER_PAGE);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
      } catch (error) {
        console.error("Error deleting cineplace:", error);
      }
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(cineplaces.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentDestinations = cineplaces.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Reset to page 1 if current page is invalid
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black">
          Cinema Places Management
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Cinema Place
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-black">
            Create New Cinema Place
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Place Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
            <input
              type="text"
              placeholder="Movie Name"
              value={formData.movie}
              onChange={(e) =>
                setFormData({ ...formData, movie: e.target.value })
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
            <input
              type="text"
              placeholder="Best Time to Visit"
              value={formData.bestTimeToVisit}
              onChange={(e) =>
                setFormData({ ...formData, bestTimeToVisit: e.target.value })
              }
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
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
              placeholder="Average Budget"
              value={formData.averageBudget}
              onChange={(e) =>
                setFormData({ ...formData, averageBudget: e.target.value })
              }
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
            <textarea
              placeholder="Travel Tips"
              value={formData.travelTips}
              onChange={(e) =>
                setFormData({ ...formData, travelTips: e.target.value })
              }
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              rows={2}
              required
            />
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
            <div className="col-span-2">
              <label className="block text-sm font-medium text-black mb-2">
                Images (Multiple)
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
                required
              />
              {selectedImages.length > 0 && (
                <p className="text-sm text-black mt-1">
                  {selectedImages.length} image(s) selected
                </p>
              )}
            </div>
            <div className="col-span-2 flex gap-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Cinema Place
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
              ? "All Cinema Places"
              : viewMode === "view"
              ? "Cinema Place Details"
              : "Edit Cinema Place"}
          </h2>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8 text-black">
              Loading cinema places...
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">Error: {error}</div>
          ) : cineplaces.length === 0 ? (
            <div className="text-black text-center py-8">
              No cinema places found. Create your first cinema place!
            </div>
          ) : (
            <>
              {viewMode === "list" && (
                <>
                  <div className="space-y-4">
                    {currentDestinations.map((cineplace) => (
                      <div
                        key={cineplace._id}
                        className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-black mb-2">
                              {cineplace.name}
                            </h3>
                            <p className="text-black text-sm mb-1">
                              <strong>Movie:</strong> {cineplace.movie}
                            </p>
                            <p className="text-black text-sm mb-3">
                              {cineplace.description}
                            </p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => {
                                fetchCineplaceById(cineplace._id);
                                setViewMode("view");
                              }}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                            >
                              View
                            </button>
                            <button
                              onClick={() => {
                                fetchCineplaceById(cineplace._id);
                                setEditingId(cineplace._id);
                                setViewMode("edit");
                              }}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(cineplace._id)}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Pagination
                    totalDestinations={cineplaces.length}
                    destinationsPerPage={ITEMS_PER_PAGE}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                  />
                </>
              )}

              {viewMode === "view" && selectedCineplace && (
                <div className="bg-white rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-black">
                      {selectedCineplace.name}
                    </h3>
                    <button
                      onClick={() => {
                        setViewMode("list");
                        clearSelectedCineplace();
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
                        <strong>Movie:</strong> {selectedCineplace.movie}
                      </p>
                      <p>
                        <strong>State:</strong> {selectedCineplace.state}
                      </p>
                      <p>
                        <strong>Description:</strong>{" "}
                        {selectedCineplace.description}
                      </p>
                      <p>
                        <strong>Best Time to Visit:</strong>{" "}
                        {selectedCineplace.bestTimeToVisit}
                      </p>
                      <p>
                        <strong>Average Budget:</strong>{" "}
                        {selectedCineplace.averageBudget}
                      </p>
                      <p>
                        <strong>Travel Tips:</strong>{" "}
                        {selectedCineplace.travelTips}
                      </p>
                      <p>
                        <strong>Latitude:</strong> {selectedCineplace.latitude}
                      </p>
                      <p>
                        <strong>Longitude:</strong>{" "}
                        {selectedCineplace.longitude}
                      </p>
                      {selectedCineplace.images &&
                        selectedCineplace.images.length > 0 && (
                          <div>
                            <strong className="text-black">Images:</strong>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                              {selectedCineplace.images.map((image, index) => (
                                // Use next/image for optimization
                                <div
                                  key={index}
                                  className="relative w-full h-32"
                                >
                                  <Image
                                    src={image}
                                    alt={`${selectedCineplace.name} ${
                                      index + 1
                                    }`}
                                    fill
                                    className="object-cover rounded"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    priority={index === 0}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              )}

              {viewMode === "edit" && selectedCineplace && (
                <div className="bg-white rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-black">
                      Edit {selectedCineplace.name}
                    </h3>
                    <button
                      onClick={() => {
                        setViewMode("list");
                        clearSelectedCineplace();
                        setEditingId(null);
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                  <form
                    onSubmit={handleUpdate}
                    className="grid grid-cols-2 gap-4"
                  >
                    <input
                      type="text"
                      name="name"
                      placeholder="Place Name"
                      defaultValue={selectedCineplace.name}
                      className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      required
                    />
                    <input
                      type="text"
                      name="movie"
                      placeholder="Movie Name"
                      defaultValue={selectedCineplace.movie}
                      className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      required
                    />
                    <select
                      name="state"
                      defaultValue={selectedCineplace.state}
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
                    <input
                      type="text"
                      name="bestTimeToVisit"
                      placeholder="Best Time to Visit"
                      defaultValue={selectedCineplace.bestTimeToVisit}
                      className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      required
                    />
                    <textarea
                      name="description"
                      placeholder="Description"
                      defaultValue={selectedCineplace.description}
                      className="border rounded-lg px-4 py-2 col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      rows={3}
                      required
                    />
                    <input
                      type="text"
                      name="averageBudget"
                      placeholder="Average Budget"
                      defaultValue={selectedCineplace.averageBudget}
                      className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      required
                    />
                    <textarea
                      name="travelTips"
                      placeholder="Travel Tips"
                      defaultValue={selectedCineplace.travelTips}
                      className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      rows={2}
                      required
                    />
                    <input
                      type="number"
                      name="latitude"
                      placeholder="Latitude"
                      defaultValue={selectedCineplace.latitude}
                      className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      step="any"
                      required
                    />
                    <input
                      type="number"
                      name="longitude"
                      placeholder="Longitude"
                      defaultValue={selectedCineplace.longitude}
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
                        Update Cinema Place
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

export default CineplaceManager;
