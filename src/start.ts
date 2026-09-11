import {
	createCsrfMiddleware,
	createMiddleware,
	createStart,
} from '@tanstack/react-start'
import {
	agentSkillsIndex,
	apiCatalog,
	ardCatalog,
	authMarkdown,
	DISCOVERY_LINK_HEADERS,
	homepageMarkdown,
	jwks,
	mcpServerCard,
	oauthAuthorizationServer,
	oauthProtectedResource,
	openIdConfiguration,
} from './lib/discovery'

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

/** JSON response helper for machine-readable well-known endpoints. */
function jsonResponse(
	data: unknown,
	contentType = 'application/json',
): Response {
	return new Response(JSON.stringify(data, null, 2), {
		status: 200,
		headers: {
			'content-type': `${contentType}; charset=utf-8`,
			'access-control-allow-origin': '*',
		},
	})
}

/** Markdown response helper for agent content negotiation and `/auth.md`. */
function markdownResponse(body: string, extraHeaders?: HeadersInit): Response {
	return new Response(body, {
		status: 200,
		headers: {
			'content-type': 'text/markdown; charset=utf-8',
			'x-markdown-tokens': String(Math.ceil(body.length / 4)),
			...extraHeaders,
		},
	})
}

/**
 * Agent-discovery middleware — serves the `.well-known` machine-readable
 * endpoints (api-catalog, ai-catalog, MCP server card, agent skills index,
 * OAuth/OIDC metadata, auth.md) and performs `Accept: text/markdown` content
 * negotiation on the homepage. Short-circuits before the router, so these
 * paths never fall through to the catch-all 404.
 */
const agentDiscovery = createMiddleware({ type: 'request' }).server(
	async ({ request, pathname, context, next, handlerType }) => {
		// Only act on page requests, never server functions.
		if (handlerType !== 'router') return next({})

		const method = request.method
		if (method !== 'GET' && method !== 'HEAD') return next({})

		const accept = request.headers.get('accept') ?? ''

		// Well-known machine-readable endpoints.
		switch (pathname) {
			case '/.well-known/api-catalog':
				return {
					request,
					pathname,
					context,
					response: jsonResponse(apiCatalog(), 'application/linkset+json'),
				}
			case '/.well-known/ai-catalog.json':
				return {
					request,
					pathname,
					context,
					response: jsonResponse(ardCatalog()),
				}
			case '/.well-known/mcp/server-card.json':
				return {
					request,
					pathname,
					context,
					response: jsonResponse(mcpServerCard()),
				}
			case '/.well-known/agent-skills/index.json':
				return {
					request,
					pathname,
					context,
					response: jsonResponse(agentSkillsIndex()),
				}
			case '/.well-known/openid-configuration':
				return {
					request,
					pathname,
					context,
					response: jsonResponse(openIdConfiguration()),
				}
			case '/.well-known/oauth-authorization-server':
				return {
					request,
					pathname,
					context,
					response: jsonResponse(oauthAuthorizationServer()),
				}
			case '/.well-known/oauth-protected-resource':
				return {
					request,
					pathname,
					context,
					response: jsonResponse(oauthProtectedResource()),
				}
			case '/.well-known/jwks.json':
				return {
					request,
					pathname,
					context,
					response: jsonResponse(jwks()),
				}
			case '/auth.md':
				return {
					request,
					pathname,
					context,
					response: markdownResponse(authMarkdown()),
				}
		}

		// Markdown content negotiation for the homepage.
		const wantsMarkdown = /text\/markdown/.test(accept)
		if (wantsMarkdown && (pathname === '/' || pathname === '/index.html')) {
			return {
				request,
				pathname,
				context,
				response: markdownResponse(homepageMarkdown(), {
					link: DISCOVERY_LINK_HEADERS.join(', '),
				}),
			}
		}

		// Render normally, then advertise discovery resources via Link headers
		// on the homepage HTML response (RFC 8288).
		const result = await next({})

		if (
			pathname === '/' &&
			result.response.ok &&
			(result.response.headers.get('content-type') ?? '').includes('text/html')
		) {
			const headers = new Headers(result.response.headers)
			for (const link of DISCOVERY_LINK_HEADERS) {
				headers.append('link', link)
			}
			return {
				...result,
				response: new Response(result.response.body, {
					status: result.response.status,
					statusText: result.response.statusText,
					headers,
				}),
			}
		}

		return result
	},
)

export const startInstance = createStart(() => ({
	requestMiddleware: [requestLogger, csrfMiddleware, agentDiscovery],
}))
