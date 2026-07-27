import React, { useState } from "react";
import axios from "axios";
import "./FavoriteMoviesIndex.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { Range } from "react-range";

const MIN_YEAR = 1900;
const MAX_YEAR = new Date().getFullYear();

// Streaming service icons (kept in sync with the Watchlist page)
const streamingServices = [
  { id: 'max', name: 'Max', icon: '/icons/max.svg', label: 'Max' },
  { id: 'netflix', name: 'Netflix', icon: '/icons/netflix.svg', label: 'Netflix' },
  { id: 'amazon', name: 'Prime Video', icon: '/icons/amazon.svg', label: 'Prime Video' },
  { id: 'disney', name: 'Disney+', icon: '/icons/disney.svg', label: 'Disney+' },
  { id: 'apple', name: 'Apple TV+', icon: '/icons/apple.svg', label: 'Apple TV+' },
  { id: 'paramount', name: 'Paramount+', icon: '/icons/paramount.svg', label: 'Paramount+' },
  { id: 'hulu', name: 'Hulu', icon: '/icons/hulu.svg', label: 'Hulu' },
  { id: 'other', name: 'Other', icon: '/icons/other.svg', label: 'Other' },
  { id: 'non-streaming', name: 'Non-streaming', icon: '/icons/non-streaming.svg', label: 'Non Streaming' }
];

export function FavoriteMoviesIndex(props) {
  // Existing state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedYears, setSelectedYears] = useState([MIN_YEAR, MAX_YEAR]);
  const [hoveredMovieId, setHoveredMovieId] = useState(null);
  const [hoverTimer, setHoverTimer] = useState(null);

  // Streaming service filter (default: all selected)
  const [selectedStreamingServices, setSelectedStreamingServices] = useState(
    streamingServices.map((service) => service.id)
  );
  const [hoveredService, setHoveredService] = useState(null);
  const [serviceHoverTimer, setServiceHoverTimer] = useState(null);

  // Sort by release year: 'default' | 'newest' | 'oldest'
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("default");

  // New state for recommendations
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [basedOnMovies, setBasedOnMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  // Track which recommended movies were favorited from this session
  const [favoritedRecommendations, setFavoritedRecommendations] = useState({});
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Bottom toast (same pattern as Search) — no blocking browser alert
  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsSortDropdownOpen(false);
  };

  // Toggle dropdown for the "Sort by Year" control
  const toggleSortDropdown = () => {
    setIsSortDropdownOpen(!isSortDropdownOpen);
    setIsDropdownOpen(false);
  };

  const selectSortOrder = (order) => {
    setSortOrder(order);
    setIsSortDropdownOpen(false);
  };

  // Handle year filter
  const handleYearChange = (values) => {
    setSelectedYears(values);
  };

  // Streaming service hover (delayed label, same as Watchlist)
  const handleMouseEnterService = (service) => {
    const timer = setTimeout(() => setHoveredService(service), 500);
    setServiceHoverTimer(timer);
  };

  const handleMouseLeaveService = () => {
    clearTimeout(serviceHoverTimer);
    setHoveredService(null);
  };

  // Toggle streaming services (same behavior as Watchlist)
  const toggleStreamingService = (id) => {
    const allSelected = selectedStreamingServices.length === streamingServices.length;

    if (allSelected) {
      // From the default "show everything" state, focus only the clicked service
      setSelectedStreamingServices([id]);
    } else if (selectedStreamingServices.includes(id)) {
      if (selectedStreamingServices.length > 1) {
        setSelectedStreamingServices(
          selectedStreamingServices.filter((service) => service !== id)
        );
      } else {
        // Unchecking the last remaining service resets to all
        setSelectedStreamingServices(streamingServices.map((service) => service.id));
      }
    } else {
      setSelectedStreamingServices([...selectedStreamingServices, id]);
    }
  };

  // Filter favorite movies
  const filteredMovies = props.favoriteMovies.filter((favoriteMovie) => {
    const movie = favoriteMovie.movie;
    const movieStreamingServices = movie.streaming_services || [];

    const yearFilter =
      movie.release_year >= selectedYears[0] &&
      movie.release_year <= selectedYears[1];

    const allServicesSelected =
      selectedStreamingServices.length === streamingServices.length;

    let streamingFilter;
    if (allServicesSelected) {
      streamingFilter = true;
    } else if (movieStreamingServices.length === 0) {
      // Movie is non-streaming
      streamingFilter = selectedStreamingServices.includes('non-streaming');
    } else {
      streamingFilter = movieStreamingServices.some((service) =>
        selectedStreamingServices.includes(service)
      );
    }

    return yearFilter && streamingFilter;
  });

  // Apply "Sort by Year" on top of the filtered list.
  // Favorites with an unknown/non-numeric year always go to the bottom.
  const sortedMovies = (() => {
    if (sortOrder === "default") return filteredMovies;

    const withYear = [];
    const withoutYear = [];
    filteredMovies.forEach((favoriteMovie) => {
      const year = parseInt(favoriteMovie.movie.release_year, 10);
      if (Number.isNaN(year)) {
        withoutYear.push(favoriteMovie);
      } else {
        withYear.push({ favoriteMovie, year });
      }
    });

    withYear.sort((a, b) =>
      sortOrder === "newest" ? b.year - a.year : a.year - b.year
    );

    return [...withYear.map((entry) => entry.favoriteMovie), ...withoutYear];
  })();

  // Hover handling
  const handleMouseEnter = (movieId) => {
    const timer = setTimeout(() => {
      setHoveredMovieId(movieId);
    }, 500);
    setHoverTimer(timer);
  };

  const handleMouseLeave = () => {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
    setHoveredMovieId(null);
  };

  // Toggle selection mode
  const handleGetRecommendations = () => {
    if (isSelectionMode) {
      // Cancel selection mode
      setIsSelectionMode(false);
      setSelectedMovies([]);
    } else {
      // Enter selection mode
      setIsSelectionMode(true);
      setShowRecommendations(false);
    }
  };

  // Toggle movie selection
  const toggleMovieSelection = (favoriteMovieId) => {
    if (selectedMovies.includes(favoriteMovieId)) {
      setSelectedMovies(selectedMovies.filter(id => id !== favoriteMovieId));
    } else {
      if (selectedMovies.length < 6) {
        setSelectedMovies([...selectedMovies, favoriteMovieId]);
      }
    }
  };

  // Get recommendations from backend
  const fetchRecommendations = () => {
    if (selectedMovies.length < 2) {
      showToastMessage("Please select at least 2 movies");
      return;
    }

    setIsLoading(true);
    
    const jwt = localStorage.getItem("jwt");
    axios.post(
      "http://localhost:3000/recommendations.json",
      { movie_ids: selectedMovies },
      {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    )
    .then((response) => {
      setRecommendations(response.data.recommendations || []);
      setBasedOnMovies(response.data.based_on || []);
      setShowRecommendations(true);
      setIsSelectionMode(false);
      setIsLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching recommendations:", error);
      showToastMessage(error.response?.data?.error || "Failed to get recommendations");
      setIsLoading(false);
    });
  };

  // Add recommended movie to watchlist
  const handleAddToWatchlist = (movie) => {
    const params = {
      title: movie.title,
      image_url: movie.image_url,
      description: movie.description,
      director: movie.director,
      release_year: movie.release_year,
      imdb_id: movie.imdb_id,
      streaming_services: movie.streaming_services,
    };

    const jwt = localStorage.getItem("jwt");
    axios
      .post("http://localhost:3000/watchlist_movies.json", params, {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      })
      .then((response) => {
        showToastMessage("Added to Watchlist");
      })
      .catch((error) => {
        console.error("Error adding to watchlist:", error);
        showToastMessage("Failed to add to Watchlist");
      });
  };

  // Add a recommended movie straight to Favorites
  const handleAddFavorite = (movie) => {
    if (favoritedRecommendations[movie.imdb_id]) {
      showToastMessage("Already in Favorites");
      return;
    }

    const params = {
      title: movie.title,
      image_url: movie.image_url,
      description: movie.description,
      director: movie.director,
      release_year: movie.release_year,
      imdb_id: movie.imdb_id,
      streaming_services: movie.streaming_services,
    };

    const jwt = localStorage.getItem("jwt");
    axios
      .post("http://localhost:3000/favorite_movies.json", params, {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      })
      .then((response) => {
        if (response.data.error) {
          showToastMessage(response.data.error);
          return;
        }

        setFavoritedRecommendations((prev) => ({
          ...prev,
          [movie.imdb_id]: true,
        }));
        showToastMessage("Added to Favorites");
      })
      .catch((error) => {
        console.error("Error adding to favorites:", error);
        const message =
          error.response?.data?.errors?.join(", ") ||
          error.response?.data?.error ||
          "Failed to add to Favorites";
        showToastMessage(message);
      });
  };

  // Get new recommendations (regenerate)
  const handleGetNewRecommendations = () => {
    fetchRecommendations();
  };

  // Change selections
  const handleChangeSelections = () => {
    setShowRecommendations(false);
    setIsSelectionMode(true);
  };

  return (
    <div>
      <h1 className="favorite-movies">Favorite Movies</h1>
      <br />

      {/* Filter Section */}
      <div className="filter-section">
        {/* Streaming Service Filter */}
        <div className="streaming-services-container">
          <div className="streaming-services-filter">
            {streamingServices.map((service) => (
              <button
                key={service.id}
                className={`service-icon ${selectedStreamingServices.includes(service.id) ? "selected" : ""}`}
                onClick={() => toggleStreamingService(service.id)}
                onMouseEnter={() => handleMouseEnterService(service)}
                onMouseLeave={handleMouseLeaveService}
                style={{ position: "relative" }}
              >
                <img src={service.icon} alt={service.name} />
                {hoveredService && hoveredService.id === service.id && (
                  <div className="hover-modal">
                    {service.label}
                  </div>
                )}
              </button>
            ))}
            <button
              className="streaming-reset-button"
              onClick={() => setSelectedStreamingServices(streamingServices.map((service) => service.id))}
            >
              ✕ RESET
            </button>
          </div>
        </div>

        {/* Release Year + Recommendations side by side */}
        <div className="favorites-actions-row">
          {/* Release Year Filter (dropdown anchored directly below this button) */}
          <div className="release-year-filter">
            <button className="filter-button release-year-button" onClick={toggleDropdown}>
              Release Year&nbsp;&nbsp;▼
            </button>

            {isDropdownOpen && (
              <div className="filter-dropdown">
                <div className="header-row">
                  <h4>Release Year</h4>
                  <button
                    className="reset-button"
                    onClick={() => setSelectedYears([MIN_YEAR, MAX_YEAR])}
                  >
                    RESET
                  </button>
                </div>
                <div className="year-labels">
                  <span>{MIN_YEAR}</span>
                  <Range
                    step={1}
                    min={MIN_YEAR}
                    max={MAX_YEAR}
                    values={selectedYears}
                    onChange={handleYearChange}
                    renderTrack={({ props, children }) => (
                      <div {...props} className="slider-track" style={props.style}>
                        {children}
                      </div>
                    )}
                    renderThumb={({ props, index, isDragged }) => (
                      <div {...props} className="slider-thumb">
                        {isDragged && (
                          <div className="slider-tooltip">
                            <div className="slider-tooltip-text">
                              {selectedYears[index]}
                            </div>
                            <div className="slider-tooltip-arrow"></div>
                          </div>
                        )}
                      </div>
                    )}
                  />
                  <span>{MAX_YEAR}</span>
                </div>
              </div>
            )}
          </div>

          {/* Sort by Year */}
          <div className="sort-by-year">
            <button className="filter-button sort-by-year-button" onClick={toggleSortDropdown}>
              Sort by Year&nbsp;&nbsp;▼
            </button>

            {isSortDropdownOpen && (
              <div className="sort-dropdown">
                <button
                  className={`sort-option ${sortOrder === "newest" ? "active" : ""}`}
                  onClick={() => selectSortOrder("newest")}
                >
                  Newest → Oldest
                </button>
                <button
                  className={`sort-option ${sortOrder === "oldest" ? "active" : ""}`}
                  onClick={() => selectSortOrder("oldest")}
                >
                  Oldest → Newest
                </button>
                <button
                  className={`sort-option ${sortOrder === "default" ? "active" : ""}`}
                  onClick={() => selectSortOrder("default")}
                >
                  Default
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Get Recommendations on its own row */}
        <div className="favorites-recommendations-row">
          {!showRecommendations ? (
            <button 
              className={`filter-button recommendations-button ${isSelectionMode ? 'selection-mode' : ''}`}
              onClick={handleGetRecommendations}
            >
              {isSelectionMode 
                ? `Select Movies (${selectedMovies.length}/6)` 
                : "Get Recommendations"}
            </button>
          ) : (
            <div className="recommendations-actions">
              <button 
                className="filter-button recommendations-button"
                onClick={handleGetNewRecommendations}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Get New Recommendations"}
              </button>
              <button 
                className="filter-button change-selections-button"
                onClick={handleChangeSelections}
              >
                Change Selections
              </button>
            </div>
          )}
        </div>

        {/* Get Recommendations Button (in selection mode) */}
        {isSelectionMode && (
          <div className="get-recommendations-container">
            <button
              className="get-recommendations-button"
              onClick={fetchRecommendations}
              disabled={selectedMovies.length < 2 || isLoading}
            >
              {isLoading ? "Finding Recommendations..." : `Get ${selectedMovies.length >= 2 ? '6' : ''} Recommendations`}
            </button>
            {selectedMovies.length < 2 && (
              <p className="selection-hint">Select at least 2 movies</p>
            )}
          </div>
        )}
      </div>

      {/* Movies List */}
      {/* Recommendations Section - MOVED TO TOP */}
      {showRecommendations && recommendations.length > 0 && (
        <div className="recommendations-section">
          <div className="recommendations-divider">
            <span>Recommended for You</span>
          </div>
          {basedOnMovies.length > 0 && (
            <p className="based-on-text">
              Based on: {basedOnMovies.map(m => m.title).join(", ")}
            </p>
          )}
          
          {isLoading ? (
            <div className="loading-message">
              <p>Finding your perfect movies...</p>
            </div>
          ) : (
            <div className="movie-grid">
              {recommendations.map((movie, index) => (
                <div
                  className="movie-item"
                  key={index}
                  onMouseEnter={() => handleMouseEnter(`rec-${index}`)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div
                    className={`card movie-card recommendation-card ${
                      hoveredMovieId === `rec-${index}` ? "hovered" : ""
                    }`}
                  >
                    <img
                      src={movie.image_url || "https://via.placeholder.com/200x300"}
                      className="card-img-top"
                      alt={movie.title}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{movie.title}</h5>
                      <p className="recommendation-explanation">
                        {movie.explanation}
                      </p>
                      <div className="hover-icons">
                        <button
                          className="icon-button circle-button add-to-watchlist-button"
                          onClick={() => handleAddToWatchlist(movie)}
                        >
                          <span className="icon">+</span>
                          <span className="tooltip-text-add">Add to Watchlist</span>
                        </button>
                        <button
                          className="icon-button circle-button add-to-favorites-button"
                          onClick={() => handleAddFavorite(movie)}
                        >
                          <span className="icon">
                            {favoritedRecommendations[movie.imdb_id] ? "♥" : "♡"}
                          </span>
                          <span className="tooltip-text-favorite">
                            {favoritedRecommendations[movie.imdb_id]
                              ? "In Favorites"
                              : "Add to Favorites"}
                          </span>
                        </button>
                        <button
                          className="icon-button circle-button"
                          onClick={() => props.onShowMovie(movie)}
                        >
                          <span className="icon">i</span>
                          <span className="tooltip-text-info">More Info</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Movies List */}
      <div className="movie-grid">
        {sortedMovies.length > 0 ? (
          sortedMovies.map((favoriteMovie) => {
            const movie = favoriteMovie.movie;
            const isSelected = selectedMovies.includes(favoriteMovie.id);
            
            return (
              <div
                className="movie-item"
                key={favoriteMovie.id}
                onMouseEnter={() => handleMouseEnter(favoriteMovie.id)}
                onMouseLeave={handleMouseLeave}
                onClick={() => isSelectionMode && toggleMovieSelection(favoriteMovie.id)}
                style={{ cursor: isSelectionMode ? 'pointer' : 'default' }}
              >
                <div
                  className={`card movie-card ${
                    hoveredMovieId === favoriteMovie.id ? "hovered" : ""
                  } ${isSelected ? "selected" : ""}`}
                >
                  {/* Selection Checkmark */}
                  {isSelectionMode && (
                    <div className={`selection-checkmark ${isSelected ? 'checked' : ''}`}>
                      {isSelected ? '✓' : ''}
                    </div>
                  )}
                  
                  <img
                    src={movie.image_url}
                    className="card-img-top"
                    alt={movie.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{movie.title}</h5>
                    {!isSelectionMode && (
                      <div className="hover-icons">
                        <button
                          className="icon-button circle-button"
                          onClick={() => props.onShowMovie(movie)}
                        >
                          <span className="icon">i</span>
                          <span className="tooltip-text-info">More Info</span>
                        </button>
                        <button
                          className="icon-button circle-button"
                          onClick={() => props.onDestroyFavoriteMovie(favoriteMovie)}
                        >
                          <DeleteIcon className="icon" />
                          <span className="tooltip-text-remove">Remove</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-results">
            <p>No Results Found. Please reset filters to expand the search.</p>
          </div>
        )}
      </div>

      {/* Toast Notification (same bottom toast as Search) */}
      {showToast && (
        <div className="toast-notification">
          {toastMessage}
        </div>
      )}
    </div>
  );
}


