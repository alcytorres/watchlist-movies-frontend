import "./FavoriteMoviesIndex.css";

export function FavoriteMoviesIndex(props) {
  console.log(props.favoriteMovies);
  return (
    <div>
      <br />
      <h1>Favorite Movies</h1>
      <div className="row">
        {props.favoriteMovies.map((favoriteMovie) => {
          const movie = favoriteMovie.movie;
          return (
            <div className="col-sm-4 mb-3" key={favoriteMovie.id}>
              <div className="card favorite-movie-card">
                <img src={movie.image_url} className="card-img-top" alt={movie.title} />
                <div className="card-body">
                  <h5 className="card-title">{movie.title}</h5>
                  <p className="card-text">Description: {movie.description}</p>
                  {/* Additional movie details if needed */}
                  <button className="btn btn-primary" onClick={() => props.onShowMovie(movie)}>
                    More info
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => props.onDestroyFavoriteMovie(favoriteMovie)} // NEW: Pass the entire favoriteMovie object
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
