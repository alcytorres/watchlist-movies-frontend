export function MoviesIndex(props) {  //movies
  return (
    <div>
      < br />  
      <h1>All Movies</h1>
      <div className="row">
        {props.movies.map((movie) => (
          <div className="col-sm-4 mb-3" key={movie.id}>
            <div className="card">
              <img src={movie.image_url} className="card-img-top" alt={movie.name} />
              <div className="card-body">
                <h5 className="card-title">{movie.name}</h5>
                <p className="card-text">Description: {movie.description}</p>
                <p className="card-text">Director: {movie.director}</p>
                <p className="card-text">Release Year: {movie.release_year}</p>
                <button className="btn btn-primary" onClick={() => props.onShowMovie(movie)}>More info</button>
                <button className="btn btn-secondary" onClick={() => props.onAddFavorite(movie)}>Add to Favorites</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}




//     <div>
//       <h1>All movies</h1>
//       {props.movies.map((movie) => (
//         <div key={movie.id}>
//           <h2>{movie.name}</h2>
//           <img src={movie.image_url} />
//           <p>description: {movie.description}</p>
//           <p>director: {movie.director}</p>
//           <p>release year: {movie.release_year}</p>
//           <button onClick={() => props.onShowMovie(movie)}>More info</button>
//           <button onClick={() => props.onAddFavorite(movie)}>Add to Favorites</button>
//         </div>
//       ))}
//     </div>
//   );
// }
