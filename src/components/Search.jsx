import React, { useEffect, useState, useCallback, useRef } from "react";
import { Search, X, Filter, TrendingUp } from "lucide-react";

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const SearchTDB = ({
  onSearch,
  onFilterChange,
  placeholder = "Search for movies, TV shows, people...",
  showTrending = true,
  initialValue = "",
}) => {
  const [query, setQuery] = useState(initialValue);
  const [isActive, setIsActive] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: "all",
    year: "",
    genre: "",
    sortBy: "popularity.desc",
  });

  const trendingSearches = [
    "Marvel",
    "Batman",
    "Horror",
    "Comedy",
    "Action",
    "Sci-Fi",
    "Romance",
    "Thriller",
  ];

  // Debounce search function
  const debounceSearchRef = useRef();
  useEffect(() => {
    debounceSearchRef.current = debounce((searchQuery, searchFilters) => {
      if (onSearch) {
        onSearch(searchQuery, searchFilters);
      }
    }, 300);
  }, [onSearch]);

  // Effect to handle search when query or filters change
  useEffect(() => {
    if (
      query.trim() ||
      filters.type !== "all" ||
      filters.year ||
      filters.genre
    ) {
      debounceSearchRef.current(query.trim(), filters);
    }
  }, [query, filters]);

  // Effects to notify parent of filter changes
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  }, [filters, onFilterChange]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery("");
    setIsActive(false);
    if (onSearch) {
      onSearch("", filters);
    }
  };

  const handleTrendingClick = (term) => {
    setQuery(term);
    setIsActive(false);
    onSearch?.(term.trim(), filters);
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), filters);
    }
    setIsActive(false);
  };

  // Generate years for filter dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="search">
      <form onSubmit={handleSubmit}>
        <div>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsActive(true)}
            onBlur={() => setTimeout(() => setIsActive(false), 200)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
            className="pl-12 pr-12"
            autoComplete="off"
          />

          {/** Clear button */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}

          {/**Filter toggle button */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${
              showFilters
                ? "bg-purple-600 text-white"
                : "hover:bg-gray-700 text-gray-400"
            }`}
            aria-label="Toggle filters"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </form>
      {/** Search Dropdown */}
      {isActive && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-dark-100 border border-gray-700 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
          {/** Trending Searches */}
          {showTrending && query.length === 0 && (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-gray-300">
                  Trending Searches
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleTrendingClick(term)}
                    className="px-2 py-1 bg-gray-800 rounded-full hover:bg-purple-600 text-gray-300 hover:text-white transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/**Search suggestions could go here */}
          {query.length > 0 && (
            <div className="p-4">
              <div className="text-sm text-gray-400">
                Press Enter to search for "{query}"
              </div>
            </div>
          )}
        </div>
      )}
      {/** Advance Filters */}
      {showFilters && (
        <div className="mt-4 p-4 bg-dark-100 rounded-lg border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/** Content Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Content Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="w-full br-gray-800 border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All</option>
                <option value="movie">Movies</option>
                <option value="tv">TV Shows</option>
                <option value="person">People</option>
              </select>
            </div>
            {/** Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Release Year
              </label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange("year", e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Any Year</option>
                {years.map((year) => (
                  <option value={year} key={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            {/** Genres Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Genres
              </label>
              <select
                value={filters.genre}
                onChange={(e) => handleFilterChange("genre", e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Any Genre</option>
                <option value="28">Action</option>
                <option value="12">Adventure</option>
                <option value="16">Animation</option>
                <option value="35">Comedy</option>
                <option value="80">Crime</option>
                <option value="99">Documentary</option>
                <option value="18">Drama</option>
                <option value="10751">Family</option>
                <option value="14">Fantasy</option>
                <option value="36">History</option>
                <option value="27">Horror</option>
                <option value="10402">Music</option>
                <option value="9648">Mystery</option>
                <option value="878">Science Fiction</option>
                <option value="10770">TV Movie</option>
                <option value="53">Thriller</option>
                <option value="10752">War</option>
                <option value="37">Western</option>
              </select>
            </div>
            {/** Sort by filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-md px-2 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="popularity.desc">Most Popular</option>
                <option value="popularity.asc">Least Popular</option>
                <option value="release_date.desc">Newest First</option>
                <option value="release_date.asc">Oldest First</option>
                <option value="vote_average.desc">Highest Rated</option>
                <option value="vote_average.asc">Lowest Rated</option>
                <option value="title.asc">A-Z</option>
                <option value="title.desc">Z-A</option>
              </select>
            </div>
          </div>
          {/** Reset Filters */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() =>
                setFilters({
                  type: "all",
                  year: "",
                  genre: "",
                  sortBy: "popularity.desc",
                })
              }
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchTDB;
