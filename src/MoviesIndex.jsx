import React, { useState } from "react";
import { Range } from "react-range";
import "./MoviesIndex.css";
import DeleteIcon from "@mui/icons-material/Delete";



// Placeholder text



const MIN_YEAR = 1900;
const MAX_YEAR = new Date().getFullYear(); // Capture the current year dynamically

// Streaming service icons or names array
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

export function MoviesIndex(props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedYears, setSelectedYears] = useState([MIN_YEAR, MAX_YEAR]);

  // Initial state: all streaming services are selected
  const [selectedStreamingServices, setSelectedStreamingServices] = useState(
    streamingServices.map((service) => service.id)
  );

  // State to manage hover effects with delay
  const [hoveredMovieId, setHoveredMovieId] = useState(null);
  const [hoveredService, setHoveredService] = useState(null); // Store hovered service
  const [hoverTimer, setHoverTimer] = useState(null);

  // Hover handling for delayed modal display
  const handleMouseEnterService = (service) => {
    const timer = setTimeout(() => setHoveredService(service), 500); // 0.5-second delay
    setHoverTimer(timer);
  };

  const handleMouseLeaveService = () => {
    clearTimeout(hoverTimer);
    setHoveredService(null);
  };


  // Toggle dropdown for release year filter
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle year filter state update
  const handleYearChange = (values) => {
    setSelectedYears(values);
  };

  // Toggle streaming services dynamically
  const toggleStreamingService = (id) => {
    if (selectedStreamingServices.includes(id)) {
      if (selectedStreamingServices.length > 1) {
        // Deselect the service
        setSelectedStreamingServices(
          selectedStreamingServices.filter((service) => service !== id)
        );
      } else {
        // If only one service is selected and it's being unchecked, reset to all services
        setSelectedStreamingServices(streamingServices.map((service) => service.id));
      }
    } else {
      // Add to selected services
      setSelectedStreamingServices([...selectedStreamingServices, id]);
    }
  };

  // Dynamically filter the movies
  const filteredMovies = props.movies.filter((movie) => {
    const movieStreamingServices = movie.streaming_services || []; // Ensure it's an array

    const yearFilter =
      movie.release_year >= selectedYears[0] && movie.release_year <= selectedYears[1];

    const allServicesSelected = selectedStreamingServices.length === streamingServices.length;

    let streamingFilter;

    if (allServicesSelected) {
      // All services are selected; show all movies
      streamingFilter = true;
    } else {
      // Check if 'Non-Streaming' is selected
      const nonStreamingSelected = selectedStreamingServices.includes('non-streaming');

    if (movieStreamingServices.length === 0) {
      // Movie is non-streaming
      streamingFilter = nonStreamingSelected;
    } else {
      // Filter movies that have at least one streaming service
      streamingFilter = movieStreamingServices.some((service) =>
        selectedStreamingServices.includes(service)
      );
    }
  }

  return yearFilter && streamingFilter;
});

  // Handle mouse enter with delay
  const handleMouseEnter = (movieId) => {
    // Start a timer to set the hovered movie after 0.5 seconds
    const timer = setTimeout(() => {
      setHoveredMovieId(movieId);
    }, 500); // 500 milliseconds delay

    setHoverTimer(timer);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    // Clear any existing timer
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
    // Reset hovered movie
    setHoveredMovieId(null);
  };

  return (
    <div>
      <h1 className="watchlist">Watchlist</h1>
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
                onMouseEnter={() => handleMouseEnterService(service)} // Hover event
                onMouseLeave={handleMouseLeaveService}                // Hover leave event
                style={{ position: "relative" }} /* Ensures modal is positioned relative to the icon */
              >
                <img src={service.icon} alt={service.name} />
                {/* Conditional rendering for modal */}
                {hoveredService && hoveredService.id === service.id && (
                  <div className="hover-modal">
                    {service.label}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div> 

        {/* Release Year Filter (placed below streaming services) */}
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
                  <div 
                    {...props} 
                    className="slider-track" 
                    style={
                      props.style}>
                    {children}
                  </div>
                )}
                renderThumb={({
                  props,
                  index,
                  isDragged, // Destructure isDragged to detect dragging
                }) => (
                  <div
                    {...props}
                    className="slider-thumb"
                    // Track which thumb is being dragged
                    onMouseDown={() => setDraggedThumbIndex(index)}
                    onMouseUp={() => setDraggedThumbIndex(null)}
                    onTouchStart={() => setDraggedThumbIndex(index)}
                    onTouchEnd={() => setDraggedThumbIndex(null)}
                  >
                    {/* Display tooltip only for the thumb being dragged */}
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

      {/* Movies List */}
      <div className="movie-grid">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <div
              className="movie-item"
              key={movie.id}
              // Add mouse enter and leave handlers
              onMouseEnter={() => handleMouseEnter(movie.id)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Movie card */}
              <div
                className={`card movie-card ${
                  hoveredMovieId === movie.id ? "hovered" : ""
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
                      onClick={() => props.onAddFavorite(movie)}
                    >
                      {/* Add to My List icon inside a circle */}
                      <span className="icon">+</span>
                      {/* Tooltip */}
                      <span className="tooltip-text-add">Add to Favorites</span>
                    </button>
                    <button
                      className="icon-button circle-button"
                      onClick={() => props.onShowMovie(movie)}
                    >
                      {/* More Info icon inside a circle */}
                      <span className="icon">i</span>
                      {/* Tooltip */}
                      <span className="tooltip-text-info">More Info</span>
                    </button>
                    {/* Delete button */}
                    <button
                      className="icon-button circle-button"
                      onClick={() => props.onDestroyWatchlistMovie(movie)}
                    >
                      <DeleteIcon className="icon" />
                      <span className="tooltip-text-remove">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No Results Found. Please reset filters to expand the search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
