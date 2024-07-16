  export function FavoriteMoviesNew(props) {

    const handleSubmit = (event) => {
      event.preventDefault();
      const params = new FormData(event.target);
      props.onCreateFavoriteMovie(params, () => event.target.reset());
    };
  
  return (
    <div>
      <h1>New Favorite Movie</h1>
      <form onSubmit={handleSubmit}>
        <div>
          User id: <input name="user_id" type="text" />
        </div>
        <div>
          Movie id: <input name="movie_id" type="text" />
        </div>
        <button type="submit">Add a favorite movie</button>
      </form>
    </div>
  );
}
