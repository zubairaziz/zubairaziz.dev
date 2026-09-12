import { useEffect } from 'react'
import { me } from '~/lib/me'

/**
 * WebMCP — exposes the site's key actions as client-side tools that AI agents
 * can invoke through the browser (https://webmachinelearning.github.io/webmcp/).
 *
 * Tools are registered on mount and unregistered on unmount via an
 * `AbortController` signal. Feature-detected, so nothing happens in browsers
 * without `document.modelContext` (or the older `navigator.modelContext`).
 */
type WebMcpTool = {
	name: string
	description: string
	inputSchema: Record<string, unknown>
	execute: (args: Record<string, unknown>) => Promise<string> | string
}

type ModelContext = {
	registerTool: (
		tool: WebMcpTool,
		options?: { signal?: AbortSignal },
	) => Promise<undefined>
}

declare global {
	interface Document {
		modelContext?: ModelContext
	}
	interface Navigator {
		modelContext?: ModelContext
	}
}

const emptyObjectSchema = {
	type: 'object',
	properties: {},
	additionalProperties: false,
} as const

function tools(): WebMcpTool[] {
	return [
		{
			name: 'get_about',
			description: `Get basic information about ${me.name} — name, role, and what they build.`,
			inputSchema: { ...emptyObjectSchema },
			execute: () =>
				JSON.stringify({
					name: me.name,
					role: me.role,
					tagline: me.tagline.words,
				}),
		},
		{
			name: 'get_current_projects',
			description: `List what ${me.name} is currently working on.`,
			inputSchema: { ...emptyObjectSchema },
			execute: () => JSON.stringify(me.projects),
		},
		{
			name: 'get_links',
			description: `Get ${me.name}'s public links (GitHub, X, LinkedIn, email, WhatsApp).`,
			inputSchema: { ...emptyObjectSchema },
			execute: () => JSON.stringify(me.links),
		},
	]
}

export function WebMcp() {
	useEffect(() => {
		const modelContext = document.modelContext ?? navigator.modelContext
		if (!modelContext?.registerTool) return

		const controller = new AbortController()
		const { signal } = controller

		for (const tool of tools()) {
			// Registration failures (unsupported browser, duplicate name) are
			// non-fatal — the site must keep working without WebMCP.
			modelContext.registerTool(tool, { signal }).catch(() => undefined)
		}

		return () => controller.abort()
	}, [])

	return null
}
