import React, { useState } from "react";
import {
  Star,
  Calendar,
  Globe,
  BookmarkPlus,
  BookmarkCheck,
} from "lucide-react";
import TMDBService from "../utils/tmdb";

const MovieCard = ({ movie, onBookmark, isBookmarked = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const {
    id,
    title,
    poster_path,
    release_date,
    vote_average,
    overview,
    original_language,
    genre_ids = [],
  } = movie;

  const imageUrl = TMDBService.getPosterUrl(poster_path);
  const releaseYear = TMDBService.getYearFromDate(release_date);
  const rating = TMDBService.getRating(vote_average);

  const languageMap = TMDBService.getLanguages();

  const displayLanguage =
    languageMap[original_language] ||
    original_language?.toUpperCase() ||
    "Unknown";

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    if (onBookmark) {
      onBookmark(movie);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div className="movie-card group cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
      <div className="relative overflow-hidden rounded-lg">
        {/* Poster Image */}
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={title}
            className={`transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-64 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center rounded-lg">
            <div className="text-center text-gray-400">
              <Globe className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No Image</p>
            </div>
          </div>
        )}
        ;{/* Loading skeleton */}
        {!imageLoaded && imageUrl && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-800 animate-pulse rounded-lg" />
        )}
        ;{/* Bookmark button */}
        <button
          onClick={handleBookmarkClick}
          className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all duration-20 opacity-0 group-hover:opacity-100"
          aria-label={
            isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"
          }
        >
          {isBookmarked ? (
            <BookmarkCheck className="w-4 h-4 text-yellow-400" />
          ) : (
            <BookmarkPlus className="w-4 h-4 text-white" />
          )}
        </button>
        {/* Rating overlay */}
        {parseFloat(rating) > 0 && (
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
            <div className="rating">
              <star className="w-4 h-4 text-yellow-400 fill-current" />
              <p className="text-sm">{rating}</p>
            </div>
          </div>
        )}
      </div>
      {/* Movies Info */}

      <div className="mt-4 space-y-2">
        <h3 className="group-hover:text-purple-300 transition-colors duration-200">
          {title}
        </h3>

        <div className="content">
          {/* Release Year */}
          <div className="flex items-center gap-">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="year">{releaseYear}</span>
          </div>

          {/* Language */}
          <span className="lang">{displayLanguage}</span>

          {/**RunTime or additional info could go here */}
          {parseFloat(rating) > 0 && (
            <div className="rating">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <p>{rating}</p>
            </div>
          )}
        </div>

        {/**Overview preview on hover */}

        {overview && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm p-4 ronded-2xl opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <h3 className="mb-2">{title}</h3>
            <p className="text-sm text-gray-300 line-clamp-4 leading-relaxed">
              {overview}
            </p>
            <div className="flex items-center justify-between mt-4">
              <div className="rating">
                <Star className="w-4 h-4 text-yellow-400 fill-content" />
                <p>{rating}</p>
              </div>
              <span className="text-sm text-gray-400">{releaseYear}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
