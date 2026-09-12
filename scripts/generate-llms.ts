/**
 * Generates `public/llms.txt` — a plain-text file describing the site for
 * LLMs (spec: https://llmstxt.org). All content is derived from
 * `src/lib/me.ts`, the single source of truth for home page copy.
 *
 * Runs automatically during `vite build` (the `generate-static-files` plugin
 * in `vite.config.ts`) and standalone via `node scripts/generate-llms.ts`.
 *
 * Relies on Node's native TypeScript type stripping to import `me.ts`
 * directly (Node 22.6+, default in Node 24 — the version pinned by `.nvmrc`).
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { me } from '../src/lib/me.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'public', 'llms.txt')

/** Friendlier display titles for the lowercase link labels in `me.links`. */
const linkTitles: Record<string, string> = {
	github: 'GitHub',
	x: 'X',
	linkedin: 'LinkedIn',
	email: 'Email',
	whatsapp: 'WhatsApp',
}

export function generateLlmText() {
	const base = `https://${me.host}`
	const words = me.tagline.words
	const built =
		words.length > 1
			? `${words.slice(0, -1).join(', ')}, and ${words[words.length - 1]}`
			: words[0]

	const lines = [
		`# ${me.name}`,
		'',
		`> ${me.name} — ${me.role} building ${built}.`,
		'',
		`The personal site of ${me.name}, a terminal-styled one-pager at ${base}.`,
		'',
		'## Site',
		'',
		`- [Home](${base}/): The personal site of ${me.name} — ${me.role}.`,
	]

	if (me.projects.length > 0) {
		lines.push('', '## Working on', '')
		for (const project of me.projects) {
			if ('title' in project) {
				lines.push(`- ${project.title}`)
				for (const link of project.links) {
					lines.push(`  - [${link.label}](${link.href})`)
				}
			} else {
				lines.push(`- [${project.label}](${project.href})`)
			}
		}
	}

	if (me.links.length > 0) {
		lines.push('', '## Links', '')
		for (const link of me.links) {
			const title = linkTitles[link.label] ?? link.label
			lines.push(`- [${title}](${link.href})`)
		}
	}

	mkdirSync(dirname(out), { recursive: true })
	writeFileSync(out, `${lines.join('\n')}\n`)
	return out
}

// Standalone: `node scripts/generate-llms.ts`
if (
	process.argv[1] &&
	import.meta.url === pathToFileURL(process.argv[1]).href
) {
	console.log(`generated ${generateLlmText()}`)
}
