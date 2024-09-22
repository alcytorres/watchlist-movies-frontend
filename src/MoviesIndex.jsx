import React, { useState } from "react";
import { Range } from "react-range";
import "./MoviesIndex.css";

const MIN_YEAR = 1900;
const MAX_YEAR = new Date().getFullYear(); // Ensure this captures the current year dynamically

// Streaming service icons or names array
const streamingServices = [
  { id: 'max', name: 'Max', icon: '/icons/max.svg' },
  { id: 'netflix', name: 'Netflix', icon: '/icons/netflix.svg' },
  { id: 'amazon', name: 'Amazon Prime Video', icon: '/icons/amazon.svg' },
  { id: 'disney', name: 'Disney+', icon: '/icons/disney.svg' },
  { id: 'apple', name: 'Apple TV+', icon: '/icons/apple.svg' },
  { id: 'paramount', name: 'Paramount+', icon: '/icons/paramount.svg' },
  { id: 'hulu', name: 'Hulu', icon: '/icons/hulu.svg' }
];

export function MoviesIndex(props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedYears, setSelectedYears] = useState([MIN_YEAR, MAX_YEAR]);

  // Fix: Use 'streamingServices' instead of 'streamingServicesList'
  const [selectedStreamingServices, setSelectedStreamingServices] = useState(
    streamingServices.map((service) => service.id)
  );

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleYearChange = (values) => {
    setSelectedYears(values);
  };

  // Fix: Use 'streamingServices' instead of 'streamingServicesList'
  const toggleStreamingService = (id) => {
    if (selectedStreamingServices.includes(id)) {
      // Deselect if already selected
      setSelectedStreamingServices(
        selectedStreamingServices.filter((service) => service !== id)
      );
    } else {
      // Select it and move it to the front
      setSelectedStreamingServices([id, ...selectedStreamingServices]);
    }
  };

  // Fix: Use 'streamingServices' instead of 'streamingServicesList'
  const filteredMovies = props.movies.filter((movie) => {
    const movieStreamingServices = movie.streaming_services || []; // Ensure it's an array

    const yearFilter =
      movie.release_year >= selectedYears[0] && movie.release_year <= selectedYears[1];

    const streamingFilter =
      selectedStreamingServices.length === streamingServices.length || // If all services are selected, show all
      movieStreamingServices.length === 0 || // If the movie has no services, show it by default
      movieStreamingServices.some((service) => selectedStreamingServices.includes(service));

    return yearFilter && streamingFilter;
  });

  return (
    <div>
      <br />
      <h1>All Movies</h1>

      {/* Streaming service filter */}
      <div className="filter-section">
        <div className="streaming-services-filter">
          {streamingServices.map((service) => (
            <button
              key={service.id}
              className={`service-icon ${selectedStreamingServices.includes(service.id) ? "selected" : ""}`}
              onClick={() => toggleStreamingService(service.id)}
            >
              <img src={service.icon} alt={service.name} />
            </button>
          ))}
        </div>

        <button className="filter-button" onClick={toggleDropdown}>
          Release Year ▼
        </button>

        {isDropdownOpen && (
          <div className="filter-dropdown">
            <div className="header-row">
              <h4>Release Year</h4>
              <button className="reset-button" onClick={() => setSelectedYears([MIN_YEAR, MAX_YEAR])}>
                RESET
              </button>
            </div>
            <div className="year-labels">
              <span>1990</span>
              <Range
                step={1}
                min={MIN_YEAR}
                max={MAX_YEAR}
                values={selectedYears}
                onChange={handleYearChange}
                renderTrack={({ props, children }) => (
                  <div {...props} className="slider-track" style={props.style}>
                    {children}
                  </div>
                )}
                renderThumb={({ props, index }) => (
                  <div {...props} className="slider-thumb">
                    {selectedYears[index]}
                  </div>
                )}
              />
              <span>{MAX_YEAR}</span>
            </div>
          </div>
        )}
      </div>

      {/* Movie List */}
      <div className="row">
        {filteredMovies.map((movie) => (
          <div className="col-sm-4 mb-3" key={movie.id}>
            <div className="card movie-card">
              <img src={movie.image_url} className="card-img-top" alt={movie.name} />
              <div className="card-body">
                <h5 className="card-title">{movie.name}</h5>
                <p className="card-text">{movie.description}</p>
                <button className="btn btn-primary" onClick={() => props.onAddFavorite(movie)}>
                  Add to Favorites
                </button>
                <button className="btn btn-secondary" onClick={() => props.onShowMovie(movie)}>
                  More info
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}













// export function MoviesIndex(props) {  //movies
//   return (
//     <div>
//       < br />  
//       <h1>All Movies</h1>
//       <div className="row">
//         {props.movies.map((movie) => (
//           <div className="col-sm-4 mb-3" key={movie.id}>
//             <div className="card movie-card">
//               <img src={movie.image_url} className="card-img-top" alt={movie.name} />
//               <div className="card-body">
//                 <h5 className="card-title">{movie.name}</h5>
//                 <p className="card-text"> {movie.description}</p>
//                 {/* <p className="card-text">Director: {movie.director}</p>
//                 <p className="card-text">Release Year: {movie.release_year}</p> */}
//                 <button className="btn btn-primary" onClick={() => props.onAddFavorite(movie)}>Add to Favorites</button>
//                 <button className="btn btn-secondary" onClick={() => props.onShowMovie(movie)}>More info</button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }




