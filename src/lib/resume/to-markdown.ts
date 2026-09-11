import type { ResumeData } from './types'

/** Join the non-empty parts with a separator, dropping blanks. */
function joinParts(
	parts: Array<string | undefined>,
	separator = ' · ',
): string {
	return parts.filter((part) => part && part.trim().length > 0).join(separator)
}

/** Join a `MM/YYYY` start and end date with an en dash. */
function joinDates(start: string, end: string): string {
	if (!start.trim() && !end.trim()) return ''
	return joinParts([start, end], ' – ')
}

function pushSection(lines: string[], heading: string) {
	if (lines.length > 0) lines.push('')
	lines.push(`## ${heading}`)
	lines.push('')
}

export function resumeToMarkdown(data: ResumeData): string {
	const {
		contact,
		summary,
		links,
		experience,
		education,
		skills,
		certifications,
	} = data
	const lines: string[] = []

	// Header
	lines.push(`# ${contact.name.trim() || 'Your Name'}`)
	const contactLine = joinParts([
		contact.email,
		contact.phone,
		contact.location,
	])
	if (contactLine) {
		lines.push('')
		lines.push(contactLine)
	}

	const linkLine = links
		.filter((link) => link.label.trim() && link.url.trim())
		.map((link) => `[${link.label.trim()}](${link.url.trim()})`)
		.join(' · ')
	if (linkLine) {
		lines.push('')
		lines.push(linkLine)
	}

	// Summary (no heading — it reads as a lead paragraph)
	if (summary.trim()) {
		if (lines.length > 0) lines.push('')
		lines.push(summary.trim())
	}

	// Experience
	const experienceEntries = experience.filter(
		(entry) => entry.company.trim() || entry.position.trim(),
	)
	if (experienceEntries.length > 0) {
		pushSection(lines, 'Experience')
		for (const entry of experienceEntries) {
			const heading = joinParts([entry.position, entry.company], ' — ')
			lines.push(`### ${heading}`)
			const dates = joinDates(entry.startDate, entry.endDate)
			if (dates) lines.push(dates)
			const responsibilities = entry.responsibilities.filter((r) =>
				r.text.trim(),
			)
			if (responsibilities.length > 0) {
				lines.push('')
				for (const responsibility of responsibilities) {
					lines.push(`- ${responsibility.text.trim()}`)
				}
			}
			lines.push('')
		}
	}

	// Education
	const educationEntries = education.filter(
		(entry) => entry.school.trim() || entry.degree.trim() || entry.field.trim(),
	)
	if (educationEntries.length > 0) {
		pushSection(lines, 'Education')
		for (const entry of educationEntries) {
			lines.push(
				`### ${entry.school.trim() || entry.degree.trim() || 'Education'}`,
			)
			const detail = joinParts([
				entry.degree,
				entry.field,
				entry.graduationDate,
			])
			if (detail) lines.push(detail)
			lines.push('')
		}
	}

	// Skills
	const skillGroups = skills.filter(
		(group) => group.category.trim() || group.items.length > 0,
	)
	if (skillGroups.length > 0) {
		pushSection(lines, 'Skills')
		for (const group of skillGroups) {
			const items = group.items.filter((item) => item.trim())
			if (!group.category.trim() && items.length === 0) continue
			const bold = group.category.trim() ? `**${group.category.trim()}:** ` : ''
			lines.push(`${bold}${items.join(', ')}`)
		}
	}

	// Certifications
	const certificationEntries = certifications.filter(
		(entry) => entry.name.trim() || entry.issuer.trim(),
	)
	if (certificationEntries.length > 0) {
		pushSection(lines, 'Certifications')
		for (const entry of certificationEntries) {
			const detail = joinParts([entry.issuer, entry.date], ' — ')
			const name = entry.name.trim() || 'Certification'
			lines.push(detail ? `- **${name}** — ${detail}` : `- **${name}**`)
		}
	}

	return `${lines.join('\n').trim()}\n`
}
