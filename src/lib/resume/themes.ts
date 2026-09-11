import type { CSSProperties } from 'react'

/**
 * Resume themes. Each theme is a self-contained palette + type pairing that
 * applies to the *rendered resume document* only — it does not touch the site
 * chrome, which keeps using the shadcn theme tokens per the repo's hard rules.
 */

export interface ResumeTheme {
	id: string
	name: string
	description: string
	headingFont: string
	bodyFont: string
	baseFontSize: string
	colors: {
		background: string
		text: string
		heading: string
		accent: string
		muted: string
		border: string
	}
	spacing: {
		sectionGap: string
		itemGap: string
	}
}

export const themes = {
	classic: {
		id: 'classic',
		name: 'Classic',
		description: 'Serif, navy headings, conservative spacing',
		headingFont: 'Georgia, "Times New Roman", serif',
		bodyFont: 'Georgia, "Times New Roman", serif',
		baseFontSize: '10.5pt',
		colors: {
			background: '#ffffff',
			text: '#1f2937',
			heading: '#0f1f3a',
			accent: '#1d4ed8',
			muted: '#6b7280',
			border: '#e5e7eb',
		},
		spacing: { sectionGap: '18px', itemGap: '10px' },
	},
	modern: {
		id: 'modern',
		name: 'Modern',
		description: 'Sans-serif, slate with a warm red accent',
		headingFont: '"Inter", "Helvetica Neue", Arial, system-ui, sans-serif',
		bodyFont: '"Inter", "Helvetica Neue", Arial, system-ui, sans-serif',
		baseFontSize: '10.5pt',
		colors: {
			background: '#ffffff',
			text: '#334155',
			heading: '#0f172a',
			accent: '#dc2626',
			muted: '#64748b',
			border: '#e2e8f0',
		},
		spacing: { sectionGap: '20px', itemGap: '12px' },
	},
	minimal: {
		id: 'minimal',
		name: 'Minimal',
		description: 'Airy, near-black on white, single quiet accent',
		headingFont: '"Helvetica Neue", Arial, system-ui, sans-serif',
		bodyFont: '"Helvetica Neue", Arial, system-ui, sans-serif',
		baseFontSize: '10pt',
		colors: {
			background: '#ffffff',
			text: '#404040',
			heading: '#171717',
			accent: '#059669',
			muted: '#a3a3a3',
			border: '#eeeeee',
		},
		spacing: { sectionGap: '24px', itemGap: '14px' },
	},
	crimson: {
		id: 'crimson',
		name: 'Crimson',
		description: 'Oxanium headings with the site accent',
		headingFont: '"Oxanium Variable", "Helvetica Neue", sans-serif',
		bodyFont: '"Helvetica Neue", Arial, system-ui, sans-serif',
		baseFontSize: '10.5pt',
		colors: {
			background: '#ffffff',
			text: '#292524',
			heading: '#1c1917',
			accent: '#b90033',
			muted: '#78716c',
			border: '#e7e5e4',
		},
		spacing: { sectionGap: '18px', itemGap: '10px' },
	},
	terminal: {
		id: 'terminal',
		name: 'Terminal',
		description: 'Mono, dark, matches the site aesthetic',
		headingFont:
			'"JetBrains Mono Variable", "SFMono-Regular", Menlo, monospace',
		bodyFont: '"JetBrains Mono Variable", "SFMono-Regular", Menlo, monospace',
		baseFontSize: '9.5pt',
		colors: {
			background: '#090b0c',
			text: '#e2e8f0',
			heading: '#ff1459',
			accent: '#ff1459',
			muted: '#64748b',
			border: '#1e293b',
		},
		spacing: { sectionGap: '16px', itemGap: '8px' },
	},
} satisfies Record<string, ResumeTheme>

export type ThemeId = keyof typeof themes

export const themeList: ResumeTheme[] = Object.values(themes)

export const defaultThemeId: ThemeId = 'modern'

/** Resolve a stored/unknown theme id to a valid theme. */
export function resolveTheme(id: string | null | undefined): ResumeTheme {
	return themes[id as ThemeId] ?? themes[defaultThemeId]
}

/** Resolve a stored/unknown theme id to a valid `ThemeId`. */
export function resolveThemeId(id: string | null | undefined): ThemeId {
	return resolveTheme(id).id as ThemeId
}

/**
 * Expose a theme as CSS custom properties so the preview document (and the
 * print stylesheet) can consume it without inline color literals everywhere.
 */
export function themeToStyle(theme: ResumeTheme): CSSProperties {
	return {
		'--resume-bg': theme.colors.background,
		'--resume-text': theme.colors.text,
		'--resume-heading': theme.colors.heading,
		'--resume-accent': theme.colors.accent,
		'--resume-muted': theme.colors.muted,
		'--resume-border': theme.colors.border,
		'--resume-heading-font': theme.headingFont,
		'--resume-body-font': theme.bodyFont,
		'--resume-font-size': theme.baseFontSize,
		'--resume-section-gap': theme.spacing.sectionGap,
		'--resume-item-gap': theme.spacing.itemGap,
	} as CSSProperties
}
