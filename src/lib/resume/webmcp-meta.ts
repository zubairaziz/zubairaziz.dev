/**
 * Single source of truth for the resume builder's WebMCP tool surface.
 *
 * Imported by:
 *  - `src/components/resume/ResumeWebMcp.tsx` (client-side tool registration)
 *  - `src/lib/discovery.ts` (server-side discovery documents)
 *  - `scripts/generate-llms.ts` (build-time `public/llms.txt`)
 *
 * Keep this file free of `~/` aliases and other imports: the generate-llms
 * script loads it with Node's native type stripping, which cannot resolve
 * path aliases.
 */

export const RESUME_BUILDER_PATH = '/tools/resume-builder/'

export type ResumeWebMcpTool = {
	/** One-line summary used in discovery documents. */
	summary: string
	/** Full description used by the client-side tool schema. */
	description: string
}

export const RESUME_WEBMCP_TOOLS: Record<string, ResumeWebMcpTool> = {
	get_resume: {
		summary: 'Read the current resume as JSON.',
		description:
			'Read the resume currently being edited. Returns the full resume as JSON (contact, summary, links, experience, education, skills, certifications). Call this before set_resume so existing content is not erased.',
	},
	set_resume: {
		summary: 'Replace the resume with a complete new object.',
		description:
			'Replace the entire resume with the given resume object. This is a full replacement: any section omitted is cleared. Call get_resume first, mutate the object, then send back the complete resume.',
	},
	clear_resume: {
		summary: 'Reset the resume to empty.',
		description: 'Reset the resume to empty, removing all content.',
	},
}
