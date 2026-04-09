# MedReviewUI

A small **React** demo app for a medical-style review portal: browse a doctor directory, open reviews for a doctor, and add or remove **locally stored** reviews. It is built to showcase a modern front-end stack with a **GraphQL API layer** in front of a public REST placeholder.

---

## Tech stack

| Layer | Choice |
|--------|--------|
| **Language** | TypeScript (strict) |
| **UI** | React 19, Vite 8 |
| **Styling** | Tailwind CSS v4 (utility-first, mobile-first) |
| **Routing** | React Router v7 |
| **Server state / API** | Apollo Client + GraphQL |
| **Local app state** | Redux Toolkit (RTK) — e.g. user-added reviews, selection |
| **Forms / dialogs** | Material UI (`Dialog`, etc.) where used |
| **Icons** | Lucide React |
| **GraphQL server** | Apollo Server 4 (Node), `server/` workspace package |
| **Package manager** | pnpm (workspace: app + `server`) |
| **Lint / format** | ESLint, Prettier |

---

## Data sources (important for reviewers)

- **JSONPlaceholder** ([jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com/)) is used as a **read-only fake backend**:
  - **Users** are mapped to “doctors” (company → hospital, website → professional profile URL).
  - **Comments** are fetched by `postId` (aligned with “doctor id” in the UI) as remote review-like rows.
- **No real database** in this repo. JSONPlaceholder is **external**; the local **GraphQL server** only proxies and shapes that data.
- **Reviews added in the UI** are stored in **Redux in the browser** (they do not persist to JSONPlaceholder or a DB). Refreshing the page will reload remote data from the API; locally added items follow normal SPA persistence (lost on full refresh unless you add persistence).

This setup is intentional for a **portfolio / learning** project: predictable fake data, no API keys, easy to run.

---

## Architecture (high level)

```
Browser (Vite + React)
  ├── Apollo Client  →  POST http://localhost:4000/  (GraphQL)
  └── Redux Toolkit  →  local reviews + UI-related state

Node (server/)
  └── Apollo Server  →  fetch()  →  JSONPlaceholder REST
```

Environment variable **`VITE_GRAPHQL_API`** points the SPA at the GraphQL endpoint (default: `http://localhost:4000/`).

---

## Prerequisites

- **Node.js** (LTS recommended)
- **pnpm** 10.x (`packageManager` is pinned in `package.json`)

---

## Setup

```bash
pnpm install
```

Copy or set `.env` in the project root (see below).

---

## Running the app

The UI **expects the GraphQL server to be running** for doctors and remote reviews.

### Option A — frontend + API together

```bash
pnpm run dev:stack
```

Starts Vite and the GraphQL server via `concurrently`.

### Option B — two terminals

**Terminal 1 — GraphQL API**

```bash
pnpm run server
```

You should see a line like: `GraphQL API ready at http://localhost:4000/`

> **Note:** Use `pnpm run server` (with `run`). In pnpm workspaces, bare `pnpm server` may not execute the npm script as expected.

**Terminal 2 — Vite dev server**

```bash
pnpm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

### If the server fails with `EADDRINUSE` on port 4000

Another process (often a previous server instance) is using port **4000**. Stop that process or pick another port (you would need to change the listen port in `server/src/index.ts` and `VITE_GRAPHQL_API` to match).

---

## Environment variables

| Variable | Purpose |
|----------|---------|
| `VITE_GRAPHQL_API` | Base URL of the GraphQL HTTP endpoint (e.g. `http://localhost:4000/`) |

Vite only exposes env vars prefixed with `VITE_` to the client.

---

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm run dev` | Vite dev server (frontend only) |
| `pnpm run server` | GraphQL server (`tsx watch` in `server/`) |
| `pnpm run dev:stack` | Frontend + GraphQL server together |
| `pnpm run build` | Typecheck + production build |
| `pnpm run lint` | ESLint |
| `pnpm run format` | Prettier write |

---

## Project layout (abbreviated)

```
├── server/                 # Apollo Server — wraps JSONPlaceholder
│   └── src/index.ts
├── src/
│   ├── App.tsx             # Routes
│   ├── main.tsx            # ApolloProvider, Redux Provider
│   ├── graphql/            # Apollo client + gql documents
│   ├── store/              # RTK slices (e.g. reviews)
│   ├── views/              # Page-level components
│   └── components/         # Reusable UI (cards, dialogs, …)
├── package.json
└── pnpm-workspace.yaml     # workspace: root app + server
```

---

## What a recruiter might care about

- **TypeScript end-to-end** on the app; strict typing discipline in app code.
- **Separation of concerns:** GraphQL for network reads, Redux for client-only / additive state.
- **Realistic layering:** a dedicated GraphQL service in `server/` instead of calling JSONPlaceholder directly from every component.
- **Tooling:** ESLint + Prettier, Vite for fast DX, pnpm workspaces for a small monorepo.
- **Honest data story:** external placeholder API + in-memory Redux for user actions — good for demos, not a production persistence model unless extended.

---

## License

Private / portfolio use unless you add a license file.
