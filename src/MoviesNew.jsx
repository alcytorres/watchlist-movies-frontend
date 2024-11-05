import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MoviesNew.css";

export function MoviesNew(props) {
  const [searchResults, setSearchResults] = useState([]);

  // NEW: State to track Watchlist and Favorites across sessions
  const [watchlistStatus, setWatchlistStatus] = useState({});
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // NEW: Load Watchlist and Favorites on component mount (or user sign-in)
  useEffect(() => {
    axios.get("http://localhost:3000/user_collections")
      .then((response) => {
        const { watchlist, favorites } = response.data;
        
        // Set the watchlist status based on user collections
        const initialStatus = {};
        watchlist.forEach((imdb_id) => initialStatus[imdb_id] = true);
        favorites.forEach((imdb_id) => initialStatus[imdb_id] = true);

        setWatchlistStatus(initialStatus);
      })
      .catch((error) => console.error("Error fetching user collections", error));
  }, []); // Only fetch once on mount or user sign-in

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

  const handleToggleWatchlist = (movie) => {
    const params = {
      title: movie.title,
      image_url: movie.image_url,
      description: movie.description,
      director: movie.director,
      release_year: movie.release_year,
      imdb_id: movie.imdb_id,
      streaming_services: movie.streaming_services,
    };

    const url = `http://localhost:3000/watchlist_movies`;
    axios
      .post(url, params)
      .then((response) => {
        const { in_watchlist, error } = response.data;

        if (error) {
          setToastMessage(error);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 5000);
          return;
        }

        // Update watchlist status based on response
        setWatchlistStatus((prevState) => ({
          ...prevState,
          [movie.imdb_id]: in_watchlist,
        }));

        // Set toast message
        setToastMessage(in_watchlist ? "Added to Watchlist" : "Removed from Watchlist");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
      })
      .catch((error) => {
        console.error("Error toggling the movie in the Watchlist", error);
      });
  };

  const [hoveredMovieId, setHoveredMovieId] = useState(null);
  const [hoverTimer, setHoverTimer] = useState(null);

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
                  className={`card movie-card ${hoveredMovieId === movie.tmdb_id ? "hovered" : ""}`}
                >
                  <img
                    src={movie.image_url}
                    className="card-img-top"
                    alt={movie.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{movie.title}</h5>
                    <div className="hover-icons">
                      <button
                        className="icon-button circle-button"
                        onClick={() => handleToggleWatchlist(movie)}
                      >
                        <span className="icon">
                          {watchlistStatus[movie.imdb_id] ? "✓" : "+"}
                        </span>
                        <span className="tooltip-text-add">
                          {watchlistStatus[movie.imdb_id]
                            ? "Remove from Watchlist"
                            : "Add to Watchlist"}
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
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
