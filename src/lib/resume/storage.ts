import { type ResumeData, resumeSchema } from './types'

const STORAGE_KEY = 'resume-builder:data'
const THEME_KEY = 'resume-builder:theme'

/**
 * Persist resume state across refreshes. All functions are SSR-safe — on the
 * server (or if localStorage is unavailable) they are no-ops / return null.
 */

/** Returns the stored resume, or `null` when nothing valid is saved. */
export function loadResume(): ResumeData | null {
	if (typeof window === 'undefined') return null
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY)
		if (!raw) return null
		const parsed = resumeSchema.safeParse(JSON.parse(raw))
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
