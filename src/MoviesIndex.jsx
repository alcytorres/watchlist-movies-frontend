export function MoviesIndex(props) {  //movies
  return (
    <div>
      <h1>All movies</h1>
      {props.movies.map((movie) => (
        <div key={movie.id}>
          <h2>{movie.name}</h2>
          <img src={movie.image_url} />
          <p>description: {movie.description}</p>
          <p>director: {movie.director}</p>
          <p>release year: {movie.release_year}</p>
          <button onClick={() => props.onShowMovie(movie)}>More info</button>
          <button onClick={() => props.onAddFavorite(movie)}>Add to Favorites</button>
        </div>
      ))}
    </div>
  );
}
