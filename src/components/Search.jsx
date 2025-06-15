import React, { useEffect, useState, useCallback } from "react";
import { Search, X, Filter, TrendingUp } from "lucide-react";

const SearchTDB = ({
  onSearch,
  onFilterChange,
  placeholder = "Search for movies, TV shows, people...",
  showTrending = True,
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
  const debouncedSearch = useCallback(
    debounce((searchQuery, searchFilters) => {
      if (onSearch) {
        onSearch(searchQuery, searchFilters);
      }
    }, 300),
    [onSearch]
  );

  // Effect to handle search when query or filters change
  useEffect(() => {
    if (
      query.trim() ||
      filters.type !== "all" ||
      filters.year ||
      filters.genre
    ) {
      debouncedSearch(query.trim(), filters);
    }
  }, [query, filters, debouncedSearch]);

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
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query.trim(), filters);
    }
    setIsActive(false);
  };

  // Generate years for filter dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return <div>Search</div>;
};

export default SearchTDB;
