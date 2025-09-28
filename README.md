# Movie Recommendation Web App (MERN)

This is a small MERN app where users can sign up, rate movies, and get recommendations. I used Material UI for the UI and tried to keep it clean and simple. There is also an admin panel to manage movies and see analytics (only for admin).

## What it does
- Auth: signup with name, email, password. Sign in to use the app. The header shows your name (bigger font).
- Movies:
  - Search by title (case-insensitive). You can also filter by year/genre.
  - Rate 1–5 stars, update your rating, or delete it.
  - Each movie shows average rating and how many ratings it got.
- Recommendations:
  - Content-based: compares genres with your preferences.
  - Collaborative filtering: user-user cosine with weighted scores (no KNN yet on purpose).
- Admin:
  - Only admins can see analytics and manage movies (add, update, delete).
- Analytics:
  - Tiles (totals) and a pie chart for top genres.
- Posters:
  - Uses free OMDb API on the client to show posters by movie title/year.

## Tech Stack
- Server: Node.js, Express, MongoDB (Mongoose), JWT
- Client: React (Vite), Material UI, Recharts (for the pie chart)
- Tests (server): Jest, Supertest, mongodb-memory-server

## Project Structure
- server/ → API, models, routes, seed scripts, tests
- client/ → React app, MUI theme, pages, poster hook (OMDb)

## Env Variables
Server (server/.env)
- MONGO_URI=mongodb:your_mongo_url
- JWT_SECRET=some_long_secret
- JWT_EXPIRES=7d
- CORS_ORIGIN=http://localhost:5173
- PORT=4000

Client (client/.env)
- VITE_OMDB_API_KEY=your_omdb_key
- (optional) VITE_API_BASE=http://localhost:4000

## How to run (Windows)
1) Env files
- Copy server/.env.example to server/.env and set values.
- Create client/.env and add VITE_OMDB_API_KEY.

2) Install deps
- Open two terminals:
  - In server:
    - npm install
  - In client:
    - npm install

3) Start
- In server (http://localhost:4000):
  - npm run dev
- In client (http://localhost:5173):
  - npm run dev

## Make an admin user
Use mongosh and set role to admin for your email:
```js
use movie_mern
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

## API quick list
Auth
- POST /api/auth/signup { name, email, password }
- POST /api/auth/login { email, password }

Movies
- GET /api/movies?q=&year=&genre=&page=&limit=
- POST /api/movies (admin)
- PUT /api/movies/:id (admin)
- DELETE /api/movies/:id (admin)

Ratings
- POST /api/ratings { movieId, score }
- GET /api/ratings/me

Recommendations
- GET /api/recommendations/content
- GET /api/recommendations/cf

Analytics
- GET /api/metrics/overview (admin)

## Posters (OMDb) – how it works
- The client calls OMDb with title and optional year:
  - https://www.omdbapi.com/?apikey=YOUR_KEY&t=Title&y=Year
- If the response has Poster and it’s not “N/A”, the UI shows it.
- Set VITE_OMDB_API_KEY in client/.env and restart the client dev server.

## Notes
- KNN for CF is not added yet (will add later).
- UI uses a light theme with blue accents (MUI Theme).
- Search uses a simple case-insensitive match, so it works without special DB indexes.

## Troubleshooting (Vite on OneDrive)
If you get EPERM errors when starting the client:
- Close dev server.
- Try removing Vite’s cache folder:
  - PowerShell: Remove-Item -Recurse -Force .\client\node_modules\.vite
- Start again: cd client && npm run dev
- If it keeps happening, try moving the project outside OneDrive (like C:\dev).
