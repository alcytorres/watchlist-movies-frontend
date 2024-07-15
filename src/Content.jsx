import axios from "axios";
import { useState, useEffect } from "react";
import { MoviesIndex } from "./MoviesIndex";
import { MoviesShow } from "./MoviesShow";
import { Modal } from "./Modal";

  export function Content() {
    const [movies, setMovies] = useState([]);
    const [isMoviesShowVisible, setIsMoviesShowVisible] = useState(false);
    const [currentMovie, setCurrentMovie] = useState({});

    const handleIndexMovies = () => {
      console.log("handleIndexMovies");          
      axios.get("http://localhost:3000/movies.json").then((response) => {
        console.log(response.data);
        setMovies(response.data);
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
        <MoviesIndex movies={movies} onShowMovie={handleShowMovie} />
        <Modal show={isMoviesShowVisible} onClose={handleClose}>
        <MoviesShow movie={currentMovie} />
        </Modal>
      </div>
    );
  }

