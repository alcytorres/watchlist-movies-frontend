import axios from "axios";
import { useState, useEffect } from "react";
import { MoviesIndex } from "./MoviesIndex";
import { MoviesShow } from "./MoviesShow";
import { FavoriteMoviesNew } from "./FavoriteMoviesNew";
import { Modal } from "./Modal";
import { Routes, Route } from "react-router-dom";
import { Signup } from './Signup';
import { Login } from './Login';
import { LogoutLink } from './LogoutLink';
import { About } from "./About";
import { MoviesNew } from "./MoviesNew";


  export function Content() {
    const [movies, setMovies] = useState([]);
    const [favoriteMovies, setFavoriteMovies] = useState([]); // Added state for favorite movies
    const [isMoviesShowVisible, setIsMoviesShowVisible] = useState(false);
    const [currentMovie, setCurrentMovie] = useState({});

    const handleIndexMovies = () => {    // copy and paste this for user movies method in the backend movies controller  
      console.log("handleIndexMovies");          
      axios.get("http://localhost:3000/movies.json").then((response) => {
        console.log(response.data);
        setMovies(response.data);
      });
    };

    const handleCreateFavoriteMovie = (params, successCallback) => {
      console.log("handleCreateFavoriteMovie", params);
      axios.post("http://localhost:3000/favorite_movies.json", params).then((response) => {
        // setFavoriteMovies([...favorite_movies, response.data]);
        setFavoriteMovies([...favoriteMovies, response.data]); // Corrected the state update
        successCallback();
      });
    };

    const handleShowMovie = (movie) => {
      console.log("handleShowMovie", movie);
      setIsMoviesShowVisible(true);
      setCurrentMovie(movie);
    };
  
    const handleClose = () => {
      console.log("handleClose");
      setIsMoviesShowVisible(false);
    };

    const handleCreateMovie = (params, successCallback) => {
      console.log("handleCreateMovie", params);
      axios.post("http://localhost:3000/movies.json", params).then((response) => {
        setMovies([...movies, response.data]);
        successCallback();
      });
    };
  
    const handleShowAddFavorite = (movie) => {
      console.log(movie);
      axios.post("http://localhost:3000/favorite_movies.json", {movie_id: movie.id}).then((response) => {
        console.log(response.data)
      })
    };

    useEffect(handleIndexMovies, []);
  
    return (
      <div>
        <Routes>
          <Route path="/about" element={<About />}/>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          <Route path="/movies" element={<MoviesIndex movies={movies} onShowMovie={handleShowMovie} onAddFavorite={handleShowAddFavorite}/>} />
          <Route path="/movies/new" element={<MoviesNew onCreateMovie={handleCreateMovie} />} />

        </Routes>

        <Modal show={isMoviesShowVisible} onClose={handleClose}>
          <MoviesShow movie={currentMovie} />
        </Modal>
      </div>
    );
  }


