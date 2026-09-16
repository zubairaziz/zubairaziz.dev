import { useEffect } from 'react'
import { emptyResume } from '~/lib/resume/defaults'
import type { ResumeFormApi } from '~/lib/resume/form'
import { normalizeResume } from '~/lib/resume/normalize'
import { computeSectionFilled, sections } from '~/lib/resume/sections'
import { resumeSchema } from '~/lib/resume/types'
import { RESUME_WEBMCP_TOOLS } from '~/lib/resume/webmcp-meta'
import { registerWebMcpTools, type WebMcpTool } from '~/lib/webmcp'

/**
 * WebMCP tools for the resume builder. Lets AI agents read and fill the
 * resume form through the browser's model context, using the same TanStack
 * Form instance the UI is bound to — so an agent's writes show up live in the
 * form, the preview, and localStorage exactly like a human edit.
 *
 * `set_resume` is a full replacement (get-modify-set): agents are expected to
 * call `get_resume` first, mutate the object, then send the complete result.
 */

const noArgs = {
	type: 'object',
	properties: {},
	additionalProperties: false,
} as const

const idSchema = {
	type: 'string',
	description:
		'Omit or pass an empty string — an id is generated automatically.',
}

const resumeInputSchema: Record<string, unknown> = {
	type: 'object',
	required: ['resume'],
	properties: {
		resume: {
			type: 'object',
			description:
				'The complete resume. Omitted sections are cleared, so call get_resume first and send back the full updated object.',
			properties: {
				contact: {
					type: 'object',
					properties: {
						name: { type: 'string', description: 'Full name (required).' },
						email: { type: 'string', description: 'Email address.' },
						phone: { type: 'string', description: 'Phone number.' },
						location: { type: 'string', description: 'City / region.' },
					},
				},
				summary: {
					type: 'string',
					description: 'Professional summary paragraph.',
				},
				links: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id: idSchema,
							label: {
								type: 'string',
								description: 'e.g. GitHub, LinkedIn, Portfolio.',
							},
							url: { type: 'string', description: 'A valid URL.' },
						},
					},
				},
				experience: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id: idSchema,
							position: { type: 'string' },
							company: { type: 'string' },
							startDate: { type: 'string', description: 'e.g. "01/2021".' },
							endDate: {
								type: 'string',
								description: 'e.g. "Present" or "12/2020".',
							},
							responsibilities: {
								type: 'array',
								items: {
									type: 'object',
									properties: {
										id: idSchema,
										text: { type: 'string' },
									},
								},
							},
						},
					},
				},
				education: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id: idSchema,
							school: { type: 'string' },
							degree: { type: 'string', description: 'e.g. "B.S."' },
							field: {
								type: 'string',
								description: 'e.g. "Computer Science".',
							},
							graduationDate: {
								type: 'string',
								description: 'e.g. "2018".',
							},
						},
					},
				},
				skills: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id: idSchema,
							category: {
								type: 'string',
								description: 'e.g. "Languages".',
							},
							items: {
								type: 'array',
								description: 'Skill names, e.g. ["TypeScript", "Go"].',
								items: { type: 'string' },
							},
						},
					},
				},
				certifications: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id: idSchema,
							name: { type: 'string' },
							issuer: { type: 'string' },
							date: { type: 'string', description: 'e.g. "2022".' },
						},
					},
				},
			},
		},
	},
}

function resumeTools(form: ResumeFormApi): WebMcpTool[] {
	return [
		{
			name: 'get_resume',
			description: RESUME_WEBMCP_TOOLS.get_resume.description,
			inputSchema: { ...noArgs },
			execute: () => JSON.stringify(form.state.values, null, 2),
		},
		{
			name: 'set_resume',
			description: RESUME_WEBMCP_TOOLS.set_resume.description,
			inputSchema: resumeInputSchema,
			execute: (args) => {
				const normalized = normalizeResume(args.resume)
				const parsed = resumeSchema.safeParse(normalized)
				if (!parsed.success) {
					const flat = parsed.error.flatten()
					return JSON.stringify({
						ok: false,
						error:
							'Validation failed. Fix the issues below and call set_resume again.',
						fieldErrors: flat.fieldErrors,
						formErrors: flat.formErrors,
					})
				}
				form.reset(parsed.data)
				return JSON.stringify({
					ok: true,
					filled: [...computeSectionFilled(parsed.data)],
					total: sections.length,
				})
			},
		},
		{
			name: 'clear_resume',
			description: RESUME_WEBMCP_TOOLS.clear_resume.description,
			inputSchema: { ...noArgs },
			execute: () => {
				form.reset(emptyResume())
				return JSON.stringify({ ok: true })
			},
		},
	]
}

export function ResumeWebMcp({ form }: { form: ResumeFormApi }) {
	useEffect(() => registerWebMcpTools(resumeTools(form)), [form])
	return null
}
