import React from "react";

const UserFilters = ({
  filter,
  setFilter,
  role,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            placeholder={`Search ${role}s...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All {role}s</option>
            <option value="active">Active</option>
            <option value="new">New (Last 30 days)</option>
          </select>
        </div>

        <div className="flex items-end">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full">
            Add New {role}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserFilters;
