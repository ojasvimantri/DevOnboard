# 🧭 Onboarding Guide: TaskFlow API

> A production-ready RESTful task management API that provides JWT authentication, team collaboration, task assignment, and real-time notifications — built for teams who need a reliable backend to power task-tracking applications.

**Generated:** 2025-07-15  
**Analyzed by:** IBM Bob (DevOnboard)  

---

## 1. 📋 Project Overview

TaskFlow API is a Node.js/Express backend that exposes a JSON REST API for managing tasks, users, and teams. It handles user registration and login using JSON Web Tokens (with short-lived access tokens and Redis-backed refresh tokens), full task CRUD with filtering by status, priority, and team, and real-time push notifications via Socket.io when tasks change. The codebase is structured as a classic MVC monolith — a single deployable service well-suited for small-to-medium teams. It is intended to back a frontend client (e.g. a React/Vue SPA) and ships with rate limiting, structured logging, and a global error handler ready for production use.

---

## 2. 🛠️ Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Language | JavaScript (CommonJS) | ES2020+ |
| Runtime | Node.js | ≥ 18.0.0 |
| Framework | Express | 4.x |
| Database | PostgreSQL | 15+ |
| ORM / Query | Knex.js | 3.x |
| Cache / Sessions | Redis | 7.x |
| Real-time | Socket.io | 4.x |
| Testing | Jest + Supertest | 29.x / 6.x |
| Build tool | none (plain Node.js) | — |
| Linting | ESLint | 8.x |
| Formatting | Prettier | 3.x |
| Containerisation | none (manual install) | — |

---

## 3. 🚀 How to Run the Project

### Prerequisites

- Node.js ≥ 18.0.0 (LTS recommended)
- npm ≥ 9
- PostgreSQL 15+ running locally or via a cloud service
- Redis 7+ running locally or via a cloud service

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-org/taskflow-api.git
cd taskflow-api

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env — at minimum fill in DATABASE_URL, REDIS_URL, JWT_SECRET, JWT_REFRESH_SECRET

# 4. Run database migrations (creates all tables)
npm run migrate

# 5. (Optional) Seed the database with demo data
npm run seed

# 6. Start the development server (hot reload via nodemon)
npm run dev
```

The API will be available at: `http://localhost:3000`  
Health check: `GET http://localhost:3000/health`

---

## 4. 📁 Important Files & Folders

| Path | Purpose |
|---|---|
| `src/index.js` | Entry point — initializes DB, Redis, Socket.io, then starts the HTTP server |
| `src/app.js` | Express app factory — registers all middleware and mounts route groups |
| `src/routes/` | Route definitions (thin — delegate immediately to controllers) |
| `src/controllers/` | Business logic for each resource (auth, tasks, teams, users) |
| `src/models/` | Database query functions using Knex.js (one file per entity) |
| `src/middleware/` | Cross-cutting concerns: JWT auth, role authorization, input validation, error handling |
| `src/config/` | Infrastructure init: database connection, Redis client, Socket.io server, Winston logger |
| `.env.example` | Template for all required and optional environment variables |
| `package.json` | npm scripts, runtime and dev dependencies, Jest config |

---

## 5. 🏗️ Architecture Explanation

TaskFlow follows a **layered MVC architecture** within a single `src/` tree. Routes are kept deliberately thin — they only declare HTTP method, path, validation chain, and controller function. All business logic lives in controllers, which call model functions for data access. Models are plain objects that wrap Knex.js query builder calls and return raw rows. Cross-cutting concerns (auth, validation, errors) are handled as Express middleware registered globally in `app.js` or locally per-route.

### Request Flow

```
HTTP Request
  → Express (app.js) — helmet, cors, morgan, rate-limit
    → Route file (routes/*.js) — express-validator chain → validate middleware
      → authenticate middleware (JWT verification, attaches req.user)
        → authorize middleware (role check, attaches req.membership) [team routes only]
          → Controller (controllers/*.js) — business logic
            → Model (models/*.js) — Knex.js query to PostgreSQL
              → Socket.io emitToTeam() [on mutating task/team operations]
                → JSON Response
```

### Key Patterns
- **Token pair auth:** Short-lived JWT access tokens (15 min) + long-lived refresh tokens stored in Redis under `refresh:{userId}` keys, allowing token revocation on logout.
- **Middleware-first validation:** All input validation runs via `express-validator` chains declared in the route file before the controller is ever reached, keeping controllers clean.
- **Operational errors:** The `errorHandler` middleware distinguishes known PostgreSQL error codes (e.g. `23505` unique constraint) from unexpected errors, returning user-friendly messages without leaking stack traces in production.
- **Real-time scoping:** Socket.io rooms are scoped by team ID (`team:{teamId}`), so `emitToTeam()` in `src/config/socket.js` broadcasts only to members of the relevant team.

---

## 6. 📦 Dependencies

### Runtime Dependencies

| Package | Purpose |
|---|---|
| `express` | HTTP server framework — routing, middleware pipeline |
| `knex` | SQL query builder — all database queries across models |
| `pg` | PostgreSQL driver (used by Knex internally) |
| `redis` | Redis client — stores refresh tokens, backs rate-limit counters |
| `socket.io` | WebSocket server — real-time task/team event broadcasting |
| `jsonwebtoken` | Signs and verifies JWT access and refresh tokens |
| `bcryptjs` | Hashes and compares user passwords (12 salt rounds) |
| `express-validator` | Declarative request validation chains in route files |
| `express-rate-limit` | Per-IP global rate limiting (configurable via env) |
| `helmet` | Sets secure HTTP response headers automatically |
| `cors` | Handles CORS preflight and allowed-origin enforcement |
| `morgan` | HTTP request logging in `combined` format |
| `winston` | Structured application logging (JSON in prod, pretty in dev) |
| `dotenv` | Loads `.env` file into `process.env` at startup |
| `uuid` | Generates UUIDs (v4) for new resource IDs |

### Dev Dependencies

| Package | Purpose |
|---|---|
| `jest` | Test runner (configured with 70% line coverage threshold) |
| `supertest` | HTTP assertion library for integration testing Express apps |
| `nodemon` | File watcher that restarts the server on source changes (`npm run dev`) |
| `eslint` | JavaScript linter (`npm run lint`) |
| `prettier` | Code formatter (`npm run format`) |

---

## 7. ⚙️ Configuration & Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | ✅ Yes | — | PostgreSQL connection string, e.g. `postgresql://user:pass@localhost:5432/taskflow_dev` |
| `REDIS_URL` | ✅ Yes | — | Redis connection string, e.g. `redis://localhost:6379` |
| `JWT_SECRET` | ✅ Yes | — | Secret key for signing access tokens — generate with `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `JWT_REFRESH_SECRET` | ✅ Yes | — | Separate secret for signing refresh tokens — generate the same way |
| `NODE_ENV` | ⚠️ Optional | `development` | `production` enables JSON logging and file log transports |
| `PORT` | ⚠️ Optional | `3000` | TCP port the server listens on |
| `HOST` | ⚠️ Optional | `localhost` | Bind address |
| `CORS_ORIGIN` | ⚠️ Optional | `*` | Allowed origin for CORS, e.g. `http://localhost:5173` |
| `LOG_LEVEL` | ⚠️ Optional | `info` | Winston log level (`debug`, `info`, `warn`, `error`) |
| `JWT_ACCESS_EXPIRES_IN` | ⚠️ Optional | `15m` | Access token expiry duration |
| `JWT_REFRESH_EXPIRES_IN` | ⚠️ Optional | `7d` | Refresh token expiry duration |
| `DB_POOL_MIN` | ⚠️ Optional | `2` | Minimum Knex connection pool size |
| `DB_POOL_MAX` | ⚠️ Optional | `10` | Maximum Knex connection pool size |
| `REDIS_TTL_SECONDS` | ⚠️ Optional | `604800` (7d) | TTL for refresh tokens stored in Redis |
| `RATE_LIMIT_WINDOW_MS` | ⚠️ Optional | `900000` (15min) | Rate limit sliding window in milliseconds |
| `RATE_LIMIT_MAX_REQUESTS` | ⚠️ Optional | `100` | Maximum requests per window per IP |
| `SOCKET_IO_PING_TIMEOUT` | ⚠️ Optional | `5000` | Socket.io ping timeout (ms) |
| `SOCKET_IO_PING_INTERVAL` | ⚠️ Optional | `10000` | Socket.io ping interval (ms) |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | ⚠️ Optional | — | SMTP credentials for team invitation emails |

> **Note:** `JWT_SECRET` and `JWT_REFRESH_SECRET` must never be shared or committed. Generate fresh random values for every environment.

---

## 8. 🖥️ Common Development Commands

```bash
# Start development server (hot reload via nodemon)
npm run dev

# Start production server
npm start

# Run all tests
npm test

# Run tests with coverage report (threshold: 70% lines)
npm run test:coverage

# Lint the codebase
npm run lint

# Auto-fix lint errors
npm run lint:fix

# Format all source files with Prettier
npm run format

# Run database migrations (creates/updates tables)
npm run migrate

# Seed the database with demo data
npm run seed
```

---

## 9. 📚 Recommended Learning Order

Read the codebase in this order to build understanding progressively:

1. **`README.md`** — Start here: project purpose, API surface, and setup overview
2. **`package.json`** — Understand available scripts, all dependencies, and Jest config
3. **`.env.example`** — Learn every configuration knob before touching any code
4. **`src/index.js`** — See how the app bootstraps: DB, Redis, Socket.io, graceful shutdown
5. **`src/app.js`** — Understand the middleware pipeline and how routes are mounted
6. **`src/middleware/authenticate.js`** — The JWT verification pattern used by every protected route
7. **`src/routes/tasks.js`** — See the full validation chain + route-to-controller delegation pattern
8. **`src/controllers/tasksController.js`** — Business logic, ownership checks, and Socket.io emission
9. **`src/models/taskModel.js`** — How Knex.js queries are structured; filtering + pagination pattern
10. **`src/config/database.js`** — Knex initialization and connection pool configuration
11. **`src/middleware/errorHandler.js`** — How PostgreSQL error codes are translated to HTTP responses
12. **`src/config/socket.js`** — JWT auth for WebSocket connections and the team-room pattern

---

## 10. 🎯 Suggested First Task

**Task:** Add a `GET /api/tasks/:id/comments` endpoint that returns a paginated list of comments for a specific task.

**Why this task:**  
It follows the exact same layered pattern used by every other resource in the codebase — you will touch a route file, a controller, and a model — giving you a complete end-to-end pass through the architecture without modifying any existing, tested code paths.

**Scope:**
- Create `src/models/commentModel.js` with a `findByTaskId({ taskId, pagination })` function using Knex
- Create `src/controllers/commentsController.js` with a `listByTask` handler that enforces task ownership (see `tasksController.getById` for the ownership pattern)
- Add `GET /:id/comments` to `src/routes/tasks.js` with UUID param validation and the `authenticate` middleware
- Write at least one Jest + Supertest integration test covering the 200 and 404 cases

**Files to modify/create:**
- `src/models/commentModel.js` — new file; implement `findByTaskId` with Knex pagination
- `src/controllers/commentsController.js` — new file; implement `listByTask`, reuse ownership check from `tasksController`
- `src/routes/tasks.js` — add the new GET route after the existing `/:id` route
- `tests/comments.test.js` — new test file using Supertest

**Estimated effort:** 1–2 days

---

_Generated by [DevOnboard](https://github.com/your-org/DevOnboard) · Powered by [IBM Bob](https://www.ibm.com/bob)_
