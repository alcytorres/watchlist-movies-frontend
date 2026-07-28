import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MoviesNew.css";

export function MoviesNew(props) {
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState("");

  // State to track Watchlist and Favorites across sessions (kept separate so each
  // button reflects its own list)
  const [watchlistStatus, setWatchlistStatus] = useState({});
  const [favoriteStatus, setFavoriteStatus] = useState({});
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Load Watchlist and Favorites on component mount (or user sign-in)
  useEffect(() => {
    axios.get("http://localhost:3000/user_collections")
      .then((response) => {
        const { watchlist, favorites } = response.data;

        const initialWatchlist = {};
        const initialFavorites = {};
        watchlist.forEach((imdb_id) => (initialWatchlist[imdb_id] = true));
        favorites.forEach((imdb_id) => (initialFavorites[imdb_id] = true));

        setWatchlistStatus(initialWatchlist);
        setFavoriteStatus(initialFavorites);
      })
      .catch((error) => console.error("Error fetching user collections", error));
  }, []); // Only fetch once on mount or user sign-in

  const handleSearch = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    axios
      .get(`http://localhost:3000/search_tmdb?query=${encodeURIComponent(trimmed)}`)
      .then((response) => {
        const movies = response.data.movies || [];
        setSearchResults(movies);
      })
      .catch((error) => {
        console.error("Error searching for the movie", error);
        setSearchResults([]);
      });
  };

  const handleClearQuery = () => {
    setQuery("");
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
        const message =
          error.response?.data?.errors?.join(", ") ||
          error.response?.data?.error ||
          "Failed to update Watchlist";
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
      });
  };

  // Toggle Favorites from search (mirrors Watchlist: click once to add, again to remove)
  const handleToggleFavorite = (movie) => {
    const params = {
      title: movie.title,
      image_url: movie.image_url,
      description: movie.description,
      director: movie.director,
      release_year: movie.release_year,
      imdb_id: movie.imdb_id,
      streaming_services: movie.streaming_services,
    };

    axios
      .post("http://localhost:3000/favorite_movies.json", params)
      .then((response) => {
        const { in_favorites, error } = response.data;

        if (error) {
          setToastMessage(error);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 5000);
          return;
        }

        setFavoriteStatus((prevState) => ({
          ...prevState,
          [movie.imdb_id]: in_favorites,
        }));

        // Adding to Favorites removes it from the Watchlist on the backend
        if (in_favorites) {
          setWatchlistStatus((prevState) => ({
            ...prevState,
            [movie.imdb_id]: false,
          }));
        }

        setToastMessage(in_favorites ? "Added to Favorites" : "Removed from Favorites");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
      })
      .catch((error) => {
        console.error("Error toggling the movie in Favorites", error);
        const message =
          error.response?.data?.errors?.join(", ") ||
          error.response?.data?.error ||
          "Failed to update Favorites";
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
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
        <div className="search-field">
          <span className="search-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" />
            </svg>
          </span>
          <input
            name="query"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title"
            autoComplete="off"
            aria-label="Search by title"
          />
          {query.length > 0 && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={handleClearQuery}
              aria-label="Clear search"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>
          )}
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
                        className="icon-button circle-button add-to-favorites-button"
                        onClick={() => handleToggleFavorite(movie)}
                      >
                        <span className="icon">
                          {favoriteStatus[movie.imdb_id] ? "♥" : "♡"}
                        </span>
                        <span className="tooltip-text-favorite">
                          {favoriteStatus[movie.imdb_id]
                            ? "Remove from Favorites"
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
