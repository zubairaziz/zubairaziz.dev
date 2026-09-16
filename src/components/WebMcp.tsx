import { useEffect } from 'react'
import { me } from '~/lib/me'
import { registerWebMcpTools, type WebMcpTool } from '~/lib/webmcp'

/**
 * WebMCP — exposes the site's key actions as client-side tools that AI agents
 * can invoke through the browser (https://webmachinelearning.github.io/webmcp/).
 */
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
	useEffect(() => registerWebMcpTools(tools()), [])

	return null
}
