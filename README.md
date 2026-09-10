# zubairaziz.dev — TanStack Start

A full-stack [TanStack Start](https://tanstack.com/start) application built around
explicit server boundaries. It demonstrates the core TanStack Start patterns:

- **File-based TanStack Router routes** — `src/routes/` maps 1:1 to URLs
- **Validated search params** — Zod (`@tanstack/zod-adapter`) with `validateSearch`
- **Route loaders** — run on the server for the initial request, on the client for navigation
- **Typed server functions** — `createServerFn` RPCs, safe to import anywhere
- **Full-document SSR** — `shellComponent` owns `<html>/<head>/<body>`, `head()` manages SEO
- **Streaming** — deferred loader data + typed async-generator server-function streams
- **Selective SSR per route** — `ssr: true` | `'data-only'` | `false`
- **Runtime-agnostic deployment** — Nitro preset chosen at build time, app code unchanged

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build & run (Node via Nitro `node-server` preset):

```bash
npm run build      # vite build + tsc --noEmit → .output/
npm run start      # node .output/server/index.mjs
```

---

## Routes & SSR modes

| Route | `ssr` mode | What it demonstrates |
| --- | --- | --- |
| `/` | `true` (default) | Validated search params (`?tab=`), route loader calling typed server functions |
| `/posts` | `true` | Full search-params demo (`page`, `perPage`, `q`, `sort`) driving the loader |
| `/posts/$postId` | `true` | Typed path params, `notFound()` from loader, per-route SEO via `head({ loaderData })` |
| `/stream` | `true` + streaming | Deferred loader data (SSR streaming) + typed async-generator server-function stream |
| `/dashboard` | `'data-only'` | `beforeLoad`/`loader` on server, component rendered on client, `pendingComponent` fallback |
| `/client-only` | `false` | Browser-only APIs (`localStorage`, `window`); no server rendering at all |
| `/about` | `true` | Zod-validated `POST` server function (contact form) |
| `/$` | — | Catch-all → shared 404 |

> Selective SSR inheritance: a child route can only become *more* restrictive than
> its parent (`true` → `'data-only'` → `false`).

---

## Server boundaries

Server-only work is kept behind explicit boundaries so it never leaks into the
client bundle:

| File | Role |
| --- | --- |
| `src/server/*.server.ts` | Server-only modules (data store, process stats). Never imported by client code. |
| `src/functions/*.functions.ts` | `createServerFn` wrappers — safe to import from components/loaders; handlers stay on the server. |
| `src/start.ts` | Global server request middleware (`createStart`). Server-only; stripped from the client bundle. |
| `src/server.ts` | Universal `{ fetch }` streaming entry (`createStartHandler` + `defaultStreamHandler`). |
| `src/client.tsx` | Client hydration entry (`StartClient`). |
| `src/router.tsx` | Router factory shared by server and client. |
| `src/lib/schemas.ts` | Shared, client-safe Zod schemas used by both search validation and server-function validators. |

`src/start.ts` defines the global request middleware explicitly (defining it opts
out of defaults), so it re-adds `createCsrfMiddleware` for server functions and
adds a request logger.

---

## Streaming

1. **Deferred loader data** — a loader returns a `Promise`; the HTML shell streams
   immediately and the resolved section is flushed via `<Suspense>` + `<Await>`.
2. **Typed server-function streams** — a handler written as an `async function*`
   yields typed chunks that arrive progressively on the client.

```ts
// src/functions/stream.functions.ts
export const streamBuildLog = createServerFn().handler(async function* () {
  for (const [index, content] of MESSAGES.entries()) {
    await new Promise((r) => setTimeout(r, 350))
    yield { id: index + 1, content, at: new Date().toISOString() }
  }
})
```

---

## Deployment targets

The application model is runtime-agnostic. The deployment **target** is decided
at build time via the Nitro preset in `vite.config.ts`:

```ts
nitro({ preset: process.env.NITRO_PRESET || 'node-server' })
```

Swap the preset without touching any app code:

```bash
# Node.js server (default) → npm run start
NITRO_PRESET=node-server npm run build

# Bun / Vercel / Netlify / Cloudflare
NITRO_PRESET=bun          npm run build
NITRO_PRESET=vercel       npm run build
NITRO_PRESET=netlify      npm run build
NITRO_PRESET=cloudflare-pages npm run build
```

- **Node/Vercel/Railway/Appwrite** — use Nitro presets; run the produced server output
- **Netlify** — `@netlify/vite-plugin-tanstack-start` instead of the Nitro plugin
- **Cloudflare Workers** — `@cloudflare/vite-plugin` (`viteEnvironment: 'ssr'`)

See the [TanStack Start hosting guide](https://tanstack.com/start/latest/docs/framework/react/guide/hosting) for provider-specific steps.

---

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Dev server with HMR and route-tree generation |
| `npm run build` | `vite build` + `tsc --noEmit` → `.output/` |
| `npm run start` | Run the production Nitro server (`node .output/server/index.mjs`) |
| `npm run preview` | Preview the build |
| `npm run typecheck` | `tsc --noEmit` |

---

## Stack

- **TanStack Start** `^1.168` / **TanStack Router** `^1.170`
- **React 19**, **Vite 8**, **TypeScript 5.9**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **Nitro** `^3` for the production server build
- **Zod** + **@tanstack/zod-adapter** for validation
