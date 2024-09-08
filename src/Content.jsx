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

    //  Defines an arrow function named handleIndexMovies 
    const handleIndexMovies = () => {    // copy and paste this for user movies method in the backend movies controller  
      // Logs the string "handleIndexMovies" to the console for debugging purposes.   
      console.log("handleIndexMovies");    
      // Sends a GET request to the URL http://localhost:3000/movies.json using axios
      // Begins a chain that executes once the GET request is successful. The response object contains the data returned from the server.
      axios.get("http://localhost:3000/movies.json").then((response) => {  
        // Logs the data received from the API response to the console.                                                                   
        console.log(response.data); 
        // Updates the state variable movies with the data received from the API, effectively storing the list of movies fetched from the server.
        setMovies(response.data);   
      });
    };

    // Fetch the user's favorite movies
    const favoriteMovieIndex = () => {
      console.log("handleIndexFavoriteMovies");          
      axios.get("http://localhost:3000/user_movies.json").then((response) => {
        console.log(response.data);
        setFavoriteMovies(response.data);
      });
    };

    const handleShowMovie = (movie) => {
      console.log("handleShowMovie", movie);
      setIsMoviesShowVisible(true);
      setCurrentMovie(movie);
    };

     // NEW: Add movie to favorites and remove from "All Movies"
     const handleShowAddFavorite = (movie) => {
      console.log(movie);
      axios.post("http://localhost:3000/favorite_movies.json", { movie_id: movie.id }).then((response) => {
        setFavoriteMovies([...favoriteMovies, response.data]); // Add to favorite movies
        setMovies(movies.filter((m) => m.id !== movie.id));  // Remove from "All Movies"
      });
    };

    // const handleShowAddFavorite = (movie) => {
    //   console.log(movie);
    //   axios.post("http://localhost:3000/favorite_movies.json", {movie_id: movie.id}).then((response) => {
    //     console.log(response.data)
    //   })
    // };

    const handleCreateFavoriteMovie = (params, successCallback) => {
      console.log("handleCreateFavoriteMovie", params);
      axios.post("http://localhost:3000/favorite_movies.json", params).then((response) => {
        // setFavoriteMovies([...favorite_movies, response.data]);
        setFavoriteMovies([...favoriteMovies, response.data]); // Corrected the state update
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
   
    // NEW: Remove movie from favorites and add back to "All Movies"
    const handleDestroyFavoriteMovie = (id, movie) => {
      axios.delete(`http://localhost:3000/favorite_movies/${id}.json`).then(() => {
        // Add back the movie to the general "All Movies" list
        setMovies([...movies, movie]);
        // Remove the movie from the favoriteMovies state
        setFavoriteMovies(favoriteMovies.filter((m) => m.favoritemovie_id !== id));
      });
    };

    // const handleDestroyFavoriteMovie = (id) => {
    //   console.log("handleDestroyFavoriteMovie", id);
    //   axios.delete(`http://localhost:3000/favorite_movies/${id}.json`).then((response) => {
    //     setFavoriteMovies(favoriteMovies.filter((favoriteMovie) => favoriteMovie.id !== id));
    //     window.location.href = "/favoritemovies";
    //     handleClose();
    //   });
    // };

    const handleClose = () => {
      console.log("handleClose");
      setIsMoviesShowVisible(false);
    };
  

    useEffect(handleIndexMovies, []);   // All the movies
    useEffect(favoriteMovieIndex, []);  // Filtered movies
  
    return (
      <div className="container">
        <Routes>
          <Route path="/about" element={<About />}/>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<MoviesIndex movies={movies} onShowMovie={handleShowMovie} onAddFavorite={handleShowAddFavorite}/>} />
          <Route path="/movies/new" element={<MoviesNew onCreateMovie={handleCreateMovie} />} />

          {/* should the route be user_movies instead of favoritemovies??? */}
          <Route path="/favoritemovies" element={<FavoriteMoviesIndex favoriteMovies={favoriteMovies} onShowMovie={handleShowMovie} onDestroyFavoriteMovie={handleDestroyFavoriteMovie}/>} />

        </Routes>

        <Modal show={isMoviesShowVisible} onClose={handleClose}>
          <MoviesShow movie={currentMovie} />
        </Modal>
      </div>
    );
  }


