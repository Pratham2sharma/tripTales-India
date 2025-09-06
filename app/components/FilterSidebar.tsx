import React from "react";

interface FilterSidebarProps {
  states: string[];
  selectedState: string;
  onStateChange: (state: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  maxBudget: string;
  onBudgetChange: (budget: string) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  states,
  selectedState,
  onStateChange,
  searchQuery,
  onSearchChange,
  maxBudget,
  onBudgetChange,
}) => {
  // Best practice: Ensure the states array has unique values before mapping
  const uniqueStates = [...new Set(states)];

  return (
    <aside className="p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Filters</h2>
      <div className="space-y-6">
        {/* Search by Name */}
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Search Destination
          </label>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="e.g., Goa, Jaipur..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
          />
        </div>

        {/* Filter by State */}
        <div>
          <label
            htmlFor="state"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select State
          </label>
          <select
            id="state"
            value={selectedState}
            onChange={(e) => onStateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
          >
            <option value="All States">All States</option>
            {/* CORRECTED PART: Using uniqueStates and adding index to the key */}
            {uniqueStates.map((state, index) => (
              <option key={`${state}-${index}`} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
