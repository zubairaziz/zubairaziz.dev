import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'
import { generateLlmText } from './scripts/generate-llms.ts'
import { generateSitemap } from './scripts/generate-sitemap.ts'

const target = process.env.NITRO_PRESET || 'node-server'
// `cloudflare-*` targets use the Workers runtime via `@cloudflare/vite-plugin`
// instead of Nitro. Everything else builds through Nitro.
const isCloudflare = target.startsWith('cloudflare')

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
 *   - `cloudflare-*`          → Cloudflare Workers (via `@cloudflare/vite-plugin`)
 *
 * You can override the target at build time with the `NITRO_PRESET` env var:
 *
 *   NITRO_PRESET=vercel npm run build
 *   NITRO_PRESET=cloudflare-module pnpm build:cf && pnpm wrangler deploy
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
		// Regenerate `public/llms.txt` and `public/sitemap.xml` on every
		// production build so they stay in sync with `src/lib/me.ts` (runs
		// before `public/` is copied to output).
		{
			name: 'generate-static-files',
			apply: 'build',
			buildStart() {
				generateLlmText()
				generateSitemap()
			},
		},
		tailwindcss(),
		// Cloudflare Workers: build the "ssr" Vite environment against the
		// Workers runtime; `wrangler deploy` uploads the result.
		...(isCloudflare ? [cloudflare({ viteEnvironment: { name: 'ssr' } })] : []),
		tanstackStart(),
		// react's vite plugin must come after start's vite plugin
		viteReact(),
		// production server build → outputs to `.output`
		...(isCloudflare ? [] : [nitro({ preset: target })]),
	],
})
