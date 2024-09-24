import { useState } from "react";
import axios from "axios";
import "./MoviesNew.css";

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
      name: movie.name,
      image_url: movie.image_url,
      description: movie.description,
      director: movie.director,
      release_year: movie.release_year,
      imdb_id: movie.imdb_id,
      streaming_services: movie.streaming_services,
    };

    axios
      .post("http://localhost:3000/movies", params)
      .then(() => {
        alert(`${movie.name} added successfully`);
        setSearchResults(searchResults.filter((m) => m.tmdb_id !== movie.tmdb_id));
      })
      .catch((error) => {
        console.error("Error adding the movie", error);
      });
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
          <ul>
            {searchResults.map((movie) => (
              <li key={movie.tmdb_id} className="movie-item">
                <p className="movie-title">{movie.name}</p>
                <p>Release Year: {movie.release_year}</p>
                <p>Director: {movie.director}</p>
                {movie.streaming_services && movie.streaming_services.length > 0 ? (
                  <p className="streaming-info">
                    Available on:<ul className="streaming-services">
                      {movie.streaming_services.map((serviceId, index) => (
                        <li key={index}>{serviceId}</li>
                      ))}
                    </ul>
                  </p>
                ) : (
                  <p>No streaming sources available</p>
                )}
                {movie.image_url && (
                  <img src={movie.image_url} alt={movie.name} width="100" />
                )}
                <button className="add-movie-btn" onClick={() => handleAddMovie(movie)}>
                  Add
                </button>
              </li>
            ))}
          </ul>
        </div>
      
      )}
    </div>
  );
}
