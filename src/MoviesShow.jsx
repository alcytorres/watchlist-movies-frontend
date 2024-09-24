export function MoviesShow(props) {
  return (
    <div>
      <h1>Movie Information</h1>
      <p>Name: {props.movie.name}</p>
      <p>Description: {props.movie.description}</p>
      <p>Director: {props.movie.director}</p>
      <p>Release Year: {props.movie.release_year}</p>
      <p>IMDb ID: {props.movie.imdb_id}</p>

      {/* NEW: Display streaming services directly from movie prop */}
      {props.movie.streaming_services && props.movie.streaming_services.length > 0 && (
        <p>
          <strong>Available on:</strong>{" "}
          {props.movie.streaming_services.map((serviceId, index) => (
            <span key={index}>
              {serviceId.charAt(0).toUpperCase() + serviceId.slice(1)}
              {index < props.movie.streaming_services.length - 1 && ", "}
            </span>
          ))}
        </p>
      )}

      {props.movie.image_url && (
        <img src={props.movie.image_url} alt={props.movie.name} width="200" />
      )}
    </div>
  );
}
