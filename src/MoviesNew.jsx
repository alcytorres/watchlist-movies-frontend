export function MoviesNew(props) {

  const handleSubmit = (event) => {
    event.preventDefault();
    const params = new FormData(event.target);
    props.onCreateMovie(params, () => event.target.reset());
  };
  
  return (
    <div>
      <h1>New Movie</h1>
      <form onSubmit={handleSubmit}>
        <div>
          Name: <input name="name" type="text" />
        </div>
        <div>
          Url: <input name="image_url" type="text" />
        </div>
        <div>
          Description: <input name="description" type="text" />
        </div>
        <div>
          Director: <input name="director" type="text" />
        </div>
        <div>
          Release year: <input name="release_year" type="text" />
        </div>
        <button type="submit">Create movie</button>
      </form>
    </div>
  );
}
