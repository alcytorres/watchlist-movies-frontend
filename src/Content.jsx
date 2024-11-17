import axios from "axios";
import { useState, useEffect } from "react";
import { MoviesIndex } from "./MoviesIndex";
import { MoviesShow } from "./MoviesShow";
import { FavoriteMoviesNew } from "./FavoriteMoviesNew";
import { FavoriteMoviesIndex } from "./FavoriteMoviesIndex";
import { Modal } from "./Modal";
import { Routes, Route } from "react-router-dom";
import { Signup } from './Signup';
import { Login } from './Login';
import { LogoutLink } from './LogoutLink';
import { About } from "./About";
import { MoviesNew } from "./MoviesNew";

export function Content() {
  const [movies, setMovies] = useState([]);
  const [isMoviesShowVisible, setIsMoviesShowVisible] = useState(false);
  const [currentMovie, setCurrentMovie] = useState({});
  const [favoriteMovies, setFavoriteMovies] = useState([]); // Added state for favorite movies

  // Defines an arrow function named handleIndexMovies
  const handleIndexMovies = () => { // copy and paste this for user movies method in the backend movies controller
    console.log("handleIndexMovies"); // Logs the string "handleIndexMovies" to the console for debugging purposes.
    axios.get("http://localhost:3000/watchlist_movies.json").then((response) => { 
      console.log(response.data); // Logs the data received from the API response to the console.
      setMovies(response.data); // Updates the state variable movies with the data received from the API.
    });
  };

  // Fetch the user's favorite movies
  const favoriteMovieIndex = () => {
    console.log("handleIndexFavoriteMovies");
    axios.get("http://localhost:3000/favorite_movies.json").then((response) => {
      console.log(response.data);
      setFavoriteMovies(response.data);
    });
  };

  const handleShowMovie = (movie) => {
    console.log("handleShowMovie", movie);
    setIsMoviesShowVisible(true);
    setCurrentMovie(movie);
  };

  // Add movie to favorites and remove from Watchlist
  const handleShowAddFavorite = (movie) => {
    axios
      .post("http://localhost:3000/favorite_movies.json", { movie_id: movie.id })
      .then((response) => {
        const favoriteMovie = response.data;
        // Update favoriteMovies with the new favoriteMovie
        setFavoriteMovies([...favoriteMovies, favoriteMovie]);
        // Remove movie from Watchlist
        setMovies(movies.filter((m) => m.id !== movie.id));
      })
      .catch((error) => {
        console.error("Error adding to favorites:", error);
      });
  };

  const handleCreateFavoriteMovie = (params, successCallback) => {
    console.log("handleCreateFavoriteMovie", params);
    axios.post("http://localhost:3000/favorite_movies.json", params).then((response) => {
      setFavoriteMovies([...favoriteMovies, response.data]); 
      successCallback();
    });
  };

  const handleCreateMovie = (params, successCallback) => {
    console.log("handleCreateMovie", params);
    axios.post("http://localhost:3000/movies.json", params).then((response) => {
      setMovies([...movies, response.data]);
      successCallback();
    });
  };

  // Remove movie from favorites and add back to "Watchlist"
  const handleDestroyFavoriteMovie = (favoriteMovie) => {
    axios
      .delete(`http://localhost:3000/favorite_movies/${favoriteMovie.id}.json`)
      .then(() => {
        const movie = favoriteMovie.movie;
        // Add the movie back to the Watchlist
        setMovies([...movies, movie]);
        // Remove the movie from favoriteMovies
        setFavoriteMovies(favoriteMovies.filter((m) => m.id !== favoriteMovie.id));
      })
      .catch((error) => {
        console.error("Error removing from favorites:", error);
      });
  };

  // Function to remove a movie from Watchlist
  const handleDestroyWatchlistMovie = (movie) => {
    axios.delete(`http://localhost:3000/watchlist_movies/${movie.id}.json`).then(() => {
      setMovies(movies.filter((m) => m.id !== movie.id)); // Remove movie from Watchlist
    });
  };

  const handleClose = () => {
    console.log("handleClose");
    setIsMoviesShowVisible(false);
  };

  useEffect(handleIndexMovies, []); // All the movies
  useEffect(favoriteMovieIndex, []); // Filtered movies

  return (
    <div className="container">
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Route for MoviesNew with search functionality */}
        <Route 
          path="/movies/new" 
          element={
            <MoviesNew 
              onShowMovie={handleShowMovie}  // Pass handleShowMovie to MoviesNew
            />
          } 
        />

        {/* <Route 
          path="/movies/new" 
          element={<MoviesNew onCreateMovie={handleCreateMovie} />} /> */}

        <Route 
          path="/" 
          element={
            <MoviesIndex 
              movies={movies} 
              onShowMovie={handleShowMovie} 
              onAddFavorite={handleShowAddFavorite} 
              onDestroyWatchlistMovie={handleDestroyWatchlistMovie}  // Pass the function
            />
          } 
        />

        <Route 
          path="/favoritemovies" 
          element={
            <FavoriteMoviesIndex 
              favoriteMovies={favoriteMovies} 
              onShowMovie={handleShowMovie} 
              onDestroyFavoriteMovie={handleDestroyFavoriteMovie} 
            />
          } 
        />
      </Routes>

      <Modal show={isMoviesShowVisible} onClose={handleClose}>
        {/* Pass currentMovie directly since streaming services are included */}
        <MoviesShow movie={currentMovie} />
      </Modal>
    </div>
  );
}

