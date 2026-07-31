# Watchlist Movies App

A full-stack movie app to search films, see where to stream them, build a watchlist and favorites, and get AI-powered recommendations.

![App demo](demo.gif)

## What It Does
Search the TMDb catalog and view details like streaming availability. Save movies to your watchlist or favorites, then filter and sort them. Pick a few favorite movies, and the app uses OpenAI to recommend similar films and explain why they're a good match.

## Tech Stack
- **Frontend:** React, React Router, Axios, Bootstrap
- **Backend:** Ruby on Rails, PostgreSQL, JWT
- **APIs:** TMDb (movie/streaming data), OpenAI (recommendations)

## Features
- Secure sign up / log in (JWT)
- Movie search with details and streaming availability
- Add, view, and remove movies in watchlist and favorites
- Filter and sort by release year and streaming service
- AI recommendations from 2–6 selected favorites (falls back to TMDb if OpenAI is unavailable)

## Related Repo
This is the **React frontend**. The **Rails API backend** lives here: [watchlist-movies-api](https://github.com/alcytorres/watchlist-movies-api).
You need both running to use the app.

## Getting Started
Requires Node.js v22.2.0 and npm 10.7.0. Start the [API](https://github.com/alcytorres/watchlist-movies-api) first, then:

```bash
git clone https://github.com/alcytorres/watchlist-movies-frontend.git
cd watchlist-movies-frontend
npm install
npm run dev
```
