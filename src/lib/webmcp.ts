/**
 * Minimal WebMCP client binding (https://webmachinelearning.github.io/webmcp/).
 *
 * Shared by every component that wants to expose tools to AI agents in the
 * browser. Tools are registered through `document.modelContext` (or the older
 * `navigator.modelContext`) and unregistered via an `AbortController` signal.
 */
export type WebMcpTool = {
	name: string
	description: string
	inputSchema: Record<string, unknown>
	execute: (args: Record<string, unknown>) => Promise<string> | string
}

export type ModelContext = {
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

/**
 * Register a set of WebMCP tools and return a cleanup function that
 * unregisters them all. Feature-detected — a no-op in browsers without a
 * model context. Registration failures (unsupported browser, duplicate name)
 * are non-fatal, so the site keeps working without WebMCP.
 */
export function registerWebMcpTools(tools: WebMcpTool[]): () => void {
	const modelContext = document.modelContext ?? navigator.modelContext
	if (!modelContext?.registerTool) return () => {}

	const controller = new AbortController()
	const { signal } = controller

	for (const tool of tools) {
		modelContext.registerTool(tool, { signal }).catch(() => undefined)
	}

	return () => controller.abort()
}
