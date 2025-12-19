</div>

{/* Recommendations Section - MOVED TO TOP */}
{showRecommendations && recommendations.length > 0 && (
  <div className="recommendations-section">
    <div className="recommendations-divider">
      <span>Recommended for You</span>
    </div>
    {basedOnMovies.length > 0 && (
      <p className="based-on-text">
        Based on: {basedOnMovies.map(m => m.title).join(", ")}
      </p>
    )}
    
    {isLoading ? (
      <div className="loading-message">
        <p>Finding your perfect movies...</p>
      </div>
    ) : (
      <div className="movie-grid">
        {recommendations.map((movie, index) => (
          <div
            className="movie-item"
            key={index}
            onMouseEnter={() => handleMouseEnter(`rec-${index}`)}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className={`card movie-card recommendation-card ${
                hoveredMovieId === `rec-${index}` ? "hovered" : ""
              }`}
            >
              <img
                src={movie.image_url || "https://via.placeholder.com/200x300"}
                className="card-img-top"
                alt={movie.title}
              />
              <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                <p className="recommendation-explanation">{movie.explanation}</p>
                <div className="hover-icons">
                  <button
                    className="icon-button circle-button"
                    onClick={() => props.onShowMovie(movie)}
                  >
                    <span className="icon">i</span>
                    <span className="tooltip-text-info">More Info</span>
                  </button>
                  <button
                    className="icon-button circle-button add-to-watchlist-button"
                    onClick={() => handleAddToWatchlist(movie)}
                  >
                    <span className="icon">+</span>
                    <span className="tooltip-text-add">Add to Watchlist</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}

{/* Movies List */}
<div className="movie-grid">
  {filteredMovies.length > 0 ? (
    filteredMovies.map((favoriteMovie) => {
      const movie = favoriteMovie.movie;
      const isSelected = selectedMovies.includes(favoriteMovie.id);
      
      return (
        <div
          className="movie-item"
          key={favoriteMovie.id}
          onMouseEnter={() => handleMouseEnter(favoriteMovie.id)}
          onMouseLeave={handleMouseLeave}
          onClick={() => isSelectionMode && toggleMovieSelection(favoriteMovie.id)}
          style={{ cursor: isSelectionMode ? 'pointer' : 'default' }}
        >
          <div
            className={`card movie-card ${
              hoveredMovieId === favoriteMovie.id ? "hovered" : ""
            } ${isSelected ? "selected" : ""}`}
          >
            {/* Selection Checkmark */}
            {isSelectionMode && (
              <div className={`selection-checkmark ${isSelected ? 'checked' : ''}`}>
                {isSelected ? '✓' : ''}
              </div>
            )}
            
            <img
              src={movie.image_url}
              className="card-img-top"
              alt={movie.title}
            />
            <div className="card-body">
              <h5 className="card-title">{movie.title}</h5>
              {!isSelectionMode && (
                <div className="hover-icons">
                  <button
                    className="icon-button circle-button"
                    onClick={() => props.onShowMovie(movie)}
                  >
                    <span className="icon">i</span>
                    <span className="tooltip-text-info">More Info</span>
                  </button>
                  <button
                    className="icon-button circle-button"
                    onClick={() => props.onDestroyFavoriteMovie(favoriteMovie)}
                  >
                    <DeleteIcon className="icon" />
                    <span className="tooltip-text-remove">Remove</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    })
  ) : (
    <div className="no-results">
      <p>No Results Found. Please reset filters to expand the search.</p>
    </div>
  )}
</div>