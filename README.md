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
wrangler.jsonc               # Cloudflare Workers config (name, entry, compat flags)
.github/workflows/deploy.yml # CI: build + wrangler deploy on push to main
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
| `pnpm build:cf` | Build for Cloudflare Workers (`NITRO_PRESET=cloudflare-module`) |
| `pnpm deploy` | `build:cf` + `wrangler deploy` |
| `pnpm cf-typegen` | Generate `worker-configuration.d.ts` from `wrangler.jsonc` |
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

The app is runtime-agnostic; the deployment target is chosen at build time in
`vite.config.ts`.

**Node (Nitro) — default:**

```bash
pnpm build    # vite build + tsc --noEmit → .output/
pnpm start    # node .output/server/index.mjs
```

Any `NITRO_PRESET` value that isn't `cloudflare-*` builds through Nitro:

```bash
NITRO_PRESET=vercel  pnpm build
NITRO_PRESET=netlify pnpm build
```

**Cloudflare Workers:**

`NITRO_PRESET=cloudflare-*` swaps Nitro for `@cloudflare/vite-plugin`, and the
built Worker is deployed with Wrangler (see `wrangler.jsonc`):

```bash
pnpm build:cf     # NITRO_PRESET=cloudflare-module vite build
pnpm deploy       # build:cf && wrangler deploy
pnpm cf-typegen   # wrangler types
```

CI/CD deploys on every push to `main` via `.github/workflows/deploy.yml`
(`cloudflare/wrangler-action`). Required repo secrets: `CLOUDFLARE_ACCOUNT_ID`
and `CLOUDFLARE_API_TOKEN`.

See [AGENTS.md](./AGENTS.md) for project conventions, hard rules, and the
available agent skills.
