# CodeCraft

CodeCraft is a full-stack student learning portal built with React, TypeScript, Tailwind CSS, tRPC, Drizzle ORM, MySQL/TiDB, S3-compatible storage, and Manus OAuth.

## Open in VS Code

1. Open this folder in VS Code: `codecraft/`
2. Install Node.js 20+ and pnpm.
3. Run `pnpm install`.
4. Configure the project environment variables used by the Manus WebDev runtime.
5. Run `pnpm dev`.
6. Open the local preview shown by Vite.

## Useful commands

- `pnpm dev` — start the development server
- `pnpm test` — run the Vitest suite
- `pnpm exec tsc --noEmit` — run TypeScript validation
- `pnpm build` — create the production build
- `pnpm drizzle-kit generate` — generate a database migration after schema changes

## Main source folders

- `client/src/` — React pages, components, routes, and styling
- `server/` — tRPC procedures, database helpers, auth, and storage
- `drizzle/` — database schema and migrations
- `shared/` — shared types and constants

Do not commit `.env` files, credentials, session cookies, or generated `node_modules/` and `dist/` folders.
