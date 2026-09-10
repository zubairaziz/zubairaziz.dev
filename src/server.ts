import type { Register } from '@tanstack/react-router'
import type { RequestHandler } from '@tanstack/react-start/server'
import {
	createStartHandler,
	defaultStreamHandler,
} from '@tanstack/react-start/server'

/**
 * Server entry — the universal `{ fetch }` handler that every deployment
 * runtime (Node/Nitro, Bun, Vercel, Netlify, Cloudflare Workers) can run
 * without changing the application model.
 *
 * `defaultStreamHandler` performs full-document SSR and streams the response:
 * the HTML shell is sent immediately, then deferred loader data and Suspense
 * boundaries are progressively flushed to the client.
 *
 * The router is wired in automatically from `src/router.tsx` by the Start
 * plugin, so the same code runs everywhere.
 */
const fetch = createStartHandler(defaultStreamHandler)

export type ServerEntry = { fetch: RequestHandler<Register> }

export default {
	fetch,
}
