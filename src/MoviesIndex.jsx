import React, { useState } from "react";
import { Range } from "react-range";
import "./MoviesIndex.css";

const MIN_YEAR = 1900;
const MAX_YEAR = new Date().getFullYear(); // Ensure this captures the current year dynamically

export function MoviesIndex(props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedYears, setSelectedYears] = useState([MIN_YEAR, MAX_YEAR]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleYearChange = (values) => {
    setSelectedYears(values);
  };

  const filteredMovies = props.movies.filter(
    (movie) =>
      movie.release_year >= selectedYears[0] && movie.release_year <= selectedYears[1]
  );

  return (
    <div>
      <br />
      <h1>All Movies</h1>
      <div className="filter-section">
        <button className="filter-button" onClick={toggleDropdown}>
          Release Year ▼
        </button>
        {isDropdownOpen && (
          <div className="filter-dropdown">
            <div className="header-row"> {/* NEW: Header row for title and reset button */}
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
      <div className="row">
        {filteredMovies.map((movie) => (
          <div className="col-sm-4 mb-3" key={movie.id}>
            <div className="card movie-card">
              <img src={movie.image_url} className="card-img-top" alt={movie.name} />
              <div className="card-body">
                <h5 className="card-title">{movie.name}</h5>
                <p className="card-text">{movie.description}</p>
                <button className="btn btn-primary" onClick={() => props.onAddFavorite(movie)}>Add to Favorites</button>
                <button className="btn btn-secondary" onClick={() => props.onShowMovie(movie)}>More info</button>
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




