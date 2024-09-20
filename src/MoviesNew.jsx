// NEW: Add state to handle movie search and streaming sources
import { useState } from "react";
import axios from "axios";

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
      imdb_id: movie.imdb_id, // NEW: Include imdb_id
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
      <h1>Search and Add a New Movie</h1>

      {/* Movie search form */}
      <form onSubmit={handleSearch}>
        <div>
          Search by Title: <input name="query" type="text" />
        </div>
        <button type="submit">Search</button>
      </form>

      {/* Display search results */}
      {searchResults.length > 0 && (
        <div>
          <h2>Search Results:</h2>
          <ul>
            {searchResults.map((movie) => (
              <li key={movie.tmdb_id}>
                <p>{movie.name}</p>
                <p>Release Year: {movie.release_year}</p>
                <p>Director: {movie.director}</p>
                {/* NEW: Display image if available */}
                {movie.image_url && <img src={movie.image_url} alt={movie.name} width="100" />}
                {/* NEW: Display streaming sources if available */}
                {movie.streaming_sources && movie.streaming_sources.length > 0 ? (
                  <div>
                    <p>Available on:</p>
                    <ul>
                      {movie.streaming_sources.map((source, index) => (
                        <li key={index}>{source.name}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>No streaming sources available</p>
                )}
                <button onClick={() => handleAddMovie(movie)}>Add</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}







// export function MoviesNew(props) {

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const params = new FormData(event.target);
//     props.onCreateMovie(params, () => event.target.reset());
//   };
  
  
//   return (
//     <div>
//       <h1>New Movie</h1>
//       <form onSubmit={handleSubmit}>
//         <div>
//           Name: <input name="name" type="text" />
//         </div>
//         <div>
//           Url: <input name="image_url" type="text" />
//         </div>
//         <div>
//           Description: <input name="description" type="text" />
//         </div>
//         <div>
//           Director: <input name="director" type="text" />
//         </div>
//         <div>
//           Release year: <input name="release_year" type="text" />
//         </div>
//         <button type="submit">Create movie</button>
//       </form>
//     </div>
//   );
// }
