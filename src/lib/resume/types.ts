import { z } from 'zod'

/**
 * Data model for the resume builder. This is the single source of truth for
 * both the form (TanStack Form) and the exports (Markdown / print-to-PDF).
 *
 * Strings that are optional in practice are modeled as plain `string` (empty =
 * absent) so the form can always render a controlled input without dealing
 * with `undefined`. The schema uses `z.literal('')` unions instead of
 * `.optional()` for the same reason.
 */

export interface Link {
	id: string
	label: string
	url: string
}

export interface ExperienceEntry {
	id: string
	company: string
	position: string
	startDate: string
	endDate: string
	description: string
}

export interface EducationEntry {
	id: string
	school: string
	degree: string
	field: string
	graduationDate: string
}

export interface SkillGroup {
	id: string
	category: string
	items: string[]
}

export interface CertificationEntry {
	id: string
	name: string
	issuer: string
	date: string
}

export interface ResumeData {
	contact: {
		name: string
		email: string
		phone: string
		location: string
	}
	summary: string
	links: Link[]
	experience: ExperienceEntry[]
	education: EducationEntry[]
	skills: SkillGroup[]
	certifications: CertificationEntry[]
}

const emptyOr = <T extends z.ZodTypeAny>(schema: T) =>
	z.union([z.literal(''), schema])

const linkSchema = z.object({
	id: z.string(),
	label: z.string().trim(),
	url: emptyOr(z.string().trim().url('Enter a valid URL')),
})

const experienceSchema = z.object({
	id: z.string(),
	company: z.string().trim(),
	position: z.string().trim(),
	startDate: z.string().trim(),
	endDate: z.string().trim(),
	description: z.string().trim(),
})

const educationSchema = z.object({
	id: z.string(),
	school: z.string().trim(),
	degree: z.string().trim(),
	field: z.string().trim(),
	graduationDate: z.string().trim(),
})

const skillGroupSchema = z.object({
	id: z.string(),
	category: z.string().trim(),
	items: z.array(z.string()),
})

const certificationSchema = z.object({
	id: z.string(),
	name: z.string().trim(),
	issuer: z.string().trim(),
	date: z.string().trim(),
})

/**
 * Full resume schema. Passed straight to TanStack Form's `validators` — zod v3
 * implements the Standard Schema interface (`~standard`), so no adapter needed.
 */
export const resumeSchema = z.object({
	contact: z.object({
		name: z.string().trim().min(1, 'Name is required'),
		email: emptyOr(z.string().trim().email('Enter a valid email')),
		phone: z.string().trim(),
		location: z.string().trim(),
	}),
	summary: z.string().trim(),
	links: z.array(linkSchema),
	experience: z.array(experienceSchema),
	education: z.array(educationSchema),
	skills: z.array(skillGroupSchema),
	certifications: z.array(certificationSchema),
})

/** Generate a stable id for a new list entry. */
export function newId(prefix: string): string {
	const rand =
		typeof crypto !== 'undefined' && 'randomUUID' in crypto
			? crypto.randomUUID().slice(0, 8)
			: Math.random().toString(36).slice(2, 10)
	return `${prefix}-${rand}`
}

/** Skills are edited in the form as a comma-separated string. */
export function splitSkills(input: string): string[] {
	return input
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean)
}

export function joinSkills(items: string[]): string {
	return items.join(', ')
}
