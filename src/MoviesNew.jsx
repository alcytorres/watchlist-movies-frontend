import React, { useState } from "react";
import axios from "axios";
import "./MoviesNew.css";



// Placeholder text

// Placeholder text




export function MoviesNew(props) {
  const [searchResults, setSearchResults] = useState([]);

   // NEW: State for toast notification
   const [toastMessage, setToastMessage] = useState("");
   const [showToast, setShowToast] = useState(false);
 

  // Handle movie search
  const handleSearch = (event) => {
    event.preventDefault();
    const query = event.target.query.value;

    axios
      .get(`http://localhost:3000/search_tmdb?query=${encodeURIComponent(query)}`)
      .then((response) => {
        const movies = response.data.movies || [];
        setSearchResults(movies);
      })
      .catch((error) => {
        console.error("Error searching for the movie", error);
        setSearchResults([]);
      });
  };

  // Handle adding a movie when 'Add' button is clicked
  const handleAddMovie = (movie) => {
    const params = {
      title: movie.title,
      image_url: movie.image_url,
      description: movie.description,
      director: movie.director,
      release_year: movie.release_year,
      imdb_id: movie.imdb_id,
      streaming_services: movie.streaming_services,
    };

    // Send request to watchlist_movies endpoint
    axios
      .post("http://localhost:3000/watchlist_movies", params)
      .then(() => {
        // REMOVE: alert(`${movie.title} added to your Watchlist`);

        // NEW: Set toast message and show toast
        setToastMessage(`Added to Watchlist`);
        setShowToast(true);

        // Hide the toast after XX seconds
        setTimeout(() => {
          setShowToast(false);
        }, 5000);

        // Remove the movie from search results
        setSearchResults(searchResults.filter((m) => m.tmdb_id !== movie.tmdb_id));
      })
      .catch((error) => {
        console.error("Error adding the movie to your Watchlist", error);
      });
  };

  // State for hover effects
  const [hoveredMovieId, setHoveredMovieId] = useState(null);
  const [hoverTimer, setHoverTimer] = useState(null);

  // Handle mouse enter with delay
  const handleMouseEnter = (movieId) => {
    const timer = setTimeout(() => {
      setHoveredMovieId(movieId);
    }, 500); // 500 milliseconds delay

    setHoverTimer(timer);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
    setHoveredMovieId(null);
  };

  return (
    <div>
      <h1 className="search">Search by Title</h1>

      {/* Movie search form */}
      <form className="search-bar" onSubmit={handleSearch}>
        <div>
          <input name="query" type="text" />
        </div>
        <button className="search-movie-btn" type="submit">
          Search
        </button>
      </form>

      {/* Display movie search results */}
      {searchResults.length > 0 && (
        <div>
          <br />
          <h2></h2>
          <div className="movie-grid"> {/* Adjusted grid class to ensure card size matches MoviesIndex */}
            {searchResults.map((movie) => (
              <div
                className="movie-item"
                key={movie.tmdb_id}
                onMouseEnter={() => handleMouseEnter(movie.tmdb_id)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Movie card */}
                <div
                  className={`card movie-card ${
                    hoveredMovieId === movie.tmdb_id ? "hovered" : ""
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
                        onClick={() => handleAddMovie(movie)}
                      >
                        {/* Add to My List icon inside a circle */}
                        <span className="icon">+</span>
                        {/* Tooltip */}
                        <span className="tooltip-text-add">Add to Watchlist</span>
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
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}



    {/* NEW: Toast Notification */}
      {showToast && (
        <div className="toast-notification">
          {toastMessage}
        </div>
      )}
    </div>
  );
}