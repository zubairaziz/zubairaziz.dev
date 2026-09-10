import {
	createCsrfMiddleware,
	createMiddleware,
	createStart,
} from '@tanstack/react-start'

/**
 * `src/start.ts` is a server-only module — it is stripped from the client
 * bundle entirely. It is the explicit home for global server request
 * middleware.
 *
 * Defining this file opts you out of the automatically-installed defaults,
 * so anything you want (like CSRF protection) must be added explicitly.
 */

// Protect server functions (and only server functions) from cross-site
// request forgery using Fetch Metadata / Origin / Referer heuristics.
const csrfMiddleware = createCsrfMiddleware({
	filter: (ctx) => ctx.handlerType === 'serverFn',
})

// Small request logger — runs for every request (SSR, server routes, server fns).
const requestLogger = createMiddleware({ type: 'request' }).server(
	async ({ next, request }) => {
		const startedAt = performance.now()
		const url = new URL(request.url)

		const response = await next({})

		const duration = Math.round(performance.now() - startedAt)
		console.log(
			`[${request.method}] ${url.pathname}${url.search} → ${response.response.status} (${duration}ms)`,
		)

		return response
	},
)

export const startInstance = createStart(() => ({
	requestMiddleware: [requestLogger, csrfMiddleware],
}))
