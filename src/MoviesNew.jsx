// NEW: Add state to handle movie search and streaming sources
import { useState } from "react";
import axios from "axios";

export function MoviesNew(props) {
  const [searchResults, setSearchResults] = useState(null); // NEW: Store search results
  const [streamingSources, setStreamingSources] = useState([]); // NEW: Store streaming sources

  // NEW: Handle movie search
  const handleSearch = (event) => {
    event.preventDefault();
    const query = event.target.query.value;

    // NEW: Send request to search TMDb and Watchmode APIs via backend
    axios
      .get(`http://localhost:3000/search_tmdb?query=${encodeURIComponent(query)}`)
      .then((response) => {
        setSearchResults(response.data.movie);
        setStreamingSources(response.data.streaming_sources);
      })
      .catch((error) => {
        console.error("Error searching for the movie", error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const params = new FormData(event.target);
    props.onCreateMovie(params, () => event.target.reset());
  };

  return (
    <div>
      <h1>Search and Add a New Movie</h1>
      
      {/* NEW: Movie search form */}
      <form onSubmit={handleSearch}>
        <div>
          Search by Title: <input name="query" type="text" />
        </div>
        <button type="submit">Search</button>
      </form>

      {/* NEW: Display search results if found */}
      {searchResults && (
        <div>
          <h2>Search Results:</h2>
          <p>Name: {searchResults.name}</p>
          <p>Description: {searchResults.description}</p>
          <p>Director: {searchResults.director}</p>
          <p>Release Year: {searchResults.release_year}</p>
          <img src={searchResults.image_url} alt={searchResults.name} />
          <h3>Streaming Availability (US):</h3>
          <ul>
            {streamingSources.map((source) => (
              <li key={source.source_id}>
                {source.name}: <a href={source.web_url} target="_blank" rel="noopener noreferrer">Watch Here</a> ({source.type})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* OLD: Add movie form (if needed) */}
      <form onSubmit={handleSubmit}>
        <div>
          Name: <input name="name" type="text" />
        </div>
        <div>
          Url: <input name="image_url" type="text" />
        </div>
        <div>
          Description: <input name="description" type="text" />
        </div>
        <div>
          Director: <input name="director" type="text" />
        </div>
        <div>
          Release year: <input name="release_year" type="text" />
        </div>
        <button type="submit">Create movie</button>
      </form>
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
