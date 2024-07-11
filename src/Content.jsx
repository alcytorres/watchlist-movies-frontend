import axios from "axios";
import { useState, useEffect } from "react";
import { MoviesIndex } from "./MoviesIndex";

  export function Content() {
    const [movies, setMovies] = useState([]);

    const handleIndexMovies = () => {
      console.log("handleIndexMovies");          
      axios.get("http://localhost:3000/movies.json").then((response) => {
        console.log(response.data);
        setMovies(response.data);
      });
    };
  
    useEffect(handleIndexMovies, []);

    return (
      <div>
        <MoviesIndex movies={movies} />
      </div>
    );
  }

