# README

# Watchlist Movies App

# Description
  The Watchlist Movies App enables users to sign up or log in, search for movies, access detailed information—including streaming availability—and manage their watchlist and favorites. By integrating with the TMDb (The Movie Database) API, the app provides up-to-date movie details and streaming options, ensuring users know where to watch.

  With a clean and user-friendly interface, the app helps movie enthusiasts track their favorite films, plan upcoming viewings, and discover new movies.

# Getting Started
  These instructions will get you a copy of the project up and running on your local machine.

# Prerequisites
  Before you begin, ensure you have met the following requirements:
    Backend
      - Ruby version: 3.2.2
      - Rails version: 7.1.3.4
      - PostgreSQL
      - TMDb API Key: Obtain an API key from TMDb: https://developer.themoviedb.org/docs/getting-started#:~:text=To%20register%20for%20an%20API,to%20our%20terms%20of%20use
    Frontend
      - Node.js version: v22.2.0
      - npm: 10.7.0

# Technologies Used
  Backend
    - Ruby on Rails
    - PostgreSQL
    - TMDb API (The Movie Database API)
    - Dotenv (for environment variables)

  Frontend
    - React
    - Axios
    - Bootstrap

# Backend Installation
  1. Clone the backend (Ruby on Rails) repository:
       git clone https://github.com/alcytorres/capstone-favorite-movies-api.git

  2. Navigate to the backend directory:
       cd capstone-favorite-movies-api

  3. Install dependencies:
       bundle install

  4. Set up the database:
       rails db:setup

  5. Obtain a TMDb API Key:
       Sign up at TMDb to obtain an API key.

  6. Configure the TMDb API Key:
       Create a .env file in the root directory of the backend project.
       Add your TMDb API key to the .env file:

       TMDB_API_KEY=your_tmdb_api_key_here

       Ensure the dotenv-rails gem is installed to load environment variables from .env.

# To start the Rails server:
  cd capstone-favorite-movies-api
    rails server

# Frontend Installation
  1. Clone the frontend (JavaScript using the React framework) repository:
       git clone https://github.com/alcytorres/capstone-favorite-movies-frontend.git

  2. Navigate to the frontend directory:
       cd capstone-favorite-movies-frontend

  3. Install dependencies:
       npm install

# To start the React development server:
    cd capstone-favorite-movies-frontend
      npm run dev

# Usage
  1. Create an account or log in.
  2. Use the search feature to find movies.
  3. Add movies to your watchlist or favorites.
  4. View detailed information about movies, including streaming availability.
  5. View and manage your list of favorite movies and watchlist.
  6. Remove movies from your favorites or watchlist.

# Key Features 
 -  User Authentication and Authorization: Secure user registration and login.
  - Search for Movies: Search for movies using the TMDb API.
  - Fetch Streaming Data: Retrieve streaming availability and other movie details from TMDb.
  - Add Movies to Watchlist and Favorites: Save movies to your favorites list or watchlist.
  - Manage Favorites and Watchlist: View and remove movies from your favorites and watchlist.
  - View Movie Details: Access detailed information about movies, including synopsis, director, release_year, and the poster.

# Additional Configuration
  - Environment Variables: Ensure that sensitive information such as API keys are stored in environment variables and not committed to version control.
  
  - CORS Configuration: Configure Cross-Origin Resource Sharing (CORS) in your Rails backend to allow requests from your frontend if necessary.

