# README

# Watchlist Movies App

# Description
  A full-stack movie discovery and tracking app that lets users sign up, search for movies, view detailed information (including where to stream), and curate personal watchlists and favorites.

  Built with Ruby on Rails as a API backend and React for a responsive frontend, the app integrates the TMDb API to provide real-time movie data and streaming availability.

  The highlight is an AI-powered recommendation engine powered by OpenAI. By analyzing a user's selected favorites, it generates personalized movie suggestions complete with thoughtful explanations bringing an intelligent, Netflix like discovery experience to the app.

  With a clean, intuitive interface, users can easily organize films they love, plan what to watch next, and discover new titles tailored to their preferences.

# Getting Started
  These instructions will get you a copy of the project up and running on your local machine.

# Prerequisites
  Before you begin, ensure you have met the following requirements:
    Backend
      - Ruby version: 3.2.2
      - Rails version: 7.1.3.4
      - PostgreSQL
      - TMDb API Key: Obtain an API key from TMDb: https://developer.themoviedb.org/docs/getting-started#:~:text=To%20register%20for%20an%20API,to%20our%20terms%20of%20use
      - OpenAI API Key: Obtain an API key from OpenAI: https://platform.openai.com/api-keys (Required for movie recommendations)
    Frontend
      - Node.js version: v22.2.0
      - npm: 10.7.0

# Technologies Used
  Backend
    - Ruby on Rails
    - PostgreSQL
    - TMDb API (The Movie Database API)
    - OpenAI API (for AI-powered movie recommendations)
    - Dotenv (for environment variables)
    - JWT (for authentication)

  Frontend
    - React
    - Axios
    - Bootstrap
    - React Router

# Backend Installation
  1. Clone the backend (Ruby on Rails) repository:
       git clone https://github.com/alcytorres/capstone-favorite-movies-api.git

  2. Navigate to the backend directory:
       cd capstone-favorite-movies-api

  3. Install dependencies:
       bundle install

  4. Set up the database:
       rails db:setup

  5. Obtain API Keys:
       - TMDb API Key: Sign up at TMDb to obtain an API key.
       - OpenAI API Key: Sign up at OpenAI to obtain an API key for movie recommendations.

  6. Configure API Keys:
       Create a .env file in the root directory of the backend project.
       Add your API keys to the .env file:

       TMDB_API_KEY=your_tmdb_api_key_here
       OPENAI_API_KEY=your_openai_api_key_here

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
  6. Get AI-powered recommendations: Select 2-6 favorite movies and receive personalized movie recommendations with explanations.
  7. Remove movies from your favorites or watchlist.

# Key Features 
  - User Authentication and Authorization: Secure user registration and login using JWT.
  - Search for Movies: Search for movies using the TMDb API.
  - Fetch Streaming Data: Retrieve streaming availability and other movie details from TMDb.
  - AI-Powered Movie Recommendations: Get personalized movie recommendations based on your favorite movies using OpenAI's API. The system analyzes your preferences and suggests similar movies with personalized explanations.
  - Add Movies to Watchlist and Favorites: Save movies to your favorites list or watchlist.
  - Manage Favorites and Watchlist: View and remove movies from your favorites and watchlist.
  - View Movie Details: Access detailed information about movies, including synopsis, director, release year, and the poster.
  - Filter Movies: Filter favorites and watchlist by release year and streaming service.

# Additional Configuration
  - Environment Variables: Ensure that sensitive information such as API keys (TMDb and OpenAI) are stored in environment variables and not committed to version control.
  
  - CORS Configuration: Configure Cross-Origin Resource Sharing (CORS) in your Rails backend to allow requests from your frontend.

  - OpenAI API: The app uses OpenAI's GPT-3.5-turbo model for generating personalized movie recommendations. If OpenAI API is unavailable or rate-limited, the system automatically falls back to TMDb's recommendation algorithm.