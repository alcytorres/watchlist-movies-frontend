import React, { useState } from "react";
import axios from "axios";
import "./FavoriteMoviesIndex.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { Range } from "react-range";

const MIN_YEAR = 1900;
const MAX_YEAR = new Date().getFullYear();

export function FavoriteMoviesIndex(props) {
  // Existing state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedYears, setSelectedYears] = useState([MIN_YEAR, MAX_YEAR]);
  const [hoveredMovieId, setHoveredMovieId] = useState(null);
  const [hoverTimer, setHoverTimer] = useState(null);

  // New state for recommendations
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [basedOnMovies, setBasedOnMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle year filter
  const handleYearChange = (values) => {
    setSelectedYears(values);
  };

  // Filter favorite movies
  const filteredMovies = props.favoriteMovies.filter((favoriteMovie) => {
    const movie = favoriteMovie.movie;
    return (
      movie.release_year >= selectedYears[0] &&
      movie.release_year <= selectedYears[1]
    );
  });

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
      alert("Please select at least 2 movies");
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
      alert(error.response?.data?.error || "Failed to get recommendations");
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
        alert("Added to Watchlist!");
      })
      .catch((error) => {
        console.error("Error adding to watchlist:", error);
        alert("Failed to add to watchlist");
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
        {/* Release Year Filter */}
        <button className="filter-button" onClick={toggleDropdown}>
          Release Year&nbsp;&nbsp;▼
        </button>

        {/* Recommendations Button */}
        {!showRecommendations ? (
          <button 
            className={`filter-button recommendations-button ${isSelectionMode ? 'selection-mode' : ''}`}
            onClick={handleGetRecommendations}
          >
            {isSelectionMode 
              ? `Select Movies (${selectedMovies.length}/6)` 
              : "Get AI Recommendations"}
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
                      <p className="recommendation-explanation">{movie.explanation}</p>
                      <div className="hover-icons">
                        <button
                          className="icon-button circle-button"
                          onClick={() => props.onShowMovie(movie)}
                        >
                          <span className="icon">i</span>
                          <span className="tooltip-text-info">More Info</span>
                        </button>
                        <button
                          className="icon-button circle-button add-to-watchlist-button"
                          onClick={() => handleAddToWatchlist(movie)}
                        >
                          <span className="icon">+</span>
                          <span className="tooltip-text-add">Add to Watchlist</span>
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
        {filteredMovies.length > 0 ? (
          filteredMovies.map((favoriteMovie) => {
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

    </div>
  );
}


