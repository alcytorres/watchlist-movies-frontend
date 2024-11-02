import React, { useState } from "react";
import axios from "axios";
import "./MoviesNew.css";
import "./MoviesIndex.css"; // Import MoviesIndex.css for shared styles

export function MoviesNew(props) {
  const [searchResults, setSearchResults] = useState([]);

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
        alert(`${movie.title} added to your Watchlist`);
        setSearchResults(searchResults.filter((m) => m.tmdb_id !== movie.tmdb_id));
      })
      .catch((error) => {
        console.error("Error adding the movie to your Watchlist", error);
      });
  };

  // NEW: State for hover effects
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

  // NEW: Handle showing movie details
  const handleShowMovie = (movie) => {
    // Implement modal or redirect to movie details page
    // For now, we'll just alert the movie title
    alert(`More info about ${movie.title}`);
  };

  return (
    <div>
      <h1>Add a Movie</h1>

      {/* Movie search form */}
      <form onSubmit={handleSearch}>
        <div>
          Search by Title: <input name="query" type="text" />
        </div>
        <button className="search-movie-btn" type="submit">
          Search
        </button>
      </form>

      {/* Display search results */}
      {searchResults.length > 0 && (
        <div>
          <br />
          <h2>Search Results:</h2>
          {/* Use movie-grid to display movies in a grid */}
          <div className="movie-grid">
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
                        {/* Add icon inside a circle */}
                        <span className="icon">+</span>
                        {/* Tooltip */}
                        <span className="tooltip-text-add">Add to Watchlist</span> 
                      </button>
                      <button
                        className="icon-button circle-button"
                        onClick={() => props.onShowMovie(movie)}  // Use onShowMovie as in MoviesIndex
                      >
                        {/* More Info icon inside a circle */}
                        <span className="icon">i</span>
                        {/* Tooltip */}
                        <span className="tooltip-text-info">More Info</span>
                      </button>
                      {/* REMOVE: 'Remove' button not needed */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
