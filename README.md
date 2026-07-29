# Watchlist Movies App

A full-stack movie app to search films, see where to stream them, build a watchlist and favorites, and get AI-powered recommendations.

![App demo](demo.gif)

## What It Does
Sign up, search the TMDb catalog, and view details like streaming availability. Save movies to a watchlist or favorites, then filter and sort them. The highlight: pick a few favorites and an OpenAI-powered engine returns personalized recommendations with short explanations — a Netflix-style discovery experience.

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
This is the **React frontend**. The **Rails API** lives here: [capstone-favorite-movies-api](https://github.com/alcytorres/capstone-favorite-movies-api).
You need both running to use the app.

## Getting Started
Requires Node.js v22.2.0 and npm 10.7.0. Start the [API](https://github.com/alcytorres/capstone-favorite-movies-api) first, then:

```bash
git clone https://github.com/alcytorres/capstone-favorite-movies-frontend.git
cd capstone-favorite-movies-frontend
npm install
npm run dev
```
