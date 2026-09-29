# Revision Study Planner — MERN Stack Architecture

## 1. Project overview

Build a beginner-friendly web application that helps students plan and track revision tasks.

### Core requirements
- Add a revision task
- Enter course name and topic name
- Select priority: High, Medium, or Low
- Enter estimated duration in minutes
- Mark a task as completed or pending
- View pending and completed tasks separately

## 2. Recommended technology stack

- **MongoDB** — store revision tasks
- **Express.js** — create backend API routes
- **React** — build the user interface
- **Node.js** — run the backend server
- **Mongoose** — define and validate MongoDB task documents
- **Vite** — create and run the React frontend during development

Keep the first version simple. Do not add authentication, reminders, calendar views, or advanced analytics yet.

## 3. High-level architecture

```text
Student
  |
  v
React frontend (Vite)
  |  HTTP requests (fetch)
  v
Express API running on Node.js
  |  Mongoose queries
  v
MongoDB database
```

### Responsibilities

**React frontend**
- Show a task form.
- Display pending and completed task lists.
- Send API requests to the backend.
- Show loading, success, empty, and error states.
- Update the interface after tasks are added or completed.

**Express/Node backend**
- Receive and validate requests.
- Provide routes for creating, listing, and updating tasks.
- Return JSON responses and appropriate HTTP status codes.
- Handle errors without crashing the server.

**MongoDB**
- Persist task records so they remain after refreshing the page.

## 4. Suggested folder structure

```text
revision-study-planner/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskList.jsx
│   │   │   └── TaskItem.jsx
│   │   ├── services/
│   │   │   └── taskService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   └── package.json
├── server/
│   ├── models/
│   │   └── Task.js
│   ├── routes/
│   │   └── taskRoutes.js
│   ├── controllers/
│   │   └── taskController.js
│   ├── config/
│   │   └── db.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

For a first project, keep the code in these few files. Avoid adding extra layers until they are needed.

## 5. Task data model

Each task is one MongoDB document.

```js
{
  courseName: "Mathematics 1",
  topicName: "Limits",
  priority: "High",
  duration: 45,
  isCompleted: false,
  createdAt: "...",
  updatedAt: "..."
}
```

### Field definitions

| Field | Type | Rules |
|---|---|---|
| `courseName` | String | Required; trim whitespace |
| `topicName` | String | Required; trim whitespace |
| `priority` | String | Required; one of `High`, `Medium`, `Low` |
| `duration` | Number | Required; positive whole number in minutes |
| `isCompleted` | Boolean | Defaults to `false` |
| `createdAt` | Date | Automatically created |
| `updatedAt` | Date | Automatically updated |

Use Mongoose timestamps for `createdAt` and `updatedAt`. MongoDB/Mongoose supplies the unique `_id`.

Do not create separate collections for courses, topics, or priorities in the initial version.

## 6. API design

Use the base path `/api/tasks`.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/tasks` | Return all tasks |
| `POST` | `/api/tasks` | Validate and create a task |
| `PATCH` | `/api/tasks/:id` | Update task completion status |

Example create request:

```json
{
  "courseName": "Mathematics 1",
  "topicName": "Limits",
  "priority": "High",
  "duration": 45
}
```

Example completion update:

```json
{
  "isCompleted": true
}
```

The backend must validate request data. Return useful status codes, such as `201` for successful creation, `200` for successful reads/updates, `400` for invalid input, `404` for a missing task, and `500` for unexpected server errors.

## 7. Frontend behavior

### Task form
- Course name text input
- Topic name text input
- Priority dropdown
- Duration number input
- Add Task button

### Task display
- Separate **Pending** and **Completed** sections.
- Show course, topic, priority, and duration on each task.
- Provide a control to mark a task complete or return it to pending.
- Show a friendly empty state when a section has no tasks.
- Optionally show the total estimated duration of pending tasks.

### Data flow
1. On page load, React requests `GET /api/tasks`.
2. On form submission, React sends `POST /api/tasks`.
3. On completion toggle, React sends `PATCH /api/tasks/:id`.
4. After a successful response, update the displayed tasks.
5. Show an error message if a request fails.

## 8. Validation and edge cases

- Reject blank course or topic names.
- Trim leading and trailing whitespace.
- Reject duration values that are missing, zero, negative, fractional, or not numeric.
- Accept only the three defined priority values.
- Prevent malformed task IDs from crashing the backend.
- Handle duplicate topics without blocking them; students may revise a topic more than once.
- Display empty states for no tasks, no pending tasks, and no completed tasks.
- Show loading and error states when the server or database is unavailable.
- Preserve tasks after a browser refresh by loading them from MongoDB.
- Allow a completed task to be changed back to pending.

## 9. Suggested implementation milestones

1. Create the React frontend and build the static form and task layout using sample data.
2. Add React state to create tasks and toggle completion in the browser.
3. Create the Express server and implement the task API.
4. Add the Mongoose model and connect MongoDB using an environment variable.
5. Connect React to the API using a small service module.
6. Test validation, empty states, errors, and refresh persistence.
7. Polish the responsive layout and write setup instructions in `README.md`.

## 10. Environment and security notes

- Store the MongoDB connection string in `server/.env` as `MONGO_URI`.
- Store the backend port in `server/.env` as `PORT`.
- Store the API base URL in `client/.env` as `VITE_API_BASE_URL`.
- Provide `.env.example` files with placeholder values only.
- Add `.env` and `node_modules` to `.gitignore`.
- Never commit real credentials or connection strings.
- Configure Express CORS for the local frontend during development.

## 11. Out of scope for version 1

- User accounts and authentication
- Editing course/topic names after creation
- Deleting tasks
- Due dates and calendar
- Notifications or reminders
- Study streaks and charts
- Deployment

These can be added after the required features work reliably.
