export function MoviesShow(props) {
  return (
    <div>
      <h1>Movie information</h1>
      <p>Name: {props.movie.name}</p>
      {/* <p>Url: {props.movie.image_url}</p> */}
      <p>Description: {props.movie.description}</p>
      <p>Director: {props.movie.director}</p>
      <p>Release Year: {props.movie.release_year}</p>

      {/* NEW: Display streaming availability in the US */}
      {props.streamingSources && props.streamingSources.length > 0 && (
        <p>
          <strong>Streaming:</strong>{" "}
          {props.streamingSources.map((source, index) => (
            <span key={source.source_id}>
              {source.name}
              {index < props.streamingSources.length - 1 && ", "}
            </span>
          ))}
        </p>
      )}

    </div>
  );
}
