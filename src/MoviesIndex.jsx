import React, { useState } from "react";
import { Range } from "react-range";
import "./MoviesIndex.css";

const MIN_YEAR = 1900;
const MAX_YEAR = new Date().getFullYear(); // Capture the current year dynamically

// Streaming service icons or names array
const streamingServices = [
  { id: 'max', name: 'MAX', icon: '/icons/max.svg' },
  { id: 'netflix', name: 'Netflix', icon: '/icons/netflix.svg' },
  { id: 'amazon', name: 'Prime Video', icon: '/icons/amazon.svg' },
  { id: 'disney', name: 'Disney+', icon: '/icons/disney.svg' },
  { id: 'apple', name: 'AppleTV+', icon: '/icons/apple.svg' },
  { id: 'paramount', name: 'Paramount Plus', icon: '/icons/paramount.svg' },
  { id: 'hulu', name: 'Hulu', icon: '/icons/hulu.svg' },
  { id: "other", name: "Other", icon: "/icons/other.svg" },
];

export function MoviesIndex(props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedYears, setSelectedYears] = useState([MIN_YEAR, MAX_YEAR]);

  // Initial state: all streaming services are selected
  const [selectedStreamingServices, setSelectedStreamingServices] = useState(
    streamingServices.map((service) => service.id)
  );

  // Toggle dropdown for release year filter
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle year filter state update
  const handleYearChange = (values) => {
    setSelectedYears(values);
  };

  // Toggle streaming services dynamically
  // NEW: Updated toggle logic to handle "other" category
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
      // Filter movies that have at least one streaming service in selectedStreamingServices
      streamingFilter = movieStreamingServices.some((service) =>
        selectedStreamingServices.includes(service)
      );
    }

    return yearFilter && streamingFilter;
  });


  return (
    <div>
      <h1>All Movies</h1>

      {/* Streaming service filter */}
      <div className="filter-section">
        <div className="streaming-services-filter">
          {streamingServices.map((service) => (
            <button
              key={service.id}
              className={`service-icon ${
                selectedStreamingServices.includes(service.id) ? "selected" : ""
              }`}
              onClick={() => toggleStreamingService(service.id)}
            >
              <img src={service.icon} alt={service.name} />
            </button>
          ))}
        </div>

        <button className="filter-button" onClick={toggleDropdown}>
          Release Year ▼
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
              <span>1990</span>
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

      {/* Movie List */}
      {/* NEW: Change 'row' to 'movie-grid' */}
      <div className="movie-grid">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <div className="movie-item" key={movie.id}>
              <div className="card movie-card">
                <img
                  src={movie.image_url}
                  className="card-img-top"
                  alt={movie.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{movie.name}</h5>
                  {/* NEW: Wrap buttons in a div */}
                  <div className="button-group">
                    <button
                      className="btn btn-primary"
                      onClick={() => props.onAddFavorite(movie)}
                    >
                      Add
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => props.onShowMovie(movie)}
                    >
                      Details
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






