"use client";

import React from "react";

interface PaginationProps {
  totalDestinations: number;
  destinationsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalDestinations,
  destinationsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalDestinations / destinationsPerPage);
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (totalPages <= 1) {
    return null; // Don't render pagination if there's only one page
  }

  return (
    <nav className="mt-8 flex justify-center">
      <ul className="inline-flex -space-x-px">
        {/* Previous Button */}
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="py-2 px-4 ml-0 font-bold leading-tight text-orange-600 bg-white rounded-l-lg border border-orange-300 hover:bg-orange-50 hover:text-orange-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:text-gray-400 disabled:border-gray-300 transition-colors"
          >
            Previous
          </button>
        </li>

        {/* Page Number Buttons */}
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => onPageChange(number)}
              className={`py-2 px-4 leading-tight font-bold border transition-colors ${
                currentPage === number
                  ? "bg-orange-600 text-white border-orange-600 font-semibold"
                  : "text-orange-600 bg-white border-orange-300 hover:bg-orange-50 hover:text-orange-700"
              }`}
            >
              {number}
            </button>
          </li>
        ))}

        {/* Next Button */}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="py-2 px-4 leading-tight font-bold text-orange-600 bg-white rounded-r-lg border border-orange-300 hover:bg-orange-50 hover:text-orange-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:text-gray-400 disabled:border-gray-300 transition-colors"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
