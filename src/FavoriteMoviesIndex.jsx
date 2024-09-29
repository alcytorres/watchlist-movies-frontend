import "./FavoriteMoviesIndex.css";

export function FavoriteMoviesIndex(props) {
console.log(props.favoriteMovies)  // What does this do?
  return (
    <div>
      < br />
      <h1>Favorite Movies</h1>
      <div className="row">
        {props.favoriteMovies.map((movie) => (
          <div className="col-sm-4 mb-3" key={movie.id}>
            <div className="card favorite-movie-card">
              <img src={movie.image_url} className="card-img-top" alt={movie.title} />
              <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                <p className="card-text">Description: {movie.description}</p>
                {/* <p className="card-text">Director: {movie.director}</p>
                <p className="card-text">Release Year: {movie.release_year}</p> */}
                <button className="btn btn-primary" onClick={() => props.onShowMovie(movie)}>More info</button>
                <button className="btn btn-danger" onClick={() => props.onDestroyFavoriteMovie(movie.favoritemovie_id)}>Remove</button>
              </div >
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



