import React, { useState } from "react";
import "./FavoriteMoviesIndex.css";

// NEW: Import DeleteIcon if using Material UI Icons
import DeleteIcon from "@mui/icons-material/Delete";

// NEW: Import Range component for release year filter
import { Range } from "react-range";

export function FavoriteMoviesIndex(props) {
  // NEW: State for release year filter
  const MIN_YEAR = 1900;
  const MAX_YEAR = new Date().getFullYear();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedYears, setSelectedYears] = useState([MIN_YEAR, MAX_YEAR]);

  // NEW: Toggle dropdown for release year filter
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // NEW: Handle year filter state update
  const handleYearChange = (values) => {
    setSelectedYears(values);
  };

  // NEW: Filter favorite movies based on selected years
  const filteredMovies = props.favoriteMovies.filter((favoriteMovie) => {
    const movie = favoriteMovie.movie;
    return (
      movie.release_year >= selectedYears[0] &&
      movie.release_year <= selectedYears[1]
    );
  });

  // NEW: State for hover effects with delay
  const [hoveredMovieId, setHoveredMovieId] = useState(null);
  const [hoverTimer, setHoverTimer] = useState(null);

  // NEW: Handle mouse enter with delay
  const handleMouseEnter = (movieId) => {
    const timer = setTimeout(() => {
      setHoveredMovieId(movieId);
    }, 500); // 500 milliseconds delay

    setHoverTimer(timer);
  };

  // NEW: Handle mouse leave
  const handleMouseLeave = () => {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
    setHoveredMovieId(null);
  };

  return (
    <div>
      <h1 className="favorite-movies">Favorite Movies</h1>
      <br />

      {/* NEW: Release Year Filter */}
      <div className="filter-section">
        <button className="filter-button" onClick={toggleDropdown}>
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
                renderThumb={({ props, index }) => (
                  <div {...props} className="slider-thumb">
                    {selectedYears[index]}
                  </div>
                )}
              />
              <span>{MAX_YEAR}</span>
            </div>
          </div>
        )}
      </div>

      {/* NEW: Movies List */}
      <div className="movie-grid">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((favoriteMovie) => {
            const movie = favoriteMovie.movie;
            return (
              <div
                className="movie-item"
                key={favoriteMovie.id}
                onMouseEnter={() => handleMouseEnter(favoriteMovie.id)}
                onMouseLeave={handleMouseLeave}
              >
                {/* NEW: Movie card with hover effect */}
                <div
                  className={`card movie-card ${
                    hoveredMovieId === favoriteMovie.id ? "hovered" : ""
                  }`}
                >
                  <img
                    src={movie.image_url}
                    className="card-img-top"
                    alt={movie.title}
                  />
                  {/* Title below the image */}
                  <div className="card-body">
                    <h5 className="card-title">{movie.title}</h5>
                    {/* Icons visible only on hover */}
                    <div className="hover-icons">
                      <button
                        className="icon-button circle-button"
                        onClick={() => props.onShowMovie(movie)}
                      >
                        {/* NEW: 'More Info' button */}
                        <span className="icon">i</span>
                        <span className="tooltip-text-info">More Info</span>
                      </button>
                      <button
                        className="icon-button circle-button"
                        onClick={() => props.onDestroyFavoriteMovie(favoriteMovie)}
                      >
                        {/* NEW: 'Remove' button */}
                        <DeleteIcon className="icon" />
                        <span className="tooltip-text-remove">Remove</span>
                      </button>
                    </div>
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
