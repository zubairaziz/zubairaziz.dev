# zubairaziz.dev

The personal site of **Zubair Aziz** — a dark, mono, terminal-shaped one-pager.

Built with **TanStack Start** (Vite + Nitro), **React 19**, **Tailwind CSS v4**,
and **shadcn/ui** v4.

---

## Quick start

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Production build & run (Node via Nitro `node-server` preset):

```bash
pnpm build        # vite build + tsc --noEmit → .output/
pnpm start        # node .output/server/index.mjs
```

---

## What's here

A single-page terminal — every section is a shell command and its output.

| Route | What it is |
| --- | --- |
| `/` | The terminal one-pager — `$ whoami`, `$ working on`, `$ cat ~/links` |
| `/$` | Catch-all → shared 404 |

Copy lives in **`src/lib/me.ts`** — the single source of truth for the name,
tagline, "now" items, and links. Edit that file to change what the site says.

---

## Structure

```
src/
  client.tsx        # hydration entry (StartClient)
  server.ts         # universal { fetch } streaming entry
  start.ts          # global server request middleware
  router.tsx        # router factory (shared server/client)
  routes/
    __root.tsx      # <html>/<head>/<body> shell + SEO + layout header
    index.tsx       # "/" — the terminal one-pager
    $.tsx           # catch-all → shared 404
  lib/
    me.ts           # single source of truth for home copy/links
    seo.ts          # seo() helper → typed <meta> tags
    utils.ts        # re-exports cn from 'cn'
  components/
    TypedText.tsx   # typewriter (type/delete state machine, SSR-safe)
    NotFound.tsx / DefaultCatchBoundary.tsx
    ui/             # shadcn components (button.tsx, badge.tsx)
  styles/app.css    # Tailwind + shadcn theme tokens (light + .dark sets)
public/
  favicon.svg  opengraph-image.png  apple-touch-icon.png
  site.webmanifest  robots.txt  sitemap.xml
scripts/
  generate-og.mjs        # regenerates the OG card (oklch→hex + base64 fonts)
  apple-touch-icon.svg   # source for the 180×180 icon
```

---

## Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Dev server with HMR and route-tree generation |
| `pnpm build` | `vite build` + `tsc --noEmit` → `.output/` |
| `pnpm start` | Run the production Nitro server (`node .output/server/index.mjs`) |
| `pnpm lint` | `biome check --write . --unsafe` — auto-fixes and rewrites files |
| `pnpm typecheck` | `tsc --noEmit` |

---

## Stack

- **TanStack Start** `^1.168` / **TanStack Router** `^1.170`
- **React 19**, **Vite 8**, **TypeScript 7**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **shadcn/ui** v4 (style `base-lyra`, baseColor `mist`)
- **Nitro** `^3` for the production server build
- **Biome** for lint + format

---

## Deployment

The app is runtime-agnostic; the deployment target is the Nitro preset, chosen
at build time in `vite.config.ts`:

```ts
nitro({ preset: process.env.NITRO_PRESET || 'node-server' })
```

```bash
NITRO_PRESET=node-server pnpm build   # default
NITRO_PRESET=vercel       pnpm build
NITRO_PRESET=netlify      pnpm build
NITRO_PRESET=cloudflare-pages pnpm build
```

See [AGENTS.md](./AGENTS.md) for project conventions, hard rules, and the
available agent skills.
