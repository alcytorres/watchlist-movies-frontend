import axios from "axios";
import { useState, useEffect } from "react";
import { MoviesIndex } from "./MoviesIndex";
import { MoviesShow } from "./MoviesShow";
import { FavoriteMoviesNew } from "./FavoriteMoviesNew";
import { Modal } from "./Modal";

  export function Content() {
    const [movies, setMovies] = useState([]);
    const [favoriteMovies, setFavoriteMovies] = useState([]); // Added state for favorite movies
    const [isMoviesShowVisible, setIsMoviesShowVisible] = useState(false);
    const [currentMovie, setCurrentMovie] = useState({});

    const handleIndexMovies = () => {
      console.log("handleIndexMovies");          
      axios.get("http://localhost:3000/movies.json").then((response) => {
        console.log(response.data);
        setMovies(response.data);
      });
    };

    const handleCreateFavoriteMovie = (params, successCallback) => {
      console.log("handleCreateFavoriteMovie", params);
      axios.post("http://localhost:3000/favorite_movies.json", params).then((response) => {
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
  
  
    useEffect(handleIndexMovies, []);

    return (
      <div>
        <FavoriteMoviesNew onCreateFavoriteMovie={handleCreateFavoriteMovie} />
        <MoviesIndex movies={movies} onShowMovie={handleShowMovie} />
        <Modal show={isMoviesShowVisible} onClose={handleClose}>
        <MoviesShow movie={currentMovie} />
        </Modal>
      </div>
    );
  }

