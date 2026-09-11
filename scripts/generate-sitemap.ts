/**
 * Generates `public/sitemap.xml` at build time. The site is a one-pager, so
 * the sitemap contains a single `/` entry; its `lastmod` is derived from the
 * mtime of `src/lib/me.ts` — the single source of truth for home content — so
 * it only changes when the content actually does, not on every rebuild.
 *
 * Runs automatically during `vite build` (the `generate-static-files` plugin
 * in `vite.config.ts`) and standalone via `node scripts/generate-sitemap.ts`.
 */
import { mkdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { me } from '../src/lib/me.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'public', 'sitemap.xml')

/** `YYYY-MM-DD` for when the home copy last changed (falls back to today). */
function lastmod() {
	try {
		return statSync(join(root, 'src/lib/me.ts'))
			.mtime.toISOString()
			.slice(0, 10)
	} catch {
		return new Date().toISOString().slice(0, 10)
	}
}

export function generateSitemap() {
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://${me.host}/</loc>
    <lastmod>${lastmod()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`

	mkdirSync(dirname(out), { recursive: true })
	writeFileSync(out, xml)
	return out
}

// Standalone: `node scripts/generate-sitemap.ts`
if (
	process.argv[1] &&
	import.meta.url === pathToFileURL(process.argv[1]).href
) {
	console.log(`generated ${generateSitemap()}`)
}
