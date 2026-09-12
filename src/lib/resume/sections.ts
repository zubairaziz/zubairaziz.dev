import {
	AlignLeft,
	Award,
	Briefcase,
	GraduationCap,
	Link2,
	type LucideIcon,
	User,
	Wrench,
} from 'lucide-react'
import type { ResumeData } from '~/lib/resume/types'

/**
 * Section registry for the resume builder form. Order matters — it mirrors the
 * order the document renders sections, and drives both the left-hand section
 * rail and the per-section cards in the form.
 */
export interface SectionDef {
	id: string
	label: string
	icon: LucideIcon
}

export const sections: SectionDef[] = [
	{ id: 'contact', label: 'Contact', icon: User },
	{ id: 'summary', label: 'Summary', icon: AlignLeft },
	{ id: 'links', label: 'Links', icon: Link2 },
	{ id: 'experience', label: 'Experience', icon: Briefcase },
	{ id: 'education', label: 'Education', icon: GraduationCap },
	{ id: 'skills', label: 'Skills', icon: Wrench },
	{ id: 'certifications', label: 'Certifications', icon: Award },
]

/** DOM id for a section card, used for scroll-spy + anchor navigation. */
export function sectionAnchor(id: string): string {
	return `resume-section-${id}`
}

/** Which sections have any user-entered content, for the progress meter/rail. */
export function computeSectionFilled(data: ResumeData): Set<string> {
	const filled = new Set<string>()

	if (
		data.contact.name.trim() ||
		data.contact.email.trim() ||
		data.contact.phone.trim() ||
		data.contact.location.trim()
	) {
		filled.add('contact')
	}
	if (data.summary.trim()) filled.add('summary')
	if (data.links.some((l) => l.label.trim() || l.url.trim())) {
		filled.add('links')
	}
	if (data.experience.some((e) => e.company.trim() || e.position.trim())) {
		filled.add('experience')
	}
	if (
		data.education.some(
			(e) => e.school.trim() || e.degree.trim() || e.field.trim(),
		)
	) {
		filled.add('education')
	}
	if (data.skills.some((s) => s.category.trim() || s.items.length > 0)) {
		filled.add('skills')
	}
	if (data.certifications.some((c) => c.name.trim() || c.issuer.trim())) {
		filled.add('certifications')
	}

	return filled
}
