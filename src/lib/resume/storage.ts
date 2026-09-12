import { newId, type ResumeData, resumeSchema } from './types'

const STORAGE_KEY = 'resume-builder:data'
const THEME_KEY = 'resume-builder:theme'

/**
 * Persist resume state across refreshes. All functions are SSR-safe — on the
 * server (or if localStorage is unavailable) they are no-ops / return null.
 */

/**
 * Migrate legacy saved data: `experience[].description` (a single paragraph)
 * became `experience[].responsibilities` (a list of bullets). Split the old
 * paragraph into bullets so existing saves keep validating instead of wiping.
 */
function migrateExperience(data: unknown): unknown {
	if (!data || typeof data !== 'object') return data
	const obj = data as { experience?: unknown }
	if (!Array.isArray(obj.experience)) return data
	return {
		...obj,
		experience: obj.experience.map((entry) => {
			if (!entry || typeof entry !== 'object') return entry
			const exp = entry as {
				description?: unknown
				responsibilities?: unknown
			}
			if (
				typeof exp.description !== 'string' ||
				Array.isArray(exp.responsibilities)
			) {
				return entry
			}
			const bullets = exp.description
				.split(/\n+/)
				.map((line) => line.trim())
				.filter(Boolean)
			const rest = { ...exp } as Record<string, unknown>
			delete rest.description
			return {
				...rest,
				responsibilities: bullets.map((text) => ({
					id: newId('resp'),
					text,
				})),
			}
		}),
	}
}

/** Returns the stored resume, or `null` when nothing valid is saved. */
export function loadResume(): ResumeData | null {
	if (typeof window === 'undefined') return null
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY)
		if (!raw) return null
		const parsed = resumeSchema.safeParse(migrateExperience(JSON.parse(raw)))
		return parsed.success ? parsed.data : null
	} catch {
		return null
	}
}

export function saveResume(data: ResumeData): void {
	if (typeof window === 'undefined') return
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
	} catch {
		// Storage may be full or blocked (private mode); fail silently.
	}
}

export function clearResume(): void {
	if (typeof window === 'undefined') return
	try {
		window.localStorage.removeItem(STORAGE_KEY)
	} catch {
		// Ignore — clearing is best-effort.
	}
}

export function loadTheme(): string | null {
	if (typeof window === 'undefined') return null
	try {
		return window.localStorage.getItem(THEME_KEY)
	} catch {
		return null
	}
}

export function saveTheme(id: string): void {
	if (typeof window === 'undefined') return
	try {
		window.localStorage.setItem(THEME_KEY, id)
	} catch {
		// Ignore — persisting the theme is best-effort.
	}
}
