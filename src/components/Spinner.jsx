import React from "react";
import { Loader2, Film, Play, Star, Zap } from "lucide-react";

const sizeClasses = {
  small: "w-4 h-4",
  medium: "w-8 h-8",
  large: "w-12 h-12",
  xlarge: "w-16 h-16",
};

const Spinner = ({
  size = "medium",
  variant = "default",
  text = "",
  fullScreen = false,
  overlay = false,
}) => {
  const textSizes = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base",
    xlarge: "text-lg",
  };

  //Variant configuration
  const getSpinnerComponent = () => {
    switch (variant) {
      case "film":
        return (
          <div className="relative">
            <Film
              className={`${sizeClasses[size]} text-purple-400 animate-spin`}
            />
            <div className="absolute inset-0 animate-pulse">
              <div className="w-full h-full border-2 border-purple-400/30 rounded-full animate-ping" />
            </div>
          </div>
        );

      case "play":
        return (
          <div className="relative">
            <Play
              className={`${sizeClasses[size]} text-blue-400 animate-bounce`}
            />
            <div className="absolute -inset-2 border border-blue-400/30 rounded-full animate-ping" />
          </div>
        );

      case "star":
        return (
          <div className="relative">
            <Star
              className={`${sizeClasses[size]} text-yellow-400 animate-pulse fill-current`}
            />
            <div className="absolute inset-0 animate-spin">
              <div className="w-full h-full border-t-2 border-yellow-400 rounded-full" />
            </div>
          </div>
        );

      case "zap":
        return (
          <div className="flex space-x-1">
            <Zap
              className={`${sizeClasses[size]} text-green-400 animate-pulse`}
            />
            <Zap
              className={`${sizeClasses[size]} text-green-400 animate-pulse animation-delay-100`}
            />
            <Zap
              className={`${sizeClasses[size]} text-green-400 animate-pulse animation-delay-200`}
            />
          </div>
        );

      case "dots":
        return (
          <div className="flex space-x-1">
            <div
              className={`${sizeClasses[size]} bg-purple-400 rounded-full animate-bounce`}
            />
            <div
              className={`${sizeClasses[size]} bg-purple-400 rounded-full animate-bounce animation-delay-100`}
            />
            <div
              className={`${sizeClasses[size]} bg-purple-400 rounded-full animate-bounce animation-delay-200`}
            />
          </div>
        );

      case "pulse":
        return (
          <div className="relative">
            <div
              className={`${sizeClasses[size]} bg-purple-400 rounded-full animate-pulse`}
            />
            <div
              className={`absolute inset-0 ${sizeClasses[size]} border-2 bg-purple-400 rounded-full animate-ping`}
            />
          </div>
        );

      case "gradient":
        return (
          <div className="relative">
            <div className={`${sizeClasses[size]} rounded-full animate-spin`}>
              <div
                className="h-full w-full rounded-full border-4 border-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-purple-600 animate-spin"
                style={{
                  background:
                    "conic-gradient(from 0deg, #a855f7, #3b82f6, #a855f7)",
                  mask: "radial-gradient(circle at center, transparent 60%, black 61%)",
                  WebkitMask:
                    "radial-gradient(circle at center, transparent 60%, black 61%)",
                }}
              />
            </div>
          </div>
        );

      case "movie-reel":
        return (
          <div className="relative">
            <div
              className={`${sizeClasses[size]} border-4 border-gray-300 border-t-purple-400 rounded-full animate-spin`}
            />
            <div className="absolute inset-2 grid grid-cols-2 gap-0.5">
              <div className="bg-purple-400 rounded-full animate-pulse" />
              <div className="bg-purple-400 rounded-full animate-pulse animation-delay-75" />
              <div className="bg-purple-400 rounded-full animate-pulse animation-delay-150" />
              <div className="bg-purple-400 rounded-full animate-pulse animation-delay-225" />
            </div>
          </div>
        );

      default:
        return (
          <Loader2
            className={`${sizeClasses[size]} text-purple-400 animate-spin`}
          />
        );
    }
  };

  const spinnerContent = (
    <div
      className={`flex flex-col items-center justify-center space-y-3 ${
        fullScreen ? "min-h-screen" : ""
      }`}
    >
      {getSpinnerComponent()}
      {text && (
        <div
          className={`${textSizes[size]} text-gray-300 font-medium animate-pulse`}
        >
          {text}
        </div>
      )}
    </div>
  );

  // Full screen overlay
  if (fullScreen && overlay) {
    return (
      <div className="fixed inset-0 x-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-dark-100 p-8 rounded-2xl shadow-2xl border border-gray-700">
          {spinnerContent}
        </div>
      </div>
    );
  }

  // Full screen without overlay
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

export const MovieCardSkeleton = () => {
  return (
    <div className="movie-card animate-pulse">
      <div className="bg-gray-800 rounded-lg h-64 mb-4" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-800 rounded w-3/4" />
        <div className="flex space-x-2">
          <div className="h-3 bg-gray-800 rounded w-16" />
          <div className="h-3 bg-gray-800 rounded w-20" />
          <div className="h-3 bg-gray-800 rounded w-12" />
        </div>
      </div>
    </div>
  );
};

//Loading grid for multiple cards
export const MovieGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="all-movies">
      <ul>
        {Array.from({ length: count }, (_, index) => (
          <li key={index}>
            <MovieCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
};

// Inline loading component for buttons
export const ButtonSpinner = ({ size = "small" }) => {
  return <Loader2 className={`${sizeClasses[size]} animate-spin`} />;
};

// Progress bar spinner
export const ProgressSpinner = ({ progress = 0, text = "" }) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-32 h-32 relative">
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-700"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${progress * 2.51} 251`}
            className="text-purple-400 transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
      {text && <div className="text-sm text-gray-300">{text}</div>}
    </div>
  );
};

export default Spinner;
