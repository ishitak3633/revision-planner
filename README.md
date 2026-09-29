# Revision Study Planner

A beginner-friendly MERN app for organizing revision tasks by course, topic, priority, and estimated study time.

## What it does

- Creates revision tasks and stores them in MongoDB.
- Shows pending and completed tasks separately.
- Lets you mark a task complete or return it to pending.
- Keeps tasks and completion status after a page refresh.

## Requirements

- Node.js 20.19+ (or 22.12+) and npm.
- A MongoDB Atlas cluster, database user, and connection URI.

## Set up the environment

The backend reads `PORT` and `MONGODB_URI` from `server/.env`. The client can optionally read `VITE_API_BASE_URL` from `client/.env`; if it is not set, it uses `http://localhost:5000/api`.

For a new setup, create the local files in PowerShell from the project root. These commands leave any existing `.env` files untouched:

```powershell
if (-not (Test-Path server/.env)) { Copy-Item server/.env.example server/.env }
if (-not (Test-Path client/.env)) { Copy-Item client/.env.example client/.env }
```

Edit `server/.env` and replace the placeholder with your MongoDB Atlas connection URI. Include the database name in the URI path. If your database password contains reserved URL characters, URL-encode them before using the URI. Do not put quotes around the values.

Never share or commit `server/.env` or `client/.env`. The example files contain placeholders only, and `.env` files are ignored by Git.

## Install dependencies

Run these commands from the project root:

```powershell
npm install --prefix server
npm install --prefix client
```

## Start the application

Open two terminals in the project root. Start the backend in the first terminal:

```powershell
npm start --prefix server
```

Wait for the `MongoDB connected.` message. The API then listens on port 5000. If the database connection fails, the server does not start listening.

Start the React development server in the second terminal:

```powershell
npm run dev --prefix client
```

Open the local URL printed by Vite, usually `http://localhost:5173/`.

## Try it

1. Add a course, topic, priority, and positive whole-number duration.
2. Confirm the task appears under Pending.
3. Check its box to move it to Completed, or uncheck it to return it to Pending.
4. Refresh the page to confirm the task and status are still saved.

## How requests work

The React app uses `client/src/services/taskService.js` to send requests to the Express API. The server validates each request and uses Mongoose to read or save tasks in MongoDB.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/tasks` | List tasks |
| `POST` | `/api/tasks` | Create a task |
| `PATCH` | `/api/tasks/:id` | Change its completion status |

## Project layout

```text
revision-study-planner/
├── client/
│   └── src/
│       ├── components/  # Form and task display components
│       ├── services/    # Requests from React to the API
│       ├── App.jsx      # Page state and layout
│       └── index.css    # Responsive styles
├── server/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Task validation and database operations
│   ├── models/          # Mongoose task schema
│   ├── routes/          # API endpoints
│   └── server.js        # Express startup
├── README.md
└── revision-study-planner-architecture.md
```

Authentication, reminders, calendar views, task editing, and task deletion are outside the scope of this first version.