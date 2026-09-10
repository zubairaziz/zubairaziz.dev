import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'

/**
 * TanStack Start (Vite) + Nitro for production server builds.
 *
 * The application model (routes, loaders, server functions, SSR modes) is
 * completely runtime-agnostic. The deployment *target* is a build-time
 * decision made here — swap the Nitro preset without touching app code:
 *
 *   - `node-server` (default) → Node.js server via `node .output/server/index.mjs`
 *   - `bun`                   → Bun server
 *   - `vercel`                → Vercel functions
 *   - `netlify`               → Netlify functions
 *   - `cloudflare-pages` / `cloudflare-module` → Cloudflare Workers/Pages
 *
 * You can override the preset at build time with the `NITRO_PRESET` env var:
 *
 *   NITRO_PRESET=vercel npm run build
 *
 * The default entry files are resolved by the plugin: `src/client.tsx`,
 * `src/server.ts`, `src/start.ts`, `src/router.tsx`.
 */
export default defineConfig({
	server: {
		port: 3000,
	},
	resolve: {
		tsconfigPaths: true,
	},
	optimizeDeps: {
		// `use-sync-external-store`'s shim entry is a CJS stub that re-exports
		// via a conditional `require()`, which Vite can't statically analyze when
		// served raw. Pre-bundling it lets esbuild resolve the real named export.
		include: ['use-sync-external-store/shim/with-selector'],
	},
	plugins: [
		tailwindcss(),
		tanstackStart(),
		// react's vite plugin must come after start's vite plugin
		viteReact(),
		// production server build → outputs to `.output`
		nitro({
			preset: process.env.NITRO_PRESET || 'node-server',
		}),
	],
})
