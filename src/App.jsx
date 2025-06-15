import { useState, useEffect } from "react";
import TMDBService from "./utils/tmdb";
import { Film, TrendingUp, Star, Calendar, Bookmark } from "lucide-react";
import MovieCard from "./components/MovieCard";
import Spinner from "./components/Spinner";
import { MovieGridSkeleton } from "./components/Spinner";
import SearchTDB from "./components/Search";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({});
  const [bookmarkedMovies, setBookmarkedMovies] = useState(new Set());
  const [activeTab, setActiveTab] = useState("popular"); // popular, trending, bookmarked, search

  // Fetch popular movies
  const fetchPopularMovies = async (page = 1) => {
    try {
      setLoading(true);
      const data = await TMDBService.getPopularMovies(page);
      if (page === 1) {
        setMovies(data.results);
      } else {
        setMovies((prevMovies) => [...prevMovies, ...data.results]);
      }
      setTotalPages(data.total_pages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching popular movies: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch trending movies
  const fetchTrendingMovies = async () => {
    try {
      setLoading(true);
      const data = await TMDBService.getTrendingMovies();
      setTrendingMovies(data.results.slice(0, 10));
    } catch (error) {
      console.error("Error fetching trending movies: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Search movies
  const handleSearch = async (query, filters) => {
    if (
      !query.trim() &&
      filters.type === "all" &&
      !filters.year &&
      !filters.genre
    ) {
      setActiveTab("popular");
      fetchPopularMovies();
      return;
    }
    try {
      setSearchLoading(true);
      setActiveTab("search");

      const data = await TMDBService.searchMovies(query, filters);
      let results = data.results || [];

      if (filters.genre) {
        results = results.filter(
          (item) =>
            item.genre_ids && item.genre_ids.includes(parseInt(filters.genre))
        );
      }

      //Sort results
      if (filters.sortBy) {
        results.sort((a, b) => {
          switch (filters.sortBy) {
            case "popularity.desc":
              return (b.popularity || 0) - (a.popularity || 0);
            case "popularity.asc":
              return (a.popularity || 0) - (b.popularity || 0);
            case "release_date.desc":
              return (
                new Date(b.release_date || 0) - new Date(a.release_date || 0)
              );
            case "release_date.asc":
              return (
                new Date(a.release_date || 0) - new Date(b.release_date || 0)
              );
            case "vote_average.desc":
              return (b.vote_average || 0) - (a.vote_average || 0);
            case "vote_average.asc":
              return (a.vote_average || 0) - (b.vote_average || 0);
            case "title.asc":
              return (a.title || a.name || "").localeCompare(
                b.title || b.name || ""
              );
            case "title.desc":
              return (b.title || b.name || "").localeCompare(
                a.title || a.name || ""
              );
            default:
              return 0;
          }
        });
      }
      setMovies(results);
      setSearchQuery(query);
      setActiveFilters(filters);
    } catch (error) {
      console.error("Error searching movies: ", error);
    } finally {
      setSearchLoading(false);
    }
  };
  // Handle bookmark (with Appwrite integration placeholder)
  const handleBookmark = async (movie) => {
    try {
      const movieId = movie.id;
      const isCurrentlyBookmarked = bookmarkedMovies.has(movieId);

      if (isCurrentlyBookmarked) {
        // Remove from bookmarks
        setBookmarkedMovies((prevBookmarks) => {
          const newSet = new Set(prevBookmarks);
          newSet.delete(movieId);
          return newSet;
        });
        // TODO: Remove from Appwrite database
        // await database.deleteDocument(
        // APPWRITE_CONFIG.databaseId,
        // APPWRITE_CONFIG.collectionId,
        // movieId.toString()
        // );
      } else {
        // Add to bookmarks
        setBookmarkedMovies((prev) => new Set([...prev, movieId]));
        // TODO: Add to Appwrite database
        // await database.createDocument(
        // APPWRITE_CONFIG.databaseId,
        // APPWRITE_CONFIG.collectionId,
        // movieId.toString(),
        // {
        //  movieId:movieId,
        //  title: movie.title || movie.name,
        //  posterPath: movie.poster_path,
        //  releaseDate: movie.release_date,
        //  voteAverage: movie.vote_average,
        //  overview: movie.overview,
        //  bookmarkedAt: new Date().toISOString()
        // }
        // );
      }
    } catch (error) {
      console.error("Error handling bookmark: ", error);
    }
  };

  // Load more movies (pagination)
  const loadMore = () => {
    if (currentPage < totalPages && !loading) {
      fetchPopularMovies(currentPage + 1);
    }
  };

  //Initailize app
  useEffect(() => {
    fetchPopularMovies();
    fetchTrendingMovies();

    //TODO: Load bookmarks from Appwrite database
    //loadBookmarkedMovies();
  }, []);

  const getCurrentMovies = () => {
    switch (activeTab) {
      case "trending":
        return trendingMovies;
      case "bookmarked":
        return movies.filter((movie) => bookmarkedMovies.has(movie.id));
      default:
        return movies;
    }
  };

  const currentMovies = getCurrentMovies();
  console.log("Current Movies:", currentMovies);

  return (
    <div className="min-h-screen bg-primary">
      {/* Hero Pattern Background */}
      <div className="pattern" />

      <div className="wrapper">
        {/* Header */}
        <header>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Film className="w-12 h-12 text-purple-400" />
              <h1 className="text-gradient">MovieFlix</h1>
            </div>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Discover amazing movies, TV shows, and entertainment content.
              Search, bookmark, and explore the world of cinema.
            </p>
          </div>
        </header>

        {/* Search Component */}
        <SearchTDB
          onSearch={handleSearch}
          placeholder="Search for movies, TV shows, people..."
          showTrending={true}
        />

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mt-8 mb-8">
          {[
            { id: "popular", label: "Popular", icon: Star },
            { id: "trending", label: "Trending", icon: TrendingUp },
            { id: "bookmarked", label: "Bookmarked", icon: Bookmark },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === "popular" && movies.length === 0)
                    fetchPopularMovies();
                  // if (tab.id === "trending") setMovies(trendingMovies);
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25"
                    : "bg-dark-100 text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.id === "bookmarked" && bookmarkedMovies.size > 0 && (
                  <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                    {bookmarkedMovies.size}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Trending Section (only show on popular tab) */}
        {activeTab === "popular" && trendingMovies.length > 0 && (
          <section className="trending">
            <h2 className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              Trending This Week
            </h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.id}>
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                    className="rounded-lg"
                  />
                  <p className="fancy-text">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Movies Grid */}
        <section className="all-movies mt-12">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="flex items-center gap-2">
              {activeTab === "trending" && (
                <TrendingUp className="w-6 h-6 text-purple-400" />
              )}
              {activeTab === "popular" && (
                <Star className="w-6 h-6 text-purple-400" />
              )}
              {activeTab === "bookmarked" && (
                <Bookmark className="w-6 h-6 text-purple-400" />
              )}
              {activeTab === "search" && (
                <Film className="w-6 h-6 text-purple-400" />
              )}

              {activeTab === "trending" && "Trending Movies"}
              {activeTab === "popular" && "Popular Movies"}
              {activeTab === "bookmarked" && "Your Bookmarks"}
              {activeTab === "search" &&
                `Search Results${searchQuery ? ` for "${searchQuery}"` : ""}`}
            </h2>

            {currentMovies.length > 0 && (
              <span className="text-gray-400 text-sm">
                {currentMovies.length}{" "}
                {currentMovies.length === 1 ? "movie" : "movies"}
              </span>
            )}
          </div>

          {/* Loading State */}
          {(loading || searchLoading) && currentMovies.length === 0 && (
            <MovieGridSkeleton count={8} />
          )}

          {/* Movies List */}
          {currentMovies.length > 0 && (
            <ul>
              {currentMovies.map((movie) => (
                <li key={movie.id}>
                  <MovieCard
                    movie={movie}
                    onBookmark={handleBookmark}
                    isBookmarked={bookmarkedMovies.has(movie.id)}
                  />
                </li>
              ))}
            </ul>
          )}

          {/* Empty State */}
          {!loading && !searchLoading && currentMovies.length === 0 && (
            <div className="text-center py-16">
              <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                {activeTab === "bookmarked"
                  ? "No bookmarked movies yet"
                  : "No movies found"}
              </h3>
              <p className="text-gray-500">
                {activeTab === "bookmarked"
                  ? "Start bookmarking movies to see them here!"
                  : "Try adjusting your search terms or filters."}
              </p>
            </div>
          )}

          {/* Load More Button */}
          {activeTab === "popular" && currentPage < totalPages && !loading && (
            <div className="text-center mt-12">
              <button
                onClick={loadMore}
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors duration-200 flex items-center gap-2 mx-auto"
              >
                {loading ? (
                  <Spinner size="small" />
                ) : (
                  <>
                    Load More Movies
                    <Calendar className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Loading More Indicator */}
          {loading && currentMovies.length > 0 && (
            <div className="text-center mt-8">
              <Spinner variant="dots" text="Loading more movies..." />
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-20 text-center text-gray-500 text-sm">
          <p>© 2025 MovieFlix. Powered by The Movie Database (TMDB) API</p>
          <p className="mt-2">
            This product uses the TMDB API but is not endorsed or certified by
            TMDB.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
