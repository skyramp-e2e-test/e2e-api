# e2e-api

A small Express web API used as a target for end-to-end testing. Data is kept in an in-memory store, so it resets whenever the server restarts.

## Requirements

- Node.js 18+ (CI uses Node 20)
- npm

## Setup

```bash
npm install
```

`npm install` also runs `husky` (via the `prepare` script), which installs the Git pre-commit hook.

## Run

```bash
npm start            # listens on http://localhost:3000
PORT=8080 npm start  # custom port
```

## Endpoints

| Method | Path             | Description                                  | Success |
| ------ | ---------------- | -------------------------------------------- | ------- |
| GET    | `/health`        | Health check: `{ "status": "ok", "uptime" }` | 200     |
| GET    | `/api/items`     | List all items                               | 200     |
| GET    | `/api/items/:id` | Get one item                                 | 200     |
| POST   | `/api/items`     | Create an item                               | 201     |
| PUT    | `/api/items/:id` | Replace an item                              | 200     |
| PATCH  | `/api/items/:id` | Partially update an item                     | 200     |
| DELETE | `/api/items/:id` | Delete an item                               | 204     |

Item shape:

```json
{
  "id": "uuid",
  "name": "string (required, non-empty)",
  "description": "string (optional, defaults to \"\")",
  "createdAt": "ISO-8601 timestamp",
  "updatedAt": "ISO-8601 timestamp"
}
```

Errors are returned as `{ "error": "message" }` with status `400` (validation / malformed JSON) or `404` (unknown item or route).

Example:

```bash
curl -X POST localhost:3000/api/items -H 'Content-Type: application/json' -d '{"name":"Widget"}'
curl localhost:3000/api/items
```

## Test

Unit tests use Jest and supertest (no running server needed):

```bash
npm test
npm test -- --coverage   # with a coverage report
```

## Lint

```bash
npm run lint       # check
npm run lint:fix   # auto-fix
```

ESLint is configured in `eslint.config.js` (flat config).

## Pre-commit hook

Husky runs `lint-staged` before each commit (`.husky/pre-commit`), which lints the staged `.js` files with ESLint and blocks the commit on any error or warning.

## CI

`.github/workflows/ci.yml` runs `npm ci`, `npm run lint` and `npm test` on every pull request, regardless of target branch.

Run the tests with `npm test`.
