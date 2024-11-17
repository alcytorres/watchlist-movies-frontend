// MoviesShow.jsx
import './MoviesShow.css'; // Importing the CSS file for styling

export function MoviesShow(props) {
  return (
    <div className="movie-modal"> {/* Apply modal container styling */}
      
      <div className="movie-details"> {/* Wrapping content in a styled container */}
        <p className="movie-title">Title: {props.movie.title}</p> 
        <p className="movie-description">Description: {props.movie.description}</p> 
        <p className="movie-director">Director: {props.movie.director}</p> 
        <p className="movie-release-year">Release Year: {props.movie.release_year}</p> 
        {/* <p className="movie-imdb-id">IMDb ID: {props.movie.imdb_id}</p>  */}

        {props.movie.image_url && (
          <img
            src={props.movie.image_url}
            alt={props.movie.title}
            className="movie-poster"
          />
        )}
      </div>

      {/* Display streaming services or 'Not currently available for streaming' */}
      {props.movie.streaming_services && props.movie.streaming_services.length > 0 ? (
        <p className="movie-availability">
          <strong>Available on:</strong>{" "}
          {props.movie.streaming_services.map((serviceId, index) => (
            <span key={index} className="movie-service">
              {serviceId.charAt(0).toUpperCase() + serviceId.slice(1)}
              {index < props.movie.streaming_services.length - 1 && ", "}
            </span>
          ))}
        </p>
      ) : (
        // Display message for non-streaming movies
        <p className="movie-availability"><strong>Not currently available for streaming</strong></p> 
      )}
    </div>
  );
}
