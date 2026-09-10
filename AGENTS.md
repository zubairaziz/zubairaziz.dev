# AGENTS.md — zubairaziz.dev

Personal site of **Zubair Aziz**, styled as a dark, mono, terminal-shaped one-pager.
Built with **TanStack Start** (Vite + Nitro), React 19, Tailwind v4, and shadcn v4.

---

## Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Vite dev server on `http://localhost:3000` (auto-bumps to 3001 if busy) |
| `pnpm build` | `vite build && tsc --noEmit` → emits to `.output/` |
| `pnpm build:cf` | Build for Cloudflare Workers (`NITRO_PRESET=cloudflare-module`) |
| `pnpm deploy` | `build:cf` then `wrangler deploy` |
| `pnpm cf-typegen` | Generate `worker-configuration.d.ts` from `wrangler.jsonc` |
| `pnpm start` | `node .output/server/index.mjs` (production preview) |
| `pnpm lint` | `biome check --write . --unsafe` — **auto-fixes and rewrites files** |
| `pnpm typecheck` | `tsc --noEmit` |

Always run `pnpm typecheck` after edits; it is the source of truth for correctness.

---

## Stack & versions

- TanStack Start ^1.168 + Router ^1.170, React 19.3, Vite 8, TypeScript 7, Nitro ^3 beta
- Cloudflare Workers deploys via `@cloudflare/vite-plugin` + `wrangler` (see Deployment notes)
- Tailwind v4 via `@tailwindcss/vite` (see gotcha below), pnpm 11 (`.nvmrc` pins Node 24)
- shadcn v4 (style `base-lyra`, baseColor `mist`, base-ui primitives, `lucide-react` icons)
- Biome for lint + format; path alias `~/*` → `src/*`

## File map

```
wrangler.jsonc     # Cloudflare Workers config (name, entry, compat flags)
.github/workflows/
  deploy.yml       # CI: build + wrangler deploy on push to main
src/
  client.tsx        # hydration entry (StartClient)
  server.ts         # universal { fetch } streaming entry
  start.ts          # global server request middleware
  router.tsx        # router factory (shared server/client)
  routes/
    __root.tsx      # <html>/<head>/<body> shell + SEO + layout header
    index.tsx       # "/" — the terminal one-pager (all home sections)
    $.tsx           # catch-all → shared 404
  lib/
    me.ts           # SINGLE SOURCE OF TRUTH for home copy/links (hand-edited)
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
  generate-og.mjs        # regenerates OG card (oklch→hex + base64 fonts)
  apple-touch-icon.svg   # source for the 180×180 icon
```

---

## Hard rules (do not break)

1. **Theme tokens only.** Never use raw Tailwind color classes (`slate-…`, `rose-…`,
   `white`, etc.). Use `bg-background`, `text-foreground`, `text-muted-foreground`,
   `text-primary`, `border-border`. `<html>` carries `className="dark"` in
   `__root.tsx`, so the `.dark` token set drives the look.
2. **The accent is rose — deep crimson `#a50036`** (`oklch(0.455 0.188 13.697)`).
   This is intentional, NOT orange. Don't "fix" it.
3. **Copy lives in `src/lib/me.ts`.** Nothing else hardcodes text. Update `me.ts`
   to change what the site says. (The `email` link is a known placeholder — leave it.)
4. **Tailwind via `@tailwindcss/vite` in `vite.config.ts` — NOT PostCSS.** The
   PostCSS route breaks the SSR build (Vite 8's internal `postcss-import` runs
   first and ENOENTs on `@import "tailwindcss"`).
5. **JSON-LD** — use TanStack Router's native meta key, never `dangerouslySetInnerHTML`:
   `{ 'script:ld+json': <plain object> }` inside `head().meta`. It auto-stringifies
   and escapes (Biome flags the raw approach).
6. **OG meta tags use `property`** (not `name`) — the `seo()` helper already does this.
7. **Keep the Vite `optimizeDeps.include` for `use-sync-external-store/shim/with-selector`.**
   Removing it breaks hydration (typewriter freezes) in dev. If you change it, clear
   `node_modules/.vite` and restart.

## Deployment notes

- Runtime-agnostic app; target chosen at build time by `NITRO_PRESET` (default
  `node-server`, which builds through Nitro to `.output/`).
- `NITRO_PRESET=cloudflare-*` swaps Nitro for `@cloudflare/vite-plugin`: the
  plugin builds the `ssr` environment against the Workers runtime, and
  `wrangler deploy` (config in `wrangler.jsonc`) uploads it. `pnpm build:cf` /
  `pnpm deploy` / `pnpm cf-typegen` wrap this.
- CI: `.github/workflows/deploy.yml` deploys on push to `main` via
  `cloudflare/wrangler-action`. Needs repo secrets `CLOUDFLARE_ACCOUNT_ID` +
  `CLOUDFLARE_API_TOKEN` and a GitHub `production` environment (or drop the
  `environment:` line).
- Static assets in `public/` are served as-is (favicon, OG image, manifest,
  robots.txt, sitemap.xml). Regenerate the OG card with `node scripts/generate-og.mjs`
  and the icon with `rsvg-convert -w 180 -h 180 scripts/apple-touch-icon.svg -o public/apple-touch-icon.png`.

## Code style (Biome)

- Tabs, single quotes, no semicolons, organize imports on.
- `pnpm lint` writes files — run `pnpm typecheck` afterward.
- `src/routeTree.gen.ts` and `public/` are lint-ignored; never hand-edit the route tree.

---

## Project skills (`.agents/skills/`)

Reference these when the matching task comes up:

| Skill | Use when |
| --- | --- |
| `frontend-design` | Designing or reshaping UI; aesthetic direction, typography, avoiding templated looks. |
| `shadcn` | Adding/fixing shadcn/ui components, styling, composing UI. Run CLI via `pnpm dlx shadcn@latest`. |
| `copywriting` | Writing/improving marketing copy for any page. |
| `web-design-guidelines` | "Review my UI", accessibility audit, UX/design review. |
| `agent-browser` | Browser automation: navigate, screenshot, test, or QA the site. |
| `find-skills` | User wants to discover/install a new capability or skill. |
| `grill-me` | User invokes it explicitly to sharpen a plan/design ("grill me"). |

> `grill-me` is user-invoked only (`disable-model-invocation`); `shadcn` is
> non-user-invocable but applies automatically for shadcn work.

---

## Known issues / TODOs

- `me.ts` email link is a placeholder (`mailto:zubairaziz.dev@gmail.com`) — intentional for now.
